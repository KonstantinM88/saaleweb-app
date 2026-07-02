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

function smtpPort(): number {
  const value = Number(process.env.SMTP_PORT || 465);
  return Number.isFinite(value) && value > 0 ? value : 465;
}

function smtpSecure(port: number): boolean {
  const value = process.env.SMTP_SECURE;
  if (value == null || value === "") return port === 465;
  return value === "true" || value === "1";
}

function fallbackFrom(): string | undefined {
  return process.env.SMTP_FROM || process.env.SMTP_USER;
}

function smtpErrorDetails(error: unknown) {
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
    message: details.message,
  };
}

/**
 * Sends mail through the configured SMTP mailbox.
 * Missing SMTP env values or delivery errors return false and must not break
 * contact/newsletter form submissions.
 */
export async function sendSmtpMail(mail: SmtpMail): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const port = smtpPort();

  if (!host || !user || !pass) {
    console.warn("[smtp] Mail delivery skipped because SMTP config is incomplete.", {
      missing: [
        !host ? "SMTP_HOST" : null,
        !user ? "SMTP_USER" : null,
        !pass ? "SMTP_PASSWORD" : null,
      ].filter(Boolean),
    });
    return false;
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
    return true;
  } catch (error) {
    console.warn("[smtp] Mail delivery failed.", smtpErrorDetails(error));
    return false;
  }
}
