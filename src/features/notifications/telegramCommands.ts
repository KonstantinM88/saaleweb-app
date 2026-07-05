import "server-only";

import {
  buildAiSearchReport,
  buildDailySiteReport,
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
import { answerTelegramCallbackQuery, sendTelegramChatMessage } from "./telegram";

const BUTTON_HEALTH = "🩺 Проверить сайт";
const BUTTON_DAILY = "📊 Отчёт 24 часа";
const BUTTON_WEEK = "📅 Недельный отчёт";
const BUTTON_AI = "🤖 AI-отчёт";
const BUTTON_TOP = "🏆 Топ-страницы";
const BUTTON_LEADS = "🎯 Заявки";
const BUTTON_ASSISTANT = "💬 AI-диалоги";
const BUTTON_HELP = "❔ Помощь";

function commandKeyboard() {
  return {
    keyboard: [
      [{ text: BUTTON_HEALTH }, { text: BUTTON_DAILY }],
      [{ text: BUTTON_WEEK }, { text: BUTTON_AI }],
      [{ text: BUTTON_TOP }, { text: BUTTON_LEADS }],
      [{ text: BUTTON_ASSISTANT }, { text: BUTTON_HELP }],
    ],
    resize_keyboard: true,
    is_persistent: true,
    one_time_keyboard: false,
    input_field_placeholder: "Выберите действие",
  };
}

function helpText(): string {
  return [
    "🤖 SaaleWeb Bot — меню управления",
    "",
    `${BUTTON_HEALTH} — сайт, БД, почта, Telegram и ключевые URL`,
    `${BUTTON_DAILY} — отчёт за последние 24 часа`,
    `${BUTTON_WEEK} — недельный отчёт по трафику, заявкам и AI-поиску`,
    `${BUTTON_AI} — отдельный отчёт по AI-ботам и AI-переходам`,
    `${BUTTON_TOP} — топ страниц, источники и SEO/GEO/AIO возможности`,
    `${BUTTON_LEADS} — последние заявки, статусы и источники`,
    `${BUTTON_ASSISTANT} — последние переписки с AI-ассистентом`,
    `${BUTTON_HELP} — показать это меню`,
    "",
    "Текстовые команды:",
    "/health, /report, /week, /ai, /top, /leads, /assistant, /help",
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
    [BUTTON_AI]: "/ai",
    [BUTTON_TOP]: "/top",
    [BUTTON_LEADS]: "/leads",
    [BUTTON_ASSISTANT]: "/assistant",
    [BUTTON_HELP]: "/help",
  };

  return buttons[clean] || clean.split(/\s+/)[0]?.split("@")[0]?.toLowerCase() || "";
}

async function sendWithMenu(chatId: string | number, text: string): Promise<boolean> {
  return sendTelegramChatMessage(chatId, text, { replyMarkup: commandKeyboard() });
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

  if (command === "/ai") {
    return sendWithMenu(chatId, await buildAiSearchReport());
  }

  if (command === "/top") {
    return sendWithMenu(chatId, await buildTopPagesReport());
  }

  if (command === "/leads") {
    return sendWithMenu(chatId, await buildLeadsReport());
  }

  if (command === "/assistant") {
    const reply = await buildAssistantConversationReply(args[0]);
    return sendTelegramChatMessage(chatId, reply.text, { replyMarkup: reply.replyMarkup });
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

  if (!data.startsWith("assistant:")) {
    return sendWithMenu(chatId, `Неизвестное действие: ${data}`);
  }

  const reply = await handleAssistantCallback(data);
  return sendTelegramChatMessage(chatId, reply.text, { replyMarkup: reply.replyMarkup });
}
