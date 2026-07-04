import { NextResponse } from "next/server";
import { handleTelegramCommand } from "@/features/notifications/telegramCommands";
import { isTelegramAdminChatId } from "@/features/notifications/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TelegramUpdate = {
  message?: {
    text?: string;
    chat?: {
      id?: string | number;
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
  const chatId = update?.message?.chat?.id;
  const text = update?.message?.text;

  if (!chatId || !text) {
    return NextResponse.json({ ok: true, handled: false }, { headers: { "Cache-Control": "no-store" } });
  }

  if (!isTelegramAdminChatId(chatId)) {
    console.warn("[telegram-webhook] Ignored command from non-admin chat.", { chatId: String(chatId) });
    return NextResponse.json({ ok: true, handled: false }, { headers: { "Cache-Control": "no-store" } });
  }

  const sent = await handleTelegramCommand(chatId, text);
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
