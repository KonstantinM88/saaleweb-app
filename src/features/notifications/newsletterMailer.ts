import "server-only";

import { emailBrandHeader } from "./emailBrand";
import { sendTransactionalMail } from "./transport";

type Locale = "de" | "en" | "ru";

const texts: Record<
  Locale,
  {
    subject: string;
    greeting: string;
    intro: string;
    button: string;
    ignore: string;
    fallback: string;
  }
> = {
  de: {
    subject: "Bitte bestätigen Sie Ihre Newsletter-Anmeldung",
    greeting: "Guten Tag,",
    intro:
      "vielen Dank für Ihr Interesse am SaaleWeb-Newsletter mit Praxistipps zu Websites, lokalem SEO und KI-Sichtbarkeit für Unternehmen in Halle und Leipzig. Bitte bestätigen Sie Ihre Anmeldung mit einem Klick:",
    button: "Anmeldung bestätigen",
    ignore:
      "Wenn Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail einfach – es wird kein Newsletter versendet.",
    fallback: "Falls der Button nicht funktioniert, öffnen Sie diesen Link:",
  },
  en: {
    subject: "Please confirm your newsletter subscription",
    greeting: "Hello,",
    intro:
      "thank you for your interest in the SaaleWeb newsletter with practical tips on websites, local SEO and AI visibility for businesses in Halle and Leipzig. Please confirm your subscription with one click:",
    button: "Confirm subscription",
    ignore:
      "If you did not sign up, simply ignore this email – no newsletter will be sent.",
    fallback: "If the button does not work, open this link:",
  },
  ru: {
    subject: "Подтвердите подписку на рассылку",
    greeting: "Здравствуйте!",
    intro:
      "Спасибо за интерес к рассылке SaaleWeb с практическими советами о сайтах, локальном SEO и видимости в ИИ для бизнеса в Halle и Leipzig. Пожалуйста, подтвердите подписку одним кликом:",
    button: "Подтвердить подписку",
    ignore:
      "Если вы не подписывались, просто проигнорируйте это письмо — рассылка отправляться не будет.",
    fallback: "Если кнопка не работает, откройте эту ссылку:",
  },
};

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Sends the double-opt-in confirmation email via the configured mail transport.
 * Returns false when env vars are missing or delivery fails so the caller
 * can inform the user instead of silently losing the confirmation step.
 */
export async function sendNewsletterConfirmation(opts: {
  email: string;
  locale: Locale;
  confirmUrl: string;
}): Promise<boolean> {
  const from = process.env.NEWSLETTER_FROM || process.env.RESEND_FROM || process.env.LEAD_NOTIFY_FROM || process.env.SMTP_USER;
  if (!from) return false;

  const t = texts[opts.locale] ?? texts.de;
  const text = `${t.greeting}\n\n${t.intro}\n\n${opts.confirmUrl}\n\n${t.ignore}\n\nSaaleWeb · saaleweb.de`;
  const html =
    `<div style="font:15px/1.6 sans-serif;color:#111827;max-width:520px">` +
    emailBrandHeader() +
    `<p style="margin:0 0 12px">${esc(t.greeting)}</p>` +
    `<p style="margin:0 0 20px">${esc(t.intro)}</p>` +
    `<p style="margin:0 0 24px"><a href="${esc(opts.confirmUrl)}" ` +
    `style="display:inline-block;background:linear-gradient(90deg,#FF4FA3,#8B5CF6);color:#ffffff;` +
    `padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:600">${esc(t.button)}</a></p>` +
    `<p style="margin:0 0 8px;color:#6b7280;font-size:13px">${esc(t.fallback)}</p>` +
    `<p style="margin:0 0 20px;font-size:13px;word-break:break-all"><a href="${esc(opts.confirmUrl)}">${esc(opts.confirmUrl)}</a></p>` +
    `<p style="margin:0;color:#6b7280;font-size:13px">${esc(t.ignore)}</p>` +
    `<p style="margin:16px 0 0;color:#9ca3af;font-size:12px">SaaleWeb · saaleweb.de</p>` +
    `</div>`;

  return sendTransactionalMail({ from, to: opts.email, subject: t.subject, text, html });
}
