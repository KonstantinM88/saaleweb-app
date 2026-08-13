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

type TelegramDeliveryFailureReason =
  | "bot_blocked"
  | "chat_not_found"
  | "forbidden"
  | "rate_limited"
  | "telegram_api_error"
  | "request_failed"
  | "bot_token_missing";

type TelegramMessageDelivery = {
  sent: boolean;
  status?: number;
  errorCode?: number;
  failureReason?: TelegramDeliveryFailureReason;
};

export type TelegramAdminDeliverySummary = {
  ok: boolean;
  partial: boolean;
  attempted: number;
  sent: number;
  failed: number;
  recipients: Array<{
    recipient: string;
    sent: boolean;
    status?: number;
    errorCode?: number;
    failureReason?: TelegramDeliveryFailureReason;
  }>;
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

function splitTelegramText(text: string): string[] {
  if (text.length <= TELEGRAM_TEXT_LIMIT) return [text];

  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > TELEGRAM_TEXT_LIMIT) {
    const candidate = remaining.slice(0, TELEGRAM_TEXT_LIMIT);
    const lastLineBreak = candidate.lastIndexOf("\n");
    const boundary = lastLineBreak >= Math.floor(TELEGRAM_TEXT_LIMIT * 0.6)
      ? lastLineBreak
      : TELEGRAM_TEXT_LIMIT;
    chunks.push(remaining.slice(0, boundary).trimEnd());
    remaining = remaining.slice(boundary).trimStart();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

function maskedChatId(chatId: string): string {
  const suffix = chatId.replace(/\s+/g, "").slice(-4);
  return suffix ? `***${suffix}` : "***";
}

function telegramFailureReason(
  status: number,
  errorCode: number | undefined,
  description: string | undefined,
): TelegramDeliveryFailureReason {
  if (status === 403 && /blocked by the user/i.test(description ?? "")) return "bot_blocked";
  if (status === 400 && /chat not found/i.test(description ?? "")) return "chat_not_found";
  if (status === 403 || errorCode === 403) return "forbidden";
  if (status === 429 || errorCode === 429) return "rate_limited";
  return "telegram_api_error";
}

export function isTelegramAdminChatId(chatId: string | number): boolean {
  return telegramAdminChatIds().includes(String(chatId));
}

async function deliverTelegramMessage(
  chatId: string,
  text: string,
  token: string,
  options: TelegramSendOptions = {},
): Promise<TelegramMessageDelivery> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
        ...(options.replyMarkup ? { reply_markup: options.replyMarkup } : {}),
      }),
    });

    const payload = (await response.json().catch(() => null)) as TelegramSendResponse | null;
    if (!response.ok || !payload?.ok) {
      const errorCode = payload && "error_code" in payload ? payload.error_code : undefined;
      const description = payload && "description" in payload ? payload.description : undefined;
      const failureReason = telegramFailureReason(response.status, errorCode, description);
      console.error("[telegram] Admin message failed.", {
        recipient: maskedChatId(chatId),
        status: response.status,
        errorCode,
        failureReason,
      });
      return {
        sent: false,
        status: response.status,
        errorCode,
        failureReason,
      };
    }

    return { sent: true, status: response.status };
  } catch (error) {
    console.error("[telegram] Admin message request failed.", {
      recipient: maskedChatId(chatId),
      message: error instanceof Error ? error.message : "Unknown Telegram request error",
    });
    return { sent: false, failureReason: "request_failed" };
  }
}

async function sendTelegramMessage(
  chatId: string,
  text: string,
  token: string,
  options: TelegramSendOptions = {},
): Promise<boolean> {
  return (await deliverTelegramText(chatId, text, token, options)).sent;
}

async function deliverTelegramText(
  chatId: string,
  text: string,
  token: string,
  options: TelegramSendOptions = {},
): Promise<TelegramMessageDelivery> {
  const chunks = splitTelegramText(text);
  let lastDelivery: TelegramMessageDelivery = { sent: true };
  for (let index = 0; index < chunks.length; index += 1) {
    const isLastChunk = index === chunks.length - 1;
    lastDelivery = await deliverTelegramMessage(chatId, chunks[index] ?? "", token, {
      ...(isLastChunk ? options : {}),
    });
    if (!lastDelivery.sent) return lastDelivery;
  }
  return lastDelivery;
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
  return (await sendTelegramAdminMessageDetailed(text, options)).ok;
}

export async function sendTelegramAdminMessageDetailed(
  text: string,
  options: TelegramSendOptions = {},
): Promise<TelegramAdminDeliverySummary> {
  const token = configuredBotToken();
  const chatIds = telegramAdminChatIds();

  if (!token || chatIds.length === 0) {
    console.warn("[telegram] Admin message skipped because Telegram is not configured.", telegramDiagnostics());
    const recipients = chatIds.map((chatId) => ({
      recipient: maskedChatId(chatId),
      sent: false,
      failureReason: "bot_token_missing" as const,
    }));
    return {
      ok: false,
      partial: false,
      attempted: chatIds.length,
      sent: 0,
      failed: chatIds.length,
      recipients,
    };
  }

  const deliveries = await Promise.all(
    chatIds.map(async (chatId) => ({
      recipient: maskedChatId(chatId),
      ...(await deliverTelegramText(chatId, text, token, options)),
    })),
  );
  const sent = deliveries.filter((delivery) => delivery.sent).length;
  const failed = deliveries.length - sent;

  if (failed > 0) {
    console.warn("[telegram] Admin message delivery was incomplete.", {
      attempted: deliveries.length,
      sent,
      failed,
      recipients: deliveries.map(({ recipient, sent: recipientSent, failureReason }) => ({
        recipient,
        sent: recipientSent,
        failureReason,
      })),
    });
  }

  return {
    ok: sent > 0,
    partial: sent > 0 && failed > 0,
    attempted: deliveries.length,
    sent,
    failed,
    recipients: deliveries,
  };
}
