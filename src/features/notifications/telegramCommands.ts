import "server-only";

import { buildDailySiteReport } from "./telegramReports";
import { buildHealthReport } from "./telegramHealth";
import { sendTelegramChatMessage } from "./telegram";

function helpText(): string {
  return [
    "🤖 SaaleWeb Bot — команды",
    "",
    "/health — проверить сайт, БД, почту, Telegram и ключевые URL",
    "/report — отправить текущий ежедневный отчёт за последние 24 часа",
    "/help — показать список команд",
    "",
    "Следующие команды добавим по порядку: /week, /ai, /top, /leads.",
  ].join("\n");
}

function normalizeCommand(text: string): string {
  return text.trim().split(/\s+/)[0]?.split("@")[0]?.toLowerCase() || "";
}

export async function handleTelegramCommand(chatId: string | number, text: string): Promise<boolean> {
  const command = normalizeCommand(text);

  if (command === "/health") {
    return sendTelegramChatMessage(chatId, await buildHealthReport());
  }

  if (command === "/report") {
    return sendTelegramChatMessage(chatId, await buildDailySiteReport());
  }

  if (command === "/start" || command === "/help") {
    return sendTelegramChatMessage(chatId, helpText());
  }

  return sendTelegramChatMessage(chatId, `Неизвестная команда: ${command || text}\n\n${helpText()}`);
}
