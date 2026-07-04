import { NextResponse } from "next/server";
import { z } from "zod";
import { isAppLocale, type AppLocale } from "@/i18n/routing";
import {
  assistantFallbackAnswer,
  assistantOffTopicAnswer,
  buildAssistantInput,
  type AssistantChatMessage,
} from "@/features/assistant/knowledge";

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
  messages,
  pagePath,
}: {
  locale: AppLocale;
  messages: AssistantChatMessage[];
  pagePath?: string;
}): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return sanitizeAssistantAnswer(assistantFallbackAnswer(locale));
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: modelName(),
      input: buildAssistantInput({ locale, messages, pagePath }),
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
    return sanitizeAssistantAnswer(assistantFallbackAnswer(locale));
  }

  return sanitizeAssistantAnswer(outputText(payload) || assistantFallbackAnswer(locale));
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
  if (isOffTopicQuestion(latestUserMessage(parsed.data.messages))) {
    return NextResponse.json(
      {
        ok: true,
        answer: sanitizeAssistantAnswer(assistantOffTopicAnswer(locale)),
        configured: Boolean(process.env.OPENAI_API_KEY?.trim()),
        scoped: false,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const answer = await createAssistantResponse({
    locale,
    messages: parsed.data.messages,
    pagePath: parsed.data.pagePath,
  });

  return NextResponse.json(
    {
      ok: true,
      answer,
      configured: Boolean(process.env.OPENAI_API_KEY?.trim()),
      model: process.env.OPENAI_API_KEY?.trim() ? modelName() : undefined,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
