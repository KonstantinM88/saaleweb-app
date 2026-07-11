import "server-only";

import { emailBrandHeader } from "./emailBrand";
import { defaultFromAddress, sendTransactionalMail } from "./transport";

export type LeadNotification = {
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  projectWebsite?: string | null;
  projectType?: string | null;
  budget?: string | null;
  message?: string | null;
  locale?: string | null;
  source?: string | null;
};

type LeadLocale = "de" | "en" | "ru";

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function leadLocale(locale?: string | null): LeadLocale {
  return locale === "en" || locale === "ru" ? locale : "de";
}

const autoReplyCopy: Record<
  LeadLocale,
  {
    subject: string;
    greeting: (name: string) => string;
    received: string;
    audit: string;
    next: string;
    replyHint: string;
    signature: string;
  }
> = {
  de: {
    subject: "Wir haben Ihre Anfrage erhalten | SaaleWeb",
    greeting: (name) => `Guten Tag ${name},`,
    received:
      "vielen Dank für Ihre Anfrage. Wir haben Ihre Nachricht erhalten und melden uns in der Regel innerhalb von 24 Stunden persönlich bei Ihnen.",
    audit:
      "Ihre Website-Audit-Anfrage ist angekommen. Wir prüfen die angegebene Website und melden uns mit konkreten Hinweisen zu Sichtbarkeit, Technik und nächsten sinnvollen Schritten.",
    next:
      "Als Nächstes schauen wir uns Ihr Anliegen an und geben Ihnen eine klare Einschätzung, wie SaaleWeb Sie unterstützen kann.",
    replyHint:
      "Diese E-Mail ist eine automatische Bestätigung. Wenn Sie noch etwas ergänzen möchten, können Sie einfach auf diese Nachricht antworten.",
    signature: "Viele Grüße\nKostiantyn Mykhailov\nSaaleWeb",
  },
  en: {
    subject: "We received your request | SaaleWeb",
    greeting: (name) => `Hello ${name},`,
    received:
      "thank you for your request. We have received your message and usually reply personally within 24 hours.",
    audit:
      "Your website audit request has arrived. We will review the website you provided and get back to you with practical notes on visibility, technology and useful next steps.",
    next:
      "Next, we will look at your situation and give you a clear assessment of how SaaleWeb can support you.",
    replyHint:
      "This email is an automatic confirmation. If you would like to add anything, simply reply to this message.",
    signature: "Best regards\nKostiantyn Mykhailov\nSaaleWeb",
  },
  ru: {
    subject: "Мы получили вашу заявку | SaaleWeb",
    greeting: (name) => `Здравствуйте, ${name}!`,
    received:
      "спасибо за вашу заявку. Мы получили сообщение и обычно отвечаем лично в течение 24 часов.",
    audit:
      "Ваша заявка на аудит сайта получена. Мы проверим указанную страницу и вернёмся с конкретными рекомендациями по видимости, технической базе и следующим шагам.",
    next:
      "Дальше мы внимательно посмотрим на вашу ситуацию и дадим понятную оценку, как SaaleWeb может помочь.",
    replyHint:
      "Это автоматическое подтверждение. Если хотите что-то добавить, просто ответьте на это письмо.",
    signature: "С уважением\nKostiantyn Mykhailov\nSaaleWeb",
  },
};

/**
 * Sends a new-lead email via the configured SMTP mailbox.
 * If env vars are missing or delivery fails, form submission still succeeds.
 */
export async function sendLeadNotification(lead: LeadNotification): Promise<boolean> {
  const from = defaultFromAddress();
  const to = process.env.LEAD_NOTIFY_TO || process.env.ADMIN_EMAIL;
  if (!to) {
    console.warn("[mail] Lead admin notification skipped because no recipient is configured.", {
      missing: "LEAD_NOTIFY_TO or ADMIN_EMAIL",
    });
    return false;
  }

  const rows: [string, string][] = [
    ["Name", lead.name],
    ["E-Mail", lead.email || "-"],
    ["Telefon", lead.phone || "-"],
    ["Firma", lead.company || "-"],
    ["Sprache", lead.locale || "-"],
    ["Quelle", lead.source || "-"],
  ];
  const message = lead.message || "-";
  const text = rows.map(([key, value]) => `${key}: ${value}`).join("\n") + `\n\nNachricht:\n${message}`;
  const html =
    `<h2 style="margin:0 0 12px">Neue Anfrage</h2>` +
    `<table style="border-collapse:collapse;font:14px sans-serif">` +
    rows
      .map(
        ([key, value]) =>
          `<tr><td style="padding:4px 12px 4px 0;color:#6b7280">${esc(key)}</td><td style="padding:4px 0">${esc(value)}</td></tr>`,
      )
      .join("") +
    `</table>` +
    `<p style="font:14px sans-serif;margin-top:16px"><strong>Nachricht:</strong><br>${esc(message).replace(/\n/g, "<br>")}</p>`;

  return sendTransactionalMail({
    from,
    to,
    subject: `Neue Anfrage von ${lead.name}`,
    text,
    html,
    replyTo: lead.email || undefined,
  });
}

/**
 * Sends a localized automatic confirmation to the client after a contact form
 * submission. Delivery failure must never block the stored lead.
 */
export async function sendLeadAutoReply(lead: LeadNotification): Promise<boolean> {
  const from = defaultFromAddress();
  const replyTo = process.env.LEAD_NOTIFY_TO || process.env.SMTP_USER;
  if (!lead.email) {
    console.warn("[mail] Lead auto-reply skipped because lead email is missing.");
    return false;
  }

  const locale = leadLocale(lead.locale);
  const copy = autoReplyCopy[locale];
  const greeting = copy.greeting(lead.name);
  const body = lead.source === "website_audit" ? copy.audit : copy.received;
  const text = [greeting, "", body, copy.next, "", copy.replyHint, "", copy.signature].join("\n");
  const html =
    `<div style="font:15px/1.6 system-ui,-apple-system,Segoe UI,sans-serif;color:#111827;max-width:560px">` +
    emailBrandHeader() +
    `<p style="margin:0 0 14px">${esc(greeting)}</p>` +
    `<p style="margin:0 0 14px">${esc(body)}</p>` +
    `<p style="margin:0 0 18px">${esc(copy.next)}</p>` +
    `<div style="margin:22px 0;padding:16px 18px;border-radius:16px;background:#f8fafc;border:1px solid #e5e7eb">` +
    `<p style="margin:0;color:#4b5563">${esc(copy.replyHint)}</p>` +
    `</div>` +
    `<p style="margin:0;white-space:pre-line">${esc(copy.signature)}</p>` +
    `</div>`;

  return sendTransactionalMail({
    from,
    to: lead.email,
    replyTo,
    subject: copy.subject,
    text,
    html,
  });
}
