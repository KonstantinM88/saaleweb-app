import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/session";
import {
  configuredMailProvider,
  defaultFromAddress,
  normalizeMailProvider,
  resolveMailProvider,
  sendTransactionalMail,
  type MailProvider,
} from "@/features/notifications/transport";
import { sendSmtpMailDetailed, type SmtpSendResult } from "@/features/notifications/smtp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MailDiagnostics = {
  configuredProvider: MailProvider;
  requestedProvider?: MailProvider;
  provider: "resend" | "smtp";
  hasResendApiKey: boolean;
  hasResendFrom: boolean;
  hasLeadNotifyFrom: boolean;
  hasSmtpFrom: boolean;
  hasLeadNotifyTo: boolean;
  hasAdminEmail: boolean;
  hasSmtpHost: boolean;
  hasSmtpUser: boolean;
  hasSmtpPassword: boolean;
  smtpUserLength: number;
  smtpPasswordLength: number;
  smtpUserHasEdgeWhitespace: boolean;
  smtpPasswordHasEdgeWhitespace: boolean;
  smtpPort: string;
  smtpSecure: string;
  hasRecipient: boolean;
  hasFrom: boolean;
};

function hasEnv(name: string) {
  return Boolean(process.env[name]?.trim());
}

function recipient() {
  return process.env.LEAD_NOTIFY_TO || process.env.ADMIN_EMAIL || process.env.SMTP_USER;
}

function providerFromUrl(req: Request): MailProvider | undefined {
  const url = new URL(req.url);
  return normalizeMailProvider(url.searchParams.get("provider"));
}

async function providerFromRequest(req: Request): Promise<MailProvider | undefined> {
  const urlProvider = providerFromUrl(req);
  if (urlProvider) return urlProvider;

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return undefined;

  const body = (await req.json().catch(() => null)) as { provider?: unknown } | null;
  return normalizeMailProvider(body?.provider);
}

function diagnostics(requestedProvider?: MailProvider): MailDiagnostics {
  const configuredProvider = configuredMailProvider();
  const providerInput = requestedProvider ?? configuredProvider;
  const provider = resolveMailProvider(providerInput);

  return {
    configuredProvider,
    requestedProvider,
    provider,
    hasResendApiKey: hasEnv("RESEND_API_KEY"),
    hasResendFrom: hasEnv("RESEND_FROM"),
    hasLeadNotifyFrom: hasEnv("LEAD_NOTIFY_FROM"),
    hasSmtpFrom: hasEnv("SMTP_FROM"),
    hasLeadNotifyTo: hasEnv("LEAD_NOTIFY_TO"),
    hasAdminEmail: hasEnv("ADMIN_EMAIL"),
    hasSmtpHost: hasEnv("SMTP_HOST"),
    hasSmtpUser: hasEnv("SMTP_USER"),
    hasSmtpPassword: hasEnv("SMTP_PASSWORD"),
    smtpUserLength: process.env.SMTP_USER?.trim().length ?? 0,
    smtpPasswordLength: process.env.SMTP_PASSWORD?.trim().length ?? 0,
    smtpUserHasEdgeWhitespace: process.env.SMTP_USER !== process.env.SMTP_USER?.trim(),
    smtpPasswordHasEdgeWhitespace: process.env.SMTP_PASSWORD !== process.env.SMTP_PASSWORD?.trim(),
    smtpPort: process.env.SMTP_PORT || "465",
    smtpSecure: process.env.SMTP_SECURE || "",
    hasRecipient: Boolean(recipient()),
    hasFrom: Boolean(defaultFromAddress(providerInput)),
  };
}

async function requireAdmin() {
  const session = await getSession();
  return Boolean(session);
}

export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    {
      ok: true,
      diagnostics: diagnostics(providerFromUrl(req)),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const requestedProvider = await providerFromRequest(req);
  const providerInput = requestedProvider ?? configuredMailProvider();
  const currentDiagnostics = diagnostics(requestedProvider);
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
  const mail = {
    from: defaultFromAddress(providerInput),
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
  };
  let smtpResult: SmtpSendResult | undefined;
  let sent: boolean;

  if (currentDiagnostics.provider === "smtp") {
    smtpResult = await sendSmtpMailDetailed(mail);
    sent = smtpResult.sent;
  } else {
    sent = await sendTransactionalMail(mail, providerInput);
  }

  console.error("[mail-test] Transactional mail test result.", {
    ...currentDiagnostics,
    sent,
    smtpError: smtpResult?.error,
    smtpMissing: smtpResult?.missing,
  });

  return NextResponse.json(
    {
      ok: sent,
      sent,
      diagnostics: currentDiagnostics,
      smtp: smtpResult,
    },
    { status: sent ? 200 : 502, headers: { "Cache-Control": "no-store" } },
  );
}
