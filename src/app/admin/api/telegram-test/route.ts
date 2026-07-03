import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/session";
import { sendDailySiteReport } from "@/features/notifications/telegramReports";
import { sendTelegramAdminMessage, telegramDiagnostics } from "@/features/notifications/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getSession();
  return Boolean(session);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    {
      ok: true,
      diagnostics: telegramDiagnostics(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const sent =
    url.searchParams.get("report") === "daily"
      ? await sendDailySiteReport()
      : await sendTelegramAdminMessage(
          [
            "✅ SaaleWeb Telegram Test",
            "",
            `Zeit: ${new Date().toISOString()}`,
            "Wenn diese Nachricht angekommen ist, sind Bot Token und Chat ID korrekt.",
          ].join("\n"),
        );

  return NextResponse.json(
    {
      ok: sent,
      sent,
      diagnostics: telegramDiagnostics(),
    },
    { status: sent ? 200 : 502, headers: { "Cache-Control": "no-store" } },
  );
}
