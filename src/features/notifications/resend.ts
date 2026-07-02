import "server-only";

import type { SmtpMail } from "./smtp";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function fallbackFrom(): string | undefined {
  return process.env.RESEND_FROM || process.env.LEAD_NOTIFY_FROM || process.env.SMTP_FROM || process.env.SMTP_USER;
}

function resendErrorDetails(status: number, body: unknown) {
  if (!body || typeof body !== "object") return { status };
  const value = body as { name?: unknown; message?: unknown };

  return {
    status,
    name: typeof value.name === "string" ? value.name : undefined,
    message: typeof value.message === "string" ? value.message : undefined,
  };
}

function requestErrorDetails(error: unknown) {
  if (!(error instanceof Error)) return { message: "Unknown Resend API error" };
  const details = error as Error & { code?: string };

  return {
    code: details.code,
    message: details.message,
  };
}

/**
 * Sends mail through Resend's HTTP Email API.
 * Missing env values or delivery errors return false and must not break forms.
 */
export async function sendResendMail(mail: SmtpMail): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = mail.from || fallbackFrom();

  if (!apiKey || !from) {
    console.warn("[resend] Mail delivery skipped because Resend config is incomplete.", {
      missing: [
        !apiKey ? "RESEND_API_KEY" : null,
        !from ? "RESEND_FROM or message.from" : null,
      ].filter(Boolean),
    });
    return false;
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(mail.to) ? mail.to : [mail.to],
        reply_to: mail.replyTo ? [mail.replyTo] : undefined,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as unknown;
      console.warn("[resend] Mail delivery failed.", resendErrorDetails(response.status, body));
      return false;
    }

    return true;
  } catch (error) {
    console.warn("[resend] Mail delivery failed.", requestErrorDetails(error));
    return false;
  }
}
