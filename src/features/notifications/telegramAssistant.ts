import "server-only";

import { prisma } from "@/lib/prisma";
import { sendTelegramAdminMessage } from "./telegram";

const LIST_LIMIT = 10;
const MESSAGE_LIMIT = 14;
const DIGEST_LIMIT = 5;
const DEFAULT_QUIET_SECONDS = 60;

export type AssistantDigestResult = {
  scanned: number;
  sent: number;
  failed: number;
};

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://saaleweb.de").replace(/\/+$/, "");
}

function formatDateTime(date: Date): string {
  const timeZone = process.env.TELEGRAM_REPORT_TIMEZONE || "Europe/Berlin";
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      timeZone,
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Europe/Berlin",
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  }
}

function shortId(id: string): string {
  return id.slice(0, 8);
}

function trimText(value?: string | null, maxLength = 380): string {
  const clean = value?.replace(/\s+/g, " ").trim();
  if (!clean) return "-";
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1)}…`;
}

function locationLabel(item: { country?: string | null; city?: string | null; region?: string | null }): string {
  return [item.city, item.region, item.country].filter(Boolean).join(", ") || "-";
}

function looksLikeIp(value: string): boolean {
  return value.includes(".") || value.includes(":");
}

async function findConversation(handle: string) {
  const clean = handle.trim();
  if (!clean) return null;

  const direct = await prisma.assistantConversation.findUnique({
    where: { id: clean },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (direct) return direct;

  return prisma.assistantConversation.findFirst({
    where: { id: { startsWith: clean } },
    orderBy: { lastMessageAt: "desc" },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function buildAssistantConversationsReport(): Promise<string> {
  try {
    const conversations = await prisma.assistantConversation.findMany({
      orderBy: { lastMessageAt: "desc" },
      take: LIST_LIMIT,
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (conversations.length === 0) {
      return [
        "💬 AI-диалоги SaaleWeb",
        "",
        "Пока нет сохранённых переписок с ассистентом.",
        "",
        `Админка: ${siteUrl()}/admin/assistant`,
      ].join("\n");
    }

    const lines = conversations.map((conversation, index) => {
      const lastMessage = conversation.messages[0];
      const visitor = conversation.ipAddress || shortId(conversation.visitorKey);
      return [
        `${index + 1}. #${shortId(conversation.id)} · ${visitor}`,
        `   🕒 ${formatDateTime(conversation.lastMessageAt)} · ${conversation.messageCount} сообщ.`,
        `   🌍 ${locationLabel(conversation)} · ${conversation.locale}/${conversation.responseLocale}`,
        `   💬 ${trimText(lastMessage?.content, 120)}`,
        `   Читать: /assistant ${shortId(conversation.id)}`,
      ].join("\n");
    });

    return [
      "💬 AI-диалоги SaaleWeb",
      "",
      ...lines,
      "",
      "Команды:",
      "/assistant <id> — открыть переписку",
      "/assistant_block <id или IP> — заблокировать IP",
      "/assistant_unblock <IP> — разблокировать IP",
      "",
      `Админка: ${siteUrl()}/admin/assistant`,
    ].join("\n\n");
  } catch (error) {
    return `💬 AI-диалоги недоступны: ${error instanceof Error ? error.message : "ошибка БД"}`;
  }
}

export async function buildAssistantConversationReport(handle?: string): Promise<string> {
  if (!handle?.trim()) return buildAssistantConversationsReport();

  try {
    const conversation = await findConversation(handle);
    if (!conversation) return `AI-диалог ${handle} не найден.`;

    const messages = conversation.messages.slice(-MESSAGE_LIMIT);
    const messageLines = messages.map((message) => {
      const role = message.role === "user" ? "👤 Клиент" : "🤖 Ассистент";
      const meta = [
        formatDateTime(message.createdAt),
        message.responseLocale,
        message.scoped === false ? "off-topic" : undefined,
      ]
        .filter(Boolean)
        .join(" · ");
      return `${role} (${meta})\n${trimText(message.content, 700)}`;
    });

    return [
      `💬 AI-диалог #${shortId(conversation.id)}`,
      "",
      `🕒 Последняя активность: ${formatDateTime(conversation.lastMessageAt)}`,
      `🌐 IP: ${conversation.ipAddress || "-"}`,
      `🌍 Место: ${locationLabel(conversation)}`,
      `🧭 Страница: ${conversation.pagePath || "-"}`,
      `🗣 Язык: ${conversation.locale} / ответ: ${conversation.responseLocale}`,
      `🔢 Сообщений: ${conversation.messageCount}`,
      "",
      ...messageLines,
      "",
      conversation.ipAddress
        ? `Блокировка: /assistant_block ${shortId(conversation.id)}`
        : "Блокировка недоступна: IP не определён.",
      `Админка: ${siteUrl()}/admin/assistant/${conversation.id}`,
    ].join("\n\n");
  } catch (error) {
    return `AI-диалог недоступен: ${error instanceof Error ? error.message : "ошибка БД"}`;
  }
}

export async function blockAssistantTarget(target?: string, reason?: string): Promise<string> {
  const clean = target?.trim();
  if (!clean) return "Укажите ID диалога или IP: /assistant_block <id или IP>";

  try {
    let ipAddress = looksLikeIp(clean) ? clean : undefined;
    if (!ipAddress) {
      const conversation = await findConversation(clean);
      ipAddress = conversation?.ipAddress || undefined;
    }

    if (!ipAddress) return `Не удалось определить IP для ${clean}.`;

    await prisma.blockedIp.upsert({
      where: { ipAddress },
      update: { reason: reason?.trim() || "Blocked from Telegram" },
      create: { ipAddress, reason: reason?.trim() || "Blocked from Telegram" },
    });

    return `🚫 IP заблокирован: ${ipAddress}`;
  } catch (error) {
    return `Не удалось заблокировать IP: ${error instanceof Error ? error.message : "ошибка БД"}`;
  }
}

export async function unblockAssistantTarget(target?: string): Promise<string> {
  const clean = target?.trim();
  if (!clean) return "Укажите IP: /assistant_unblock <IP>";

  try {
    await prisma.blockedIp.deleteMany({ where: { ipAddress: clean } });
    return `✅ IP разблокирован: ${clean}`;
  } catch (error) {
    return `Не удалось разблокировать IP: ${error instanceof Error ? error.message : "ошибка БД"}`;
  }
}

function assistantDigestMessage(conversation: {
  id: string;
  ipAddress: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  pagePath: string | null;
  locale: string;
  responseLocale: string;
  messageCount: number;
  lastMessageAt: Date;
  messages: Array<{
    role: string;
    content: string;
    createdAt: Date;
    responseLocale: string | null;
    scoped: boolean | null;
  }>;
}): string {
  const messages = [...conversation.messages].reverse();
  const messageLines = messages.map((message) => {
    const role = message.role === "user" ? "👤 Клиент" : "🤖 Ассистент";
    const meta = [
      formatDateTime(message.createdAt),
      message.responseLocale,
      message.scoped === false ? "off-topic" : undefined,
    ]
      .filter(Boolean)
      .join(" · ");
    return `${role} (${meta})\n${trimText(message.content, 520)}`;
  });

  return [
    `💬 Новый AI-диалог SaaleWeb #${shortId(conversation.id)}`,
    "",
    `🕒 Завершён/пауза: ${formatDateTime(conversation.lastMessageAt)}`,
    `🌐 IP: ${conversation.ipAddress || "-"}`,
    `🌍 Место: ${locationLabel(conversation)}`,
    `🧭 Страница: ${conversation.pagePath || "-"}`,
    `🗣 Язык: ${conversation.locale} / ответ: ${conversation.responseLocale}`,
    `🔢 Сообщений: ${conversation.messageCount}`,
    "",
    ...messageLines,
    "",
    conversation.ipAddress
      ? `🚫 Заблокировать IP: /assistant_block ${shortId(conversation.id)}`
      : "🚫 Блокировка недоступна: IP не определён.",
    `📂 Открыть в админке: ${siteUrl()}/admin/assistant/${conversation.id}`,
  ].join("\n\n");
}

export async function sendAssistantConversationDigests({
  quietSeconds = DEFAULT_QUIET_SECONDS,
  limit = DIGEST_LIMIT,
  force = false,
}: {
  quietSeconds?: number;
  limit?: number;
  force?: boolean;
} = {}): Promise<AssistantDigestResult> {
  const safeQuietSeconds = Math.max(10, Math.min(3600, Math.floor(quietSeconds)));
  const safeLimit = Math.max(1, Math.min(20, Math.floor(limit)));
  const cutoff = new Date(Date.now() - safeQuietSeconds * 1000);

  const conversations = await prisma.assistantConversation.findMany({
    where: {
      messageCount: { gt: 0 },
      ...(force
        ? {}
        : {
            lastMessageAt: { lte: cutoff },
            telegramNotifiedAt: null,
          }),
    },
    orderBy: { lastMessageAt: "desc" },
    take: safeLimit,
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: MESSAGE_LIMIT,
      },
    },
  });

  let sent = 0;
  let failed = 0;

  for (const conversation of conversations) {
    const delivered = await sendTelegramAdminMessage(assistantDigestMessage(conversation));
    if (delivered) {
      sent += 1;
      await prisma.assistantConversation.updateMany({
        where: {
          id: conversation.id,
          lastMessageAt: conversation.lastMessageAt,
        },
        data: { telegramNotifiedAt: new Date() },
      });
    } else {
      failed += 1;
    }
  }

  return {
    scanned: conversations.length,
    sent,
    failed,
  };
}
