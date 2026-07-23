import "server-only";

import crypto from "node:crypto";
import type { AppLocale } from "@/i18n/routing";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { AssistantChatMessage } from "./knowledge";
import {
  emptyAssistantSalesProfile,
  readAssistantSalesProfile,
  type AssistantFunnelStage,
  type AssistantSalesProfile,
} from "./profile";
import { ASSISTANT_SESSION_IDLE_MS } from "./session";

// A conversation is one active chat session. The stable visitor key may live
// longer, but an old transcript must not absorb an unrelated return visit.
const VISITOR_ID_MAX_LENGTH = 80;

export type AssistantRequestMeta = {
  ipAddress?: string;
  ipHash?: string;
  visitorKey: string;
  userAgent?: string;
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
};

export type AssistantMemory = {
  conversationId?: string;
  profile: AssistantSalesProfile;
  funnelStage: AssistantFunnelStage;
  leadId?: string;
  messages: AssistantChatMessage[];
};

function firstHeaderValue(value: string | null): string | undefined {
  return value
    ?.split(",")[0]
    ?.trim()
    .replace(/^"|"$/g, "") || undefined;
}

function decodedHeader(value: string | null): string | undefined {
  const clean = firstHeaderValue(value);
  if (!clean) return undefined;

  try {
    return decodeURIComponent(clean.replace(/\+/g, " "));
  } catch {
    return clean;
  }
}

function hashIp(ipAddress?: string): string | undefined {
  if (!ipAddress) return undefined;
  const salt = process.env.ANALYTICS_SALT?.trim() || process.env.AUTH_SECRET?.trim() || "saaleweb-assistant";
  return crypto.createHash("sha256").update(`${salt}:${ipAddress}`).digest("hex");
}

function normalizeVisitorId(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const clean = value.trim();
  if (!clean || clean.length > VISITOR_ID_MAX_LENGTH) return undefined;
  if (!/^[a-zA-Z0-9._:-]+$/.test(clean)) return undefined;
  return clean;
}

export function assistantRequestMeta(req: Request, visitorId?: unknown): AssistantRequestMeta {
  const ipAddress =
    firstHeaderValue(req.headers.get("cf-connecting-ip")) ||
    firstHeaderValue(req.headers.get("x-real-ip")) ||
    firstHeaderValue(req.headers.get("x-forwarded-for")) ||
    firstHeaderValue(req.headers.get("x-client-ip"));
  const ipHash = hashIp(ipAddress);
  const normalizedVisitorId = normalizeVisitorId(visitorId);

  return {
    ipAddress,
    ipHash,
    visitorKey: normalizedVisitorId ? `client:${normalizedVisitorId}` : ipHash ? `ip:${ipHash}` : "anonymous",
    userAgent: req.headers.get("user-agent")?.slice(0, 500) || undefined,
    country:
      decodedHeader(req.headers.get("x-vercel-ip-country")) ||
      decodedHeader(req.headers.get("cf-ipcountry")) ||
      decodedHeader(req.headers.get("x-country-code")),
    city:
      decodedHeader(req.headers.get("x-vercel-ip-city")) ||
      decodedHeader(req.headers.get("cf-ipcity")) ||
      decodedHeader(req.headers.get("x-city")),
    region:
      decodedHeader(req.headers.get("x-vercel-ip-country-region")) ||
      decodedHeader(req.headers.get("cf-region")) ||
      decodedHeader(req.headers.get("x-region")),
    timezone: decodedHeader(req.headers.get("x-vercel-ip-timezone")) || decodedHeader(req.headers.get("cf-timezone")),
  };
}

export async function isAssistantIpBlocked(ipAddress?: string): Promise<boolean> {
  if (!ipAddress) return false;

  try {
    const blocked = await prisma.blockedIp.findUnique({
      where: { ipAddress },
      select: { id: true },
    });
    return Boolean(blocked);
  } catch (error) {
    console.warn("[assistant-log] Blocked IP check skipped.", {
      message: error instanceof Error ? error.message : "Unknown database error",
    });
    return false;
  }
}

function normalizeFunnelStage(value: unknown): AssistantFunnelStage {
  return value === "QUALIFICATION" ||
    value === "SOLUTION" ||
    value === "PROPOSAL" ||
    value === "CONTACT" ||
    value === "HANDOFF"
    ? value
    : "DISCOVERY";
}

function profileJson(profile: AssistantSalesProfile): Prisma.InputJsonValue {
  return profile as unknown as Prisma.InputJsonValue;
}

export async function loadAssistantMemory(visitorKey: string): Promise<AssistantMemory> {
  try {
    const since = new Date(Date.now() - ASSISTANT_SESSION_IDLE_MS);
    const conversation = await prisma.assistantConversation.findFirst({
      where: { visitorKey, lastMessageAt: { gte: since } },
      orderBy: { lastMessageAt: "desc" },
      select: {
        id: true,
        salesProfile: true,
        funnelStage: true,
        leadId: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 12,
          select: { role: true, content: true },
        },
      },
    });

    if (!conversation) {
      return {
        profile: emptyAssistantSalesProfile(),
        funnelStage: "DISCOVERY",
        messages: [],
      };
    }

    return {
      conversationId: conversation.id,
      profile: readAssistantSalesProfile(conversation.salesProfile),
      funnelStage: normalizeFunnelStage(conversation.funnelStage),
      leadId: conversation.leadId || undefined,
      messages: conversation.messages
        .reverse()
        .filter(
          (message): message is AssistantChatMessage =>
            (message.role === "user" || message.role === "assistant") && Boolean(message.content.trim()),
        )
        .map((message) => ({ role: message.role, content: message.content })),
    };
  } catch (error) {
    console.warn("[assistant-log] Memory loading skipped.", {
      message: error instanceof Error ? error.message : "Unknown database error",
    });
    return {
      profile: emptyAssistantSalesProfile(),
      funnelStage: "DISCOVERY",
      messages: [],
    };
  }
}

export async function ensureAssistantConversation({
  conversationId,
  meta,
  locale,
  responseLocale,
  pagePath,
  profile,
  funnelStage,
}: {
  conversationId?: string;
  meta: AssistantRequestMeta;
  locale: AppLocale;
  responseLocale: AppLocale;
  pagePath?: string;
  profile: AssistantSalesProfile;
  funnelStage: AssistantFunnelStage;
}): Promise<{ id: string; leadId?: string } | null> {
  try {
    const since = new Date(Date.now() - ASSISTANT_SESSION_IDLE_MS);
    const existing = conversationId
      ? await prisma.assistantConversation.findFirst({
          where: { id: conversationId, lastMessageAt: { gte: since } },
          select: { id: true, leadId: true },
        })
      : await prisma.assistantConversation.findFirst({
          where: { visitorKey: meta.visitorKey, lastMessageAt: { gte: since } },
          orderBy: { lastMessageAt: "desc" },
          select: { id: true, leadId: true },
        });

    if (existing) {
      const updated = await prisma.assistantConversation.update({
        where: { id: existing.id },
        data: {
          ipAddress: meta.ipAddress,
          ipHash: meta.ipHash,
          userAgent: meta.userAgent,
          country: meta.country,
          city: meta.city,
          region: meta.region,
          timezone: meta.timezone,
          locale,
          responseLocale,
          pagePath,
          salesProfile: profileJson(profile),
          funnelStage: existing.leadId ? "HANDOFF" : funnelStage,
          lastMessageAt: new Date(),
          telegramNotifiedAt: null,
        },
        select: { id: true, leadId: true },
      });
      return { id: updated.id, leadId: updated.leadId || undefined };
    }

    const created = await prisma.assistantConversation.create({
      data: {
        visitorKey: meta.visitorKey,
        ipAddress: meta.ipAddress,
        ipHash: meta.ipHash,
        userAgent: meta.userAgent,
        country: meta.country,
        city: meta.city,
        region: meta.region,
        timezone: meta.timezone,
        locale,
        responseLocale,
        pagePath,
        salesProfile: profileJson(profile),
        funnelStage,
        lastMessageAt: new Date(),
        telegramNotifiedAt: null,
        messageCount: 0,
      },
      select: { id: true },
    });
    return { id: created.id };
  } catch (error) {
    console.warn("[assistant-log] Conversation preparation skipped.", {
      message: error instanceof Error ? error.message : "Unknown database error",
    });
    return null;
  }
}

export async function logAssistantExchange({
  conversationId,
  meta,
  locale,
  responseLocale,
  pagePath,
  userMessage,
  assistantAnswer,
  model,
  scoped,
  profile,
  funnelStage,
}: {
  conversationId?: string;
  meta: AssistantRequestMeta;
  locale: AppLocale;
  responseLocale: AppLocale;
  pagePath?: string;
  userMessage: string;
  assistantAnswer: string;
  model?: string;
  scoped?: boolean;
  profile?: AssistantSalesProfile;
  funnelStage?: AssistantFunnelStage;
}): Promise<{ conversationId?: string }> {
  if (!userMessage.trim() || !assistantAnswer.trim()) return {};

  try {
    const prepared = await ensureAssistantConversation({
      conversationId,
      meta,
      locale,
      responseLocale,
      pagePath,
      profile: profile || emptyAssistantSalesProfile(),
      funnelStage: funnelStage || "DISCOVERY",
    });
    if (!prepared) return {};

    const newMessages = [
      { role: "user", content: userMessage.trim(), responseLocale: undefined },
      { role: "assistant", content: assistantAnswer.trim(), model, scoped, responseLocale },
    ];

    await prisma.assistantConversation.update({
      where: { id: prepared.id },
      data: {
        lastMessageAt: new Date(),
        telegramNotifiedAt: null,
        messageCount: { increment: newMessages.length },
      },
    });

    await prisma.assistantMessage.createMany({
      data: newMessages.map((message) => ({
        conversationId: prepared.id,
        role: message.role,
        content: message.content,
        model: "model" in message ? message.model : undefined,
        scoped: "scoped" in message ? message.scoped : undefined,
        responseLocale: "responseLocale" in message ? message.responseLocale : undefined,
      })),
    });
    return { conversationId: prepared.id };
  } catch (error) {
    console.warn("[assistant-log] Conversation logging skipped.", {
      message: error instanceof Error ? error.message : "Unknown database error",
    });
    return {};
  }
}
