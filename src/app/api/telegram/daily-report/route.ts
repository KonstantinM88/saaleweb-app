import { NextResponse } from "next/server";
import { sendDailySiteReportDetailed } from "@/features/notifications/telegramReports";
import { telegramDiagnostics } from "@/features/notifications/telegram";
import { isTransientDatabaseConnectionError } from "@/lib/databaseRetry";

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

  try {
    const delivery = await sendDailySiteReportDetailed();
    return NextResponse.json(
      {
        ok: delivery.ok,
        sent: delivery.ok,
        partial: delivery.partial,
        delivery,
        telegram: telegramDiagnostics(),
      },
      { status: delivery.ok ? 200 : 502, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const transientDatabaseError = isTransientDatabaseConnectionError(error);
    console.error("[telegram-report] Daily report failed after safe retries.", {
      transientDatabaseError,
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json(
      {
        ok: false,
        sent: false,
        error: transientDatabaseError
          ? "database_temporarily_unavailable"
          : "daily_report_generation_failed",
        telegram: telegramDiagnostics(),
      },
      {
        status: transientDatabaseError ? 503 : 500,
        headers: {
          "Cache-Control": "no-store",
          ...(transientDatabaseError ? { "Retry-After": "30" } : {}),
        },
      },
    );
  }
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
