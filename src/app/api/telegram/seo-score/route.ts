import { NextResponse } from "next/server";
import { buildSeoScoreReport } from "@/features/seo-monitor/seoScore";
import { sendTelegramAdminMessage, telegramDiagnostics } from "@/features/notifications/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

function configuredSecret(): string | undefined {
  return process.env.TELEGRAM_REPORT_SECRET?.trim() || undefined;
}

function requestSecret(req: Request): string | undefined {
  const url = new URL(req.url);
  const querySecret = url.searchParams.get("secret")?.trim();
  if (querySecret) return querySecret;

  const auth = req.headers.get("authorization")?.trim();
  return auth?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
}

async function handle(req: Request) {
  const expectedSecret = configuredSecret();
  if (!expectedSecret) {
    return NextResponse.json(
      { ok: false, sent: false, error: "telegram_report_secret_missing", telegram: telegramDiagnostics() },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (requestSecret(req) !== expectedSecret) {
    return NextResponse.json(
      { ok: false, sent: false, error: "unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const report = await buildSeoScoreReport({ forceFresh: true });
  const sent = await sendTelegramAdminMessage(report);
  return NextResponse.json(
    { ok: sent, sent, telegram: telegramDiagnostics() },
    { status: sent ? 200 : 502, headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
