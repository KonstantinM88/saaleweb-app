import "server-only";

import { sendResendMail } from "./resend";
import { sendSmtpMail, type SmtpMail } from "./smtp";

export type TransactionalMail = SmtpMail;
export type MailProvider = "auto" | "resend" | "smtp";
export type ResolvedMailProvider = Exclude<MailProvider, "auto">;

export function normalizeMailProvider(value: unknown): MailProvider | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === "auto" || normalized === "resend" || normalized === "smtp") {
    return normalized;
  }
  return undefined;
}

export function configuredMailProvider(): MailProvider {
  return normalizeMailProvider(process.env.MAIL_PROVIDER) ?? "auto";
}

export function resolveMailProvider(provider: MailProvider = configuredMailProvider()): ResolvedMailProvider {
  if (provider === "resend") return "resend";
  if (provider === "smtp") return "smtp";
  return process.env.RESEND_API_KEY ? "resend" : "smtp";
}

export function defaultFromAddress(provider: MailProvider = configuredMailProvider()): string | undefined {
  const resolved = resolveMailProvider(provider);
  if (resolved === "smtp") {
    return process.env.SMTP_FROM || process.env.SMTP_USER || process.env.LEAD_NOTIFY_FROM;
  }

  return process.env.RESEND_FROM || process.env.LEAD_NOTIFY_FROM || process.env.SMTP_FROM || process.env.SMTP_USER;
}

/**
 * Preferred transport order in MAIL_PROVIDER=auto:
 * 1. Resend, when RESEND_API_KEY is present.
 * 2. Hostinger SMTP fallback, when Resend is not configured.
 *
 * Set MAIL_PROVIDER=smtp to force Hostinger SMTP after DNS/mailbox checks.
 */
export async function sendTransactionalMail(
  mail: TransactionalMail,
  provider: MailProvider = configuredMailProvider(),
): Promise<boolean> {
  const resolvedProvider = resolveMailProvider(provider);

  if (resolvedProvider === "resend") {
    return sendResendMail(mail);
  }

  return sendSmtpMail(mail);
}
