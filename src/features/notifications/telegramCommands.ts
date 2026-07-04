import "server-only";

import { buildDailySiteReport, buildWeeklySiteReport } from "./telegramReports";
import { buildHealthReport } from "./telegramHealth";
import { sendTelegramChatMessage } from "./telegram";

const BUTTON_HEALTH = "🩺 Проверить сайт";
const BUTTON_DAILY = "📊 Отчёт 24 часа";
const BUTTON_WEEK = "📅 Недельный отчёт";
const BUTTON_HELP = "❔ Помощь";

function commandKeyboard() {
  return {
    keyboard: [
      [{ text: BUTTON_HEALTH }, { text: BUTTON_DAILY }],
      [{ text: BUTTON_WEEK }, { text: BUTTON_HELP }],
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
    `${BUTTON_HELP} — показать это меню`,
    "",
    "Также работают текстовые команды:",
    "/health, /report, /week, /help",
    "",
    "Следующие функции добавим по порядку: отдельный /ai, /top и /leads.",
  ].join("\n");
}

function normalizeCommand(text: string): string {
  const clean = text.trim();
  const buttons: Record<string, string> = {
    [BUTTON_HEALTH]: "/health",
    [BUTTON_DAILY]: "/report",
    [BUTTON_WEEK]: "/week",
    [BUTTON_HELP]: "/help",
  };

  return buttons[clean] || clean.split(/\s+/)[0]?.split("@")[0]?.toLowerCase() || "";
}

async function sendWithMenu(chatId: string | number, text: string): Promise<boolean> {
  return sendTelegramChatMessage(chatId, text, { replyMarkup: commandKeyboard() });
}

export async function handleTelegramCommand(chatId: string | number, text: string): Promise<boolean> {
  const command = normalizeCommand(text);

  if (command === "/health") {
    return sendWithMenu(chatId, await buildHealthReport());
  }

  if (command === "/report") {
    return sendWithMenu(chatId, await buildDailySiteReport());
  }

  if (command === "/week") {
    return sendWithMenu(chatId, await buildWeeklySiteReport());
  }

  if (command === "/start" || command === "/help" || command === "меню") {
    return sendWithMenu(chatId, helpText());
  }

  return sendWithMenu(chatId, `Неизвестная команда: ${command || text}\n\n${helpText()}`);
}
