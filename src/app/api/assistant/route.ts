import { NextResponse } from "next/server";
import { z } from "zod";
import { isAppLocale, type AppLocale } from "@/i18n/routing";
import {
  assistantFallbackAnswer,
  assistantImplementationBoundaryAnswer,
  assistantOffTopicAnswer,
  assistantSecurityBoundaryAnswer,
  buildAssistantInput,
  type AssistantChatMessage,
} from "@/features/assistant/knowledge";
import {
  assistantRequestMeta,
  ensureAssistantConversation,
  isAssistantIpBlocked,
  loadAssistantMemory,
  logAssistantExchange,
} from "@/features/assistant/logging";
import { createAssistantLead } from "@/features/assistant/lead";
import { leadAttributionPayloadSchema } from "@/features/analytics/attribution.server";
import {
  deriveAssistantFunnelStage,
  latestMessageConfirmsContact,
  latestMessageRequestsContact,
  updateAssistantSalesProfile,
  type AssistantFunnelStage,
  type AssistantSalesProfile,
} from "@/features/assistant/profile";
import {
  containsCompleteSourceDeliverable,
  isExecutableMarkupProbe,
  isImplementationDeliverableRequest,
} from "@/features/assistant/policy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 24;
const MAX_MESSAGE_CHARS = 1_200;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 12;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
});

const requestSchema = z.object({
  locale: z.string().default("de"),
  pagePath: z.string().trim().max(300).optional(),
  visitorId: z.string().trim().max(80).optional(),
  attribution: leadAttributionPayloadSchema.optional(),
  messages: z.array(messageSchema).min(1).max(MAX_MESSAGES),
});

const GREETING_PATTERNS = [
  /\bhello\b/i,
  /\bhi\b/i,
  /\bhey\b/i,
  /\bhallo\b/i,
  /\bguten\s+(tag|morgen|abend)\b/i,
  /\bпривет\b/i,
  /\bздравств/i,
  /\bдобрый\s+(день|вечер|утро)\b/i,
];

const RELEVANT_PATTERNS = [
  /saaleweb/i,
  /website|webseite|webdesign|site|сайт|веб/i,
  /seo|google|ranking|sichtbarkeit|видимост|поиск|lokal|local|halle|leipzig|галле|лейпциг/i,
  /\bki\b|ai|gpt|chatgpt|gemini|claude|perplexity|aio|geo|llm|ассистент|искусствен/i,
  /wordpress|next\.?js|react|java|cms|hosting|domain|домен|хостинг/i,
  /relaunch|редизайн|перезапуск|modernisierung|модернизац/i,
  /automation|automatisierung|автоматизац|api|integration|интеграц/i,
  /booking|buchung|termin|запис|брон/i,
  /shop|e-?commerce|магазин|online-shop/i,
  /preis|kosten|budget|angebot|price|cost|стоимост|цена|бюджет/i,
  /projekt|project|проект|консультац|kontakt|contact|whatsapp|telegram/i,
  /услуг|leistungen|services|что\s+вы\s+дела|what\s+do\s+you\s+do|wer\s+seid/i,
  /lead|anfrage|kunden|заявк|клиент|business|unternehmen|бизнес/i,
];

const OFF_TOPIC_PATTERNS = [
  /(?:^|\s)\d+\s*[+\-*/x\u00d7\u00f7]\s*\d+(?=\s|[?.!,;:]|$)/i,
  /(?:^|\s)\d+\s*[+\-*/x×÷]\s*\d+(?:\s|$)/i,
  /сколько\s+будет/i,
  /what\s+is\s+\d+/i,
  /calculate|solve|реши|посчитай/i,
  /weather|погода|wetter/i,
  /recipe|рецепт|kochen/i,
  /joke|анекдот|witz/i,
  /политик|politics/i,
  /homework|домашн/i,
];

function latestUserMessage(messages: AssistantChatMessage[]): string {
  return [...messages].reverse().find((message) => message.role === "user")?.content || "";
}

function sameMessage(left: AssistantChatMessage, right: AssistantChatMessage): boolean {
  return left.role === right.role && left.content.trim() === right.content.trim();
}

function mergeContextMessages(
  stored: AssistantChatMessage[],
  incoming: AssistantChatMessage[],
): AssistantChatMessage[] {
  const maxOverlap = Math.min(stored.length, incoming.length);
  let overlap = 0;
  for (let size = maxOverlap; size > 0; size -= 1) {
    const storedOffset = stored.length - size;
    if (incoming.slice(0, size).every((message, index) => sameMessage(stored[storedOffset + index], message))) {
      overlap = size;
      break;
    }
  }
  return [...stored, ...incoming.slice(overlap)].slice(-18);
}

function countPatternMatches(text: string, pattern: RegExp): number {
  return Array.from(text.matchAll(pattern)).length;
}

function detectResponseLocale(text: string, fallback: AppLocale): AppLocale {
  const clean = text.trim();
  if (!clean) return fallback;

  const cyrillicCount = countPatternMatches(clean, /\p{Script=Cyrillic}/gu);
  if (cyrillicCount >= 2) return "ru";

  const germanScore =
    countPatternMatches(
      clean,
      /\b(aber|angebot|bitte|brauche|danke|deutsch|eine|einen|erstgespraech|erstgespr[aä]ch|fuer|für|guten|hallo|ich|ihre|ihren|kann|koennen|können|kosten|meine|meinen|mit|moechte|möchte|oder|preis|projekt|seite|sie|und|was|webseite|wie|wir)\b/gi,
    ) + countPatternMatches(clean, /[\u00c4\u00d6\u00dc\u00e4\u00f6\u00fc\u00df]/g);

  const englishScore = countPatternMatches(
    clean,
    /\b(about|better|business|can|contact|cost|english|for|hello|help|hi|how|make|much|my|need|price|project|site|thanks|the|website|what|which|with|you|your)\b/gi,
  );

  if (englishScore > germanScore && englishScore > 0) return "en";
  if (germanScore > englishScore && germanScore > 0) return "de";

  return fallback;
}

function isGreeting(text: string): boolean {
  const clean = text.trim();
  if (clean.length > 80) return false;
  return GREETING_PATTERNS.some((pattern) => pattern.test(clean));
}

function isRelevantQuestion(text: string): boolean {
  return RELEVANT_PATTERNS.some((pattern) => pattern.test(text));
}

function isOffTopicQuestion(text: string): boolean {
  if (isGreeting(text) || isRelevantQuestion(text)) return false;
  return OFF_TOPIC_PATTERNS.some((pattern) => pattern.test(text));
}

function clientKey(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "anonymous"
  );
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function modelName(): string {
  return process.env.OPENAI_MODEL?.trim() || "gpt-5.4-mini";
}

function outputText(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const maybeOutputText = (payload as { output_text?: unknown }).output_text;
  if (typeof maybeOutputText === "string" && maybeOutputText.trim()) {
    return maybeOutputText.trim();
  }

  const output = (payload as { output?: unknown }).output;
  if (!Array.isArray(output)) return undefined;

  const parts: string[] = [];
  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;

    for (const block of content) {
      if (!block || typeof block !== "object") continue;
      const text = (block as { text?: unknown }).text;
      if (typeof text === "string" && text.trim()) parts.push(text.trim());
    }
  }

  return parts.join("\n\n").trim() || undefined;
}

function sanitizeAssistantAnswer(answer: string): string {
  return answer
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function createAssistantResponse({
  locale,
  responseLocale,
  messages,
  pagePath,
  profile,
  funnelStage,
  handoffConfirmed,
}: {
  locale: AppLocale;
  responseLocale: AppLocale;
  messages: AssistantChatMessage[];
  pagePath?: string;
  profile: AssistantSalesProfile;
  funnelStage: AssistantFunnelStage;
  handoffConfirmed: boolean;
}): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return sanitizeAssistantAnswer(assistantFallbackAnswer(responseLocale));
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: modelName(),
      input: buildAssistantInput({
        locale,
        responseLocale,
        messages,
        pagePath,
        profile,
        funnelStage,
        handoffConfirmed,
      }),
      max_output_tokens: 650,
    }),
  });

  const payload = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    console.error("[assistant] OpenAI request failed.", {
      status: response.status,
      model: modelName(),
      error:
        payload && typeof payload === "object"
          ? (payload as { error?: { message?: string } }).error?.message
          : "Unknown OpenAI error",
    });
    return sanitizeAssistantAnswer(assistantFallbackAnswer(responseLocale));
  }

  const answer = sanitizeAssistantAnswer(outputText(payload) || assistantFallbackAnswer(responseLocale));
  return containsCompleteSourceDeliverable(answer)
    ? assistantImplementationBoundaryAnswer(responseLocale)
    : answer;
}

export async function POST(req: Request) {
  if (isRateLimited(clientKey(req))) {
    return NextResponse.json(
      {
        ok: false,
        error: "rate_limited",
      },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    console.warn("[assistant] Invalid request.", {
      issues: parsed.error.issues.map((issue) => ({
        code: issue.code,
        path: issue.path.join("."),
        message: issue.message,
      })),
      messagesCount:
        json && typeof json === "object" && Array.isArray((json as { messages?: unknown }).messages)
          ? (json as { messages: unknown[] }).messages.length
          : undefined,
    });

    return NextResponse.json(
      {
        ok: false,
        error: "invalid_request",
      },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const locale = isAppLocale(parsed.data.locale) ? parsed.data.locale : "de";
  const latestMessage = latestUserMessage(parsed.data.messages);
  const responseLocale = detectResponseLocale(latestMessage, locale);
  const meta = assistantRequestMeta(req, parsed.data.visitorId);

  if (await isAssistantIpBlocked(meta.ipAddress)) {
    return NextResponse.json(
      {
        ok: false,
        error: "blocked",
        responseLocale,
      },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  const memory = await loadAssistantMemory(meta.visitorKey);
  const profile = updateAssistantSalesProfile(memory.profile, parsed.data.messages);
  const initialStage = deriveAssistantFunnelStage(profile, Boolean(memory.leadId));
  const prepared = await ensureAssistantConversation({
    conversationId: memory.conversationId,
    meta,
    locale,
    responseLocale,
    pagePath: parsed.data.pagePath,
    profile,
    funnelStage: initialStage,
  });
  const contextMessages = mergeContextMessages(memory.messages, parsed.data.messages);

  const policyAnswer = isExecutableMarkupProbe(latestMessage)
    ? assistantSecurityBoundaryAnswer(responseLocale)
    : isImplementationDeliverableRequest(latestMessage)
      ? assistantImplementationBoundaryAnswer(responseLocale)
      : undefined;

  if (policyAnswer) {
    const answer = sanitizeAssistantAnswer(policyAnswer);
    await logAssistantExchange({
      conversationId: prepared?.id,
      meta,
      locale,
      responseLocale,
      pagePath: parsed.data.pagePath,
      userMessage: latestMessage,
      assistantAnswer: answer,
      scoped: true,
      profile,
      funnelStage: initialStage,
    });

    return NextResponse.json(
      {
        ok: true,
        answer,
        configured: Boolean(process.env.OPENAI_API_KEY?.trim()),
        scoped: true,
        responseLocale,
        funnelStage: initialStage,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  if (isOffTopicQuestion(latestMessage)) {
    const answer = sanitizeAssistantAnswer(assistantOffTopicAnswer(responseLocale));
    await logAssistantExchange({
      conversationId: prepared?.id,
      meta,
      locale,
      responseLocale,
      pagePath: parsed.data.pagePath,
      userMessage: latestMessage,
      assistantAnswer: answer,
      scoped: false,
      profile,
      funnelStage: initialStage,
    });

    return NextResponse.json(
      {
        ok: true,
        answer,
        configured: Boolean(process.env.OPENAI_API_KEY?.trim()),
        scoped: false,
        responseLocale,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const profileHasContact = Boolean(profile.phone || profile.email);
  const incomingContainsContact = parsed.data.messages.some(
    (message) =>
      message.role === "user" &&
      (latestMessageRequestsContact(message.content) ||
        (profileHasContact && profile.contactRequested && latestMessageConfirmsContact(message.content))),
  );
  const shouldCreateLead =
    Boolean(prepared?.id) &&
    !prepared?.leadId &&
    profile.contactRequested &&
    profileHasContact &&
    incomingContainsContact;
  const leadResult = shouldCreateLead
    ? await createAssistantLead({
        conversationId: prepared!.id,
        profile,
        locale,
        pagePath: parsed.data.pagePath,
        attribution: parsed.data.attribution,
      })
    : { created: false, leadId: prepared?.leadId };
  const handoffConfirmed = Boolean(prepared?.leadId || leadResult.leadId);
  const funnelStage = deriveAssistantFunnelStage(profile, handoffConfirmed);

  const answer = await createAssistantResponse({
    locale,
    responseLocale,
    messages: contextMessages,
    pagePath: parsed.data.pagePath,
    profile,
    funnelStage,
    handoffConfirmed,
  });
  await logAssistantExchange({
    conversationId: prepared?.id,
    meta,
    locale,
    responseLocale,
    pagePath: parsed.data.pagePath,
    userMessage: latestMessage,
    assistantAnswer: answer,
    model: process.env.OPENAI_API_KEY?.trim() ? modelName() : undefined,
    scoped: true,
    profile,
    funnelStage,
  });

  return NextResponse.json(
    {
      ok: true,
      answer,
      configured: Boolean(process.env.OPENAI_API_KEY?.trim()),
      model: process.env.OPENAI_API_KEY?.trim() ? modelName() : undefined,
      scoped: true,
      responseLocale,
      funnelStage,
      handoffConfirmed,
      leadCreated: leadResult.created,
      conversion: leadResult.created ? leadResult.conversion : undefined,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
