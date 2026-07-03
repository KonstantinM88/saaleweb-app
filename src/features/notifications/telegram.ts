import "server-only";

export type TelegramDiagnostics = {
  hasBotToken: boolean;
  hasAdminChatId: boolean;
  adminChatCount: number;
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
  };
}

function truncateTelegramText(text: string): string {
  if (text.length <= TELEGRAM_TEXT_LIMIT) return text;
  return `${text.slice(0, TELEGRAM_TEXT_LIMIT - 24)}\n\n…gekürzt`;
}

async function sendTelegramMessage(chatId: string, text: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: truncateTelegramText(text),
        disable_web_page_preview: true,
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

export async function sendTelegramAdminMessage(text: string): Promise<boolean> {
  const token = configuredBotToken();
  const chatIds = telegramAdminChatIds();

  if (!token || chatIds.length === 0) {
    console.warn("[telegram] Admin message skipped because Telegram is not configured.", telegramDiagnostics());
    return false;
  }

  const results = await Promise.all(chatIds.map((chatId) => sendTelegramMessage(chatId, text, token)));
  return results.some(Boolean);
}
