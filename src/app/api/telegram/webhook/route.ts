import { NextResponse } from "next/server";
import { handleTelegramCallback, handleTelegramCommand } from "@/features/notifications/telegramCommands";
import { isTelegramAdminChatId } from "@/features/notifications/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TelegramUpdate = {
  message?: {
    text?: string;
    reply_to_message?: {
      text?: string;
    };
    chat?: {
      id?: string | number;
    };
  };
  callback_query?: {
    id?: string;
    data?: string;
    message?: {
      chat?: {
        id?: string | number;
      };
    };
  };
};

function webhookSecret(): string | undefined {
  return process.env.TELEGRAM_WEBHOOK_SECRET?.trim() || undefined;
}

function isAuthorizedTelegramRequest(req: Request): boolean {
  const secret = webhookSecret();
  if (!secret) return false;
  return req.headers.get("x-telegram-bot-api-secret-token") === secret;
}

export async function POST(req: Request) {
  if (!isAuthorizedTelegramRequest(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const update = (await req.json().catch(() => null)) as TelegramUpdate | null;
  const callbackChatId = update?.callback_query?.message?.chat?.id;
  const callbackId = update?.callback_query?.id;
  const callbackData = update?.callback_query?.data;
  const chatId = callbackChatId ?? update?.message?.chat?.id;
  const text = update?.message?.text;

  if (!chatId || (!text && !callbackData)) {
    return NextResponse.json({ ok: true, handled: false }, { headers: { "Cache-Control": "no-store" } });
  }

  if (!isTelegramAdminChatId(chatId)) {
    console.warn("[telegram-webhook] Ignored command from non-admin chat.", { chatId: String(chatId) });
    return NextResponse.json({ ok: true, handled: false }, { headers: { "Cache-Control": "no-store" } });
  }

  if (callbackId && callbackData) {
    const sent = await handleTelegramCallback(chatId, callbackId, callbackData);
    return NextResponse.json({ ok: sent, handled: true }, { headers: { "Cache-Control": "no-store" } });
  }

  if (!text) {
    return NextResponse.json({ ok: true, handled: false }, { headers: { "Cache-Control": "no-store" } });
  }

  const sent = await handleTelegramCommand(chatId, text, {
    replyToText: update?.message?.reply_to_message?.text,
  });
  return NextResponse.json({ ok: sent, handled: true }, { headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      configured: Boolean(webhookSecret()),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
