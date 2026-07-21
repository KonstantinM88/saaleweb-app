import "server-only";

export type TelegramDiagnostics = {
  hasBotToken: boolean;
  hasAdminChatId: boolean;
  adminChatCount: number;
  hasWebhookSecret: boolean;
};

type TelegramSendResponse =
  | {
      ok: true;
      result?: unknown;
    }
  | {
      ok: false;
      description?: string;
      error_code?: number;
    };

const TELEGRAM_TEXT_LIMIT = 4096;

export type TelegramSendOptions = {
  replyMarkup?: Record<string, unknown>;
};

export type TelegramBotCommand = {
  command: string;
  description: string;
};

function configuredBotToken(): string | undefined {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || undefined;
}

export function telegramAdminChatIds(): string[] {
  return (
    process.env.TELEGRAM_ADMIN_CHAT_ID?.split(/[,\s]+/)
      .map((chatId) => chatId.trim())
      .filter(Boolean) ?? []
  );
}

export function telegramDiagnostics(): TelegramDiagnostics {
  const chatIds = telegramAdminChatIds();
  return {
    hasBotToken: Boolean(configuredBotToken()),
    hasAdminChatId: chatIds.length > 0,
    adminChatCount: chatIds.length,
    hasWebhookSecret: Boolean(process.env.TELEGRAM_WEBHOOK_SECRET?.trim()),
  };
}

function truncateTelegramText(text: string): string {
  if (text.length <= TELEGRAM_TEXT_LIMIT) return text;
  return `${text.slice(0, TELEGRAM_TEXT_LIMIT - 24)}\n\n…сообщение сокращено`;
}

export function isTelegramAdminChatId(chatId: string | number): boolean {
  return telegramAdminChatIds().includes(String(chatId));
}

async function sendTelegramMessage(
  chatId: string,
  text: string,
  token: string,
  options: TelegramSendOptions = {},
): Promise<boolean> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: truncateTelegramText(text),
        disable_web_page_preview: true,
        ...(options.replyMarkup ? { reply_markup: options.replyMarkup } : {}),
      }),
    });

    const payload = (await response.json().catch(() => null)) as TelegramSendResponse | null;
    if (!response.ok || !payload?.ok) {
      console.error("[telegram] Admin message failed.", {
        status: response.status,
        errorCode: payload && "error_code" in payload ? payload.error_code : undefined,
        description: payload && "description" in payload ? payload.description : "Unknown Telegram API error",
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("[telegram] Admin message request failed.", {
      message: error instanceof Error ? error.message : "Unknown Telegram request error",
    });
    return false;
  }
}

export async function sendTelegramChatMessage(
  chatId: string | number,
  text: string,
  options: TelegramSendOptions = {},
): Promise<boolean> {
  const token = configuredBotToken();
  if (!token) {
    console.warn("[telegram] Chat message skipped because bot token is missing.", telegramDiagnostics());
    return false;
  }

  return sendTelegramMessage(String(chatId), text, token, options);
}

export async function answerTelegramCallbackQuery(callbackQueryId: string, text?: string): Promise<boolean> {
  const token = configuredBotToken();
  if (!token) {
    console.warn("[telegram] Callback answer skipped because bot token is missing.", telegramDiagnostics());
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        ...(text ? { text } : {}),
      }),
    });
    const payload = (await response.json().catch(() => null)) as TelegramSendResponse | null;
    return response.ok && Boolean(payload?.ok);
  } catch (error) {
    console.error("[telegram] Callback answer request failed.", {
      message: error instanceof Error ? error.message : "Unknown Telegram request error",
    });
    return false;
  }
}

export async function configureTelegramCommandMenu(
  chatId: string | number,
  commands: TelegramBotCommand[],
): Promise<boolean> {
  const token = configuredBotToken();
  if (!token) {
    console.warn("[telegram] Command menu setup skipped because bot token is missing.", telegramDiagnostics());
    return false;
  }

  try {
    const scope = { type: "chat", chat_id: String(chatId) };
    const commandsResponse = await fetch(`https://api.telegram.org/bot${token}/setMyCommands`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ commands, scope }),
    });
    const commandsPayload = (await commandsResponse.json().catch(() => null)) as TelegramSendResponse | null;

    const menuResponse = await fetch(`https://api.telegram.org/bot${token}/setChatMenuButton`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: String(chatId),
        menu_button: { type: "commands" },
      }),
    });
    const menuPayload = (await menuResponse.json().catch(() => null)) as TelegramSendResponse | null;
    const configured = commandsResponse.ok && Boolean(commandsPayload?.ok) && menuResponse.ok && Boolean(menuPayload?.ok);

    if (!configured) {
      console.error("[telegram] Compact command menu setup failed.", {
        commandsStatus: commandsResponse.status,
        menuStatus: menuResponse.status,
        commandsErrorCode: commandsPayload && "error_code" in commandsPayload ? commandsPayload.error_code : undefined,
        menuErrorCode: menuPayload && "error_code" in menuPayload ? menuPayload.error_code : undefined,
      });
    }

    return configured;
  } catch (error) {
    console.error("[telegram] Compact command menu request failed.", {
      message: error instanceof Error ? error.message : "Unknown Telegram request error",
    });
    return false;
  }
}

export async function sendTelegramAdminMessage(
  text: string,
  options: TelegramSendOptions = {},
): Promise<boolean> {
  const token = configuredBotToken();
  const chatIds = telegramAdminChatIds();

  if (!token || chatIds.length === 0) {
    console.warn("[telegram] Admin message skipped because Telegram is not configured.", telegramDiagnostics());
    return false;
  }

  const results = await Promise.all(chatIds.map((chatId) => sendTelegramMessage(chatId, text, token, options)));
  return results.some(Boolean);
}
