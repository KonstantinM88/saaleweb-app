import "server-only";

export type LeadNotification = {
  name: string;
  email: string;
  company?: string | null;
  message?: string | null;
  locale?: string | null;
  source?: string | null;
};

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Sends a new-lead email via the Resend HTTP API.
 * If env vars are missing or delivery fails, form submission still succeeds.
 */
export async function sendLeadNotification(lead: LeadNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_NOTIFY_FROM;
  const to = process.env.LEAD_NOTIFY_TO || process.env.ADMIN_EMAIL;
  if (!apiKey || !from || !to) return;

  const rows: [string, string][] = [
    ["Name", lead.name],
    ["E-Mail", lead.email],
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

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        subject: `Neue Anfrage von ${lead.name}`,
        text,
        html,
        reply_to: lead.email,
      }),
    });
  } catch {
    // Do not break contact form submission because of email delivery.
  }
}
