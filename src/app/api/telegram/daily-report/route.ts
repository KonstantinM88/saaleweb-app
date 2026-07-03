import { NextResponse } from "next/server";
import { sendDailySiteReport } from "@/features/notifications/telegramReports";
import { telegramDiagnostics } from "@/features/notifications/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function configuredSecret(): string | undefined {
  return process.env.TELEGRAM_REPORT_SECRET?.trim() || undefined;
}

function requestSecret(req: Request): string | undefined {
  const url = new URL(req.url);
  const querySecret = url.searchParams.get("secret")?.trim();
  if (querySecret) return querySecret;

  const auth = req.headers.get("authorization")?.trim();
  const match = auth?.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim();
}

async function handle(req: Request) {
  const expectedSecret = configuredSecret();
  if (!expectedSecret) {
    return NextResponse.json(
      {
        ok: false,
        sent: false,
        error: "telegram_report_secret_missing",
        telegram: telegramDiagnostics(),
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (requestSecret(req) !== expectedSecret) {
    return NextResponse.json(
      { ok: false, sent: false, error: "unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const sent = await sendDailySiteReport();
  return NextResponse.json(
    {
      ok: sent,
      sent,
      telegram: telegramDiagnostics(),
    },
    { status: sent ? 200 : 502, headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
