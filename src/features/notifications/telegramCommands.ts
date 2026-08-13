import "server-only";

import {
  buildAiSearchReport,
  buildDailySiteReport,
  buildGa4Report,
  buildLeadsReport,
  buildTopPagesReport,
  buildWeeklySiteReport,
} from "./telegramReports";
import {
  blockAssistantTarget,
  buildAssistantConversationReply,
  handleAssistantCallback,
  unblockAssistantTarget,
} from "./telegramAssistant";
import { buildHealthReport } from "./telegramHealth";
import { buildSeoScoreReport } from "@/features/seo-monitor/seoScore";
import {
  buildAiVisibilityReply,
  handleAiVisibilityCallback,
  submitAiVisibilityIndexNow,
} from "./telegramAiVisibility";
import {
  answerTelegramCallbackQuery,
  configureTelegramCommandMenu,
  sendTelegramChatMessage,
  type TelegramBotCommand,
} from "./telegram";

const BUTTON_HEALTH = "🩺 Проверить сайт";
const BUTTON_DAILY = "📊 Отчёт 24 часа";
const BUTTON_WEEK = "📅 Недельный отчёт";
const BUTTON_GA4 = "📈 GA4";
const BUTTON_AI = "🤖 AI-отчёт";
const BUTTON_TOP = "🏆 Топ-страницы";
const BUTTON_LEADS = "🎯 Заявки";
const BUTTON_ASSISTANT = "💬 AI-диалоги";
const BUTTON_SEO = "🧮 SEO Score";
const BUTTON_VISIBILITY = "🔎 AI-видимость";
const BUTTON_HELP = "❔ Помощь";

const TELEGRAM_COMMAND_MENU: TelegramBotCommand[] = [
  { command: "start", description: "Открыть меню управления" },
  { command: "health", description: "Проверить сайт и сервисы" },
  { command: "report", description: "Отчёт за последние 24 часа" },
  { command: "week", description: "Недельный отчёт" },
  { command: "ga4", description: "Google Analytics за 7 дней" },
  { command: "ai", description: "AI-боты и AI-переходы" },
  { command: "visibility", description: "Упоминания в AI-поиске" },
  { command: "indexnow", description: "Отправить приоритетные страницы" },
  { command: "seo", description: "SEO/GEO/AIO Score" },
  { command: "top", description: "Топ страниц и источников" },
  { command: "leads", description: "Последние заявки" },
  { command: "assistant", description: "Диалоги с AI-ассистентом" },
  { command: "help", description: "Справка по командам" },
];

const configuredMenuChats = new Set<string>();
const initializedCompactChats = new Set<string>();

async function ensureCompactMenu(chatId: string | number): Promise<boolean> {
  const key = String(chatId);
  const firstInteraction = !initializedCompactChats.has(key);
  initializedCompactChats.add(key);

  if (configuredMenuChats.has(key)) return firstInteraction;

  const configured = await configureTelegramCommandMenu(chatId, TELEGRAM_COMMAND_MENU);
  if (configured) configuredMenuChats.add(key);
  return firstInteraction;
}

function helpText(): string {
  return [
    "🤖 SaaleWeb Bot — меню управления",
    "Команды доступны через компактную кнопку «Меню» рядом с полем ввода.",
    "",
    `${BUTTON_HEALTH} — сайт, БД, почта, Telegram и ключевые URL`,
    `${BUTTON_DAILY} — отчёт за последние 24 часа`,
    `${BUTTON_WEEK} — недельный отчёт по трафику, заявкам и AI-поиску`,
    `${BUTTON_GA4} — Google Analytics за 7 завершённых дней`,
    `${BUTTON_AI} — отдельный отчёт по AI-ботам и AI-переходам`,
    `${BUTTON_TOP} — топ страниц, источники и SEO/GEO/AIO возможности`,
    `${BUTTON_LEADS} — последние заявки, статусы и источники`,
    `${BUTTON_ASSISTANT} — последние переписки с AI-ассистентом`,
    `${BUTTON_SEO} — ежедневная оценка SEO/GEO/AIO по реальным данным`,
    `${BUTTON_VISIBILITY} — проверка упоминаний SaaleWeb в четырёх AI-поисках`,
    `${BUTTON_HELP} — показать это меню`,
    "",
    "Текстовые команды:",
    "/health, /report, /week, /ga4, /ai, /top, /leads, /seo, /visibility, /indexnow, /assistant, /help",
    "/seo new — пересчитать SEO Score без кэша",
    "/indexnow — отправить изменённые приоритетные страницы в Bing и участвующие поисковые системы",
    "",
    "AI-диалоги:",
    "/assistant <id> — прочитать переписку",
    "/assistant_block <id или IP> — заблокировать IP",
    "/assistant_unblock <IP> — разблокировать IP",
  ].join("\n");
}

function normalizeCommand(text: string): string {
  const clean = text.trim();
  const buttons: Record<string, string> = {
    [BUTTON_HEALTH]: "/health",
    [BUTTON_DAILY]: "/report",
    [BUTTON_WEEK]: "/week",
    [BUTTON_GA4]: "/ga4",
    [BUTTON_AI]: "/ai",
    [BUTTON_TOP]: "/top",
    [BUTTON_LEADS]: "/leads",
    [BUTTON_ASSISTANT]: "/assistant",
    [BUTTON_SEO]: "/seo",
    [BUTTON_VISIBILITY]: "/visibility",
    [BUTTON_HELP]: "/help",
  };

  return buttons[clean] || clean.split(/\s+/)[0]?.split("@")[0]?.toLowerCase() || "";
}

async function sendWithMenu(chatId: string | number, text: string): Promise<boolean> {
  await ensureCompactMenu(chatId);
  return sendTelegramChatMessage(chatId, text, { replyMarkup: { remove_keyboard: true } });
}

async function sendWithInlineMenu(
  chatId: string | number,
  text: string,
  replyMarkup?: Record<string, unknown>,
): Promise<boolean> {
  const newlyConfigured = await ensureCompactMenu(chatId);
  if (newlyConfigured) {
    await sendTelegramChatMessage(chatId, "☰ Команды доступны через кнопку «Меню».", {
      replyMarkup: { remove_keyboard: true },
    });
  }
  return sendTelegramChatMessage(chatId, text, {
    replyMarkup: replyMarkup ?? { remove_keyboard: true },
  });
}

export async function handleTelegramCommand(chatId: string | number, text: string): Promise<boolean> {
  const command = normalizeCommand(text);
  const args = text.trim().split(/\s+/).slice(1);

  if (command === "/health") {
    return sendWithMenu(chatId, await buildHealthReport());
  }

  if (command === "/report") {
    return sendWithMenu(chatId, await buildDailySiteReport());
  }

  if (command === "/week") {
    return sendWithMenu(chatId, await buildWeeklySiteReport());
  }

  if (command === "/ga4") {
    return sendWithMenu(chatId, await buildGa4Report());
  }

  if (command === "/ai") {
    return sendWithMenu(chatId, await buildAiSearchReport());
  }

  if (command === "/top") {
    return sendWithMenu(chatId, await buildTopPagesReport());
  }

  if (command === "/leads") {
    return sendWithMenu(chatId, await buildLeadsReport());
  }

  if (command === "/seo") {
    const fresh = args[0]?.toLowerCase() === "new";
    await sendTelegramChatMessage(
      chatId,
      fresh ? "🧮 Пересчитываю SEO Score (до минуты)…" : "🧮 Готовлю SEO Score…",
    );
    return sendWithMenu(chatId, await buildSeoScoreReport({ forceFresh: fresh }));
  }

  if (command === "/visibility") {
    const reply = await buildAiVisibilityReply(args[0]);
    return sendWithInlineMenu(chatId, reply.text, reply.replyMarkup);
  }

  if (command === "/indexnow") {
    const reply = await submitAiVisibilityIndexNow(args[0]);
    return sendWithInlineMenu(chatId, reply.text, reply.replyMarkup);
  }

  if (command === "/assistant") {
    const reply = await buildAssistantConversationReply(args[0]);
    return sendWithInlineMenu(chatId, reply.text, reply.replyMarkup);
  }

  if (command === "/assistant_block") {
    return sendWithMenu(chatId, await blockAssistantTarget(args[0], args.slice(1).join(" ")));
  }

  if (command === "/assistant_unblock") {
    return sendWithMenu(chatId, await unblockAssistantTarget(args[0]));
  }

  if (command === "/start" || command === "/help" || command === "меню") {
    return sendWithMenu(chatId, helpText());
  }

  return sendWithMenu(chatId, `Неизвестная команда: ${command || text}\n\n${helpText()}`);
}

export async function handleTelegramCallback(
  chatId: string | number,
  callbackQueryId: string,
  data: string,
): Promise<boolean> {
  await answerTelegramCallbackQuery(callbackQueryId);

  if (data.startsWith("aiv:")) {
    const reply = await handleAiVisibilityCallback(data);
    return sendWithInlineMenu(chatId, reply.text, reply.replyMarkup);
  }

  if (data.startsWith("assistant:")) {
    const reply = await handleAssistantCallback(data);
    return sendWithInlineMenu(chatId, reply.text, reply.replyMarkup);
  }

  return sendWithMenu(chatId, `Неизвестное действие: ${data}`);
}
