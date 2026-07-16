import "server-only";

import nodemailer from "nodemailer";

export type SmtpMail = {
  from?: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  text: string;
  html?: string;
};

type SmtpErrorDetails = {
  code?: string;
  command?: string;
  responseCode?: number;
  message: string;
};

export type SmtpSendResult = {
  sent: boolean;
  missing?: string[];
  error?: SmtpErrorDetails;
};

function smtpPort(): number {
  const value = Number(process.env.SMTP_PORT || 465);
  return Number.isFinite(value) && value > 0 ? value : 465;
}

export function normalizeSmtpEnvValue(value: string | undefined): string | undefined {
  const cleaned = value?.trim();
  if (!cleaned) return undefined;

  const firstCharacter = cleaned.at(0);
  const lastCharacter = cleaned.at(-1);
  const hasMatchingWrapper =
    cleaned.length >= 2 &&
    (firstCharacter === `"` || firstCharacter === "'") &&
    lastCharacter === firstCharacter;

  if (!hasMatchingWrapper) return cleaned;

  const unwrapped = cleaned.slice(1, -1).trim();
  return unwrapped || undefined;
}

function smtpSecure(port: number): boolean {
  const value = normalizeSmtpEnvValue(process.env.SMTP_SECURE);
  if (value == null || value === "") return port === 465;
  return value === "true" || value === "1";
}

function fallbackFrom(): string | undefined {
  return normalizeSmtpEnvValue(process.env.SMTP_FROM) || normalizeSmtpEnvValue(process.env.SMTP_USER);
}

function redactSensitive(value: string): string {
  let redacted = value;
  const secrets = new Set(
    [
      process.env.SMTP_PASSWORD,
      process.env.SMTP_USER,
      normalizeSmtpEnvValue(process.env.SMTP_PASSWORD),
      normalizeSmtpEnvValue(process.env.SMTP_USER),
    ].filter((secret): secret is string => Boolean(secret)),
  );

  for (const secret of secrets) {
    if (secret) redacted = redacted.replaceAll(secret, "[redacted]");
  }
  return redacted;
}

function smtpErrorDetails(error: unknown): SmtpErrorDetails {
  if (!(error instanceof Error)) return { message: "Unknown SMTP error" };
  const details = error as Error & {
    code?: string;
    command?: string;
    responseCode?: number;
  };

  return {
    code: details.code,
    command: details.command,
    responseCode: details.responseCode,
    message: redactSensitive(details.message).slice(0, 800),
  };
}

/**
 * Sends mail through the configured SMTP mailbox.
 * Missing SMTP env values or delivery errors return a sanitized result and
 * must not break contact/newsletter form submissions.
 */
export async function sendSmtpMailDetailed(mail: SmtpMail): Promise<SmtpSendResult> {
  const host = normalizeSmtpEnvValue(process.env.SMTP_HOST);
  const user = normalizeSmtpEnvValue(process.env.SMTP_USER);
  const pass = normalizeSmtpEnvValue(process.env.SMTP_PASSWORD);
  const port = smtpPort();

  if (!host || !user || !pass) {
    const missing = [
      !host ? "SMTP_HOST" : null,
      !user ? "SMTP_USER" : null,
      !pass ? "SMTP_PASSWORD" : null,
    ].filter(Boolean) as string[];

    console.error("[smtp] Mail delivery skipped because SMTP config is incomplete.", {
      missing,
    });
    return { sent: false, missing };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: smtpSecure(port),
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: mail.from || fallbackFrom(),
      to: mail.to,
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    return { sent: true };
  } catch (error) {
    const details = smtpErrorDetails(error);
    console.error("[smtp] Mail delivery failed.", details);
    return { sent: false, error: details };
  }
}

export async function sendSmtpMail(mail: SmtpMail): Promise<boolean> {
  const result = await sendSmtpMailDetailed(mail);
  return result.sent;
}
