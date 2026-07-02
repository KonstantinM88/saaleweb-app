import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/session";
import { sendTransactionalMail } from "@/features/notifications/transport";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MailDiagnostics = {
  provider: "resend" | "smtp";
  hasResendApiKey: boolean;
  hasResendFrom: boolean;
  hasLeadNotifyFrom: boolean;
  hasLeadNotifyTo: boolean;
  hasAdminEmail: boolean;
  hasSmtpHost: boolean;
  hasSmtpUser: boolean;
  hasSmtpPassword: boolean;
  hasRecipient: boolean;
  hasFrom: boolean;
};

function hasEnv(name: string) {
  return Boolean(process.env[name]?.trim());
}

function recipient() {
  return process.env.LEAD_NOTIFY_TO || process.env.ADMIN_EMAIL || process.env.SMTP_USER;
}

function fromAddress() {
  return process.env.RESEND_FROM || process.env.LEAD_NOTIFY_FROM || process.env.SMTP_FROM || process.env.SMTP_USER;
}

function diagnostics(): MailDiagnostics {
  const provider = hasEnv("RESEND_API_KEY") ? "resend" : "smtp";

  return {
    provider,
    hasResendApiKey: hasEnv("RESEND_API_KEY"),
    hasResendFrom: hasEnv("RESEND_FROM"),
    hasLeadNotifyFrom: hasEnv("LEAD_NOTIFY_FROM"),
    hasLeadNotifyTo: hasEnv("LEAD_NOTIFY_TO"),
    hasAdminEmail: hasEnv("ADMIN_EMAIL"),
    hasSmtpHost: hasEnv("SMTP_HOST"),
    hasSmtpUser: hasEnv("SMTP_USER"),
    hasSmtpPassword: hasEnv("SMTP_PASSWORD"),
    hasRecipient: Boolean(recipient()),
    hasFrom: Boolean(fromAddress()),
  };
}

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
      diagnostics: diagnostics(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const currentDiagnostics = diagnostics();
  const to = recipient();

  if (!to) {
    console.error("[mail-test] Missing recipient for transactional mail test.", currentDiagnostics);
    return NextResponse.json(
      {
        ok: false,
        sent: false,
        error: "missing_recipient",
        diagnostics: currentDiagnostics,
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  const timestamp = new Date().toISOString();
  const sent = await sendTransactionalMail({
    from: fromAddress(),
    to,
    subject: `SaaleWeb mail transport test (${currentDiagnostics.provider})`,
    text: [
      "SaaleWeb mail transport test.",
      `Provider: ${currentDiagnostics.provider}`,
      `Timestamp: ${timestamp}`,
      "If you received this email, the production mail transport can send messages.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
        <h1 style="font-size:20px;margin:0 0 12px">SaaleWeb mail transport test</h1>
        <p><strong>Provider:</strong> ${currentDiagnostics.provider}</p>
        <p><strong>Timestamp:</strong> ${timestamp}</p>
        <p>If you received this email, the production mail transport can send messages.</p>
      </div>
    `,
  });

  console.error("[mail-test] Transactional mail test result.", {
    ...currentDiagnostics,
    sent,
  });

  return NextResponse.json(
    {
      ok: sent,
      sent,
      diagnostics: currentDiagnostics,
    },
    { status: sent ? 200 : 502, headers: { "Cache-Control": "no-store" } },
  );
}
