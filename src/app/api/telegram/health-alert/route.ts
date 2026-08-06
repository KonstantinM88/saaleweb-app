import { NextResponse } from "next/server";
import { sendHealthAlertReport } from "@/features/notifications/telegramHealth";
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

function flag(value: string | null): boolean {
  return value === "1" || value === "true" || value === "yes";
}

function cooldownMinutes(req: Request): number | undefined {
  const url = new URL(req.url);
  const raw = url.searchParams.get("cooldownMinutes") || url.searchParams.get("cooldown");
  if (!raw) return undefined;

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
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

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") === "full" ? "full" : "light";
  const threshold = url.searchParams.get("level") === "warn" ? "warn" : "fail";
  const result = await sendHealthAlertReport({
    mode,
    threshold,
    force: flag(url.searchParams.get("force")),
    cooldownMinutes: cooldownMinutes(req),
  });
  const ok = result.sent || !result.alertNeeded || result.skippedReason === "cooldown";

  return NextResponse.json(
    {
      ok,
      ...result,
      threshold,
      telegram: telegramDiagnostics(),
    },
    { status: ok ? 200 : 502, headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
