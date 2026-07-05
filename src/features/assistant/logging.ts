import "server-only";

import crypto from "node:crypto";
import type { AppLocale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";

const CONVERSATION_LOOKBACK_DAYS = 30;
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

export async function logAssistantExchange({
  meta,
  locale,
  responseLocale,
  pagePath,
  userMessage,
  assistantAnswer,
  model,
  scoped,
}: {
  meta: AssistantRequestMeta;
  locale: AppLocale;
  responseLocale: AppLocale;
  pagePath?: string;
  userMessage: string;
  assistantAnswer: string;
  model?: string;
  scoped?: boolean;
}): Promise<void> {
  if (!userMessage.trim() || !assistantAnswer.trim()) return;

  try {
    const since = new Date(Date.now() - CONVERSATION_LOOKBACK_DAYS * 24 * 60 * 60 * 1000);
    const existing = await prisma.assistantConversation.findFirst({
      where: {
        visitorKey: meta.visitorKey,
        lastMessageAt: { gte: since },
      },
      orderBy: { lastMessageAt: "desc" },
      select: { id: true },
    });

    const newMessages = [
      { role: "user", content: userMessage.trim(), responseLocale: undefined },
      { role: "assistant", content: assistantAnswer.trim(), model, scoped, responseLocale },
    ];

    const conversation = existing
      ? await prisma.assistantConversation.update({
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
            lastMessageAt: new Date(),
            telegramNotifiedAt: null,
            messageCount: { increment: newMessages.length },
          },
          select: { id: true },
        })
      : await prisma.assistantConversation.create({
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
            lastMessageAt: new Date(),
            telegramNotifiedAt: null,
            messageCount: newMessages.length,
          },
          select: { id: true },
        });

    await prisma.assistantMessage.createMany({
      data: newMessages.map((message) => ({
        conversationId: conversation.id,
        role: message.role,
        content: message.content,
        model: "model" in message ? message.model : undefined,
        scoped: "scoped" in message ? message.scoped : undefined,
        responseLocale: "responseLocale" in message ? message.responseLocale : undefined,
      })),
    });
  } catch (error) {
    console.warn("[assistant-log] Conversation logging skipped.", {
      message: error instanceof Error ? error.message : "Unknown database error",
    });
  }
}
