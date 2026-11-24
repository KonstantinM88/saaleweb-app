import "server-only";

import type { TurnstileVerificationResult } from "@/features/captcha/turnstile";
import type { sendNewsletterConfirmation } from "@/features/notifications/newsletterMailer";
import { siteConfig } from "@/shared/config/site";
import { newsletterSchema } from "./schema";
import { newsletterSignupsEnabled, reserveNewsletterConfirmation, type NewsletterDatabase } from "./policy";
import type { createNewsletterToken } from "./token";

export type NewsletterState = {
  status: "idle" | "success" | "already" | "unavailable" | "error";
  message?: "validation" | "captcha" | "rate_limited" | "delivery" | "server";
};

type Dependencies = {
  db: NewsletterDatabase;
  verifyCaptcha: () => Promise<TurnstileVerificationResult>;
  createToken: typeof createNewsletterToken;
  sendConfirmation: typeof sendNewsletterConfirmation;
};

// Dependencies make the real signup flow testable with isolated PostgreSQL and
// a substituted SMTP transport; no public test mode or mail bypass is exposed.
export async function processNewsletterSignup(formData: FormData, deps: Dependencies): Promise<NewsletterState> {
  try {
    if (!await newsletterSignupsEnabled(deps.db)) return { status: "unavailable" };

    const parsed = newsletterSchema.safeParse({
      email: String(formData.get("email") ?? "").trim().toLowerCase(),
      locale: formData.get("locale") ?? "de",
      website: formData.get("website") ?? "",
    });
    if (!parsed.success) return { status: "error", message: "validation" };
    if (parsed.data.website) return { status: "success" };

    const captcha = await deps.verifyCaptcha();
    // Unlike contact's legacy local-development mode, newsletter sending
    // requires configured AND successful server-side verification.
    if (!captcha.configured) return { status: "unavailable" };
    if (!captcha.success) return { status: "error", message: "captcha" };

    const { email, locale } = parsed.data;
    const reservation = await reserveNewsletterConfirmation(deps.db, { email, locale });
    if (reservation === "unavailable" || reservation === "already") return { status: reservation };
    if (reservation === "rate_limited") return { status: "error", message: "rate_limited" };

    // A switch changed while the CAPTCHA/reservation ran must stop this send too.
    if (!await newsletterSignupsEnabled(deps.db)) return { status: "unavailable" };
    const token = await deps.createToken(email, "newsletter-confirm");
    const confirmUrl = `${siteConfig.url}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;
    const sent = await deps.sendConfirmation({ email, locale, confirmUrl });
    return sent ? { status: "success" } : { status: "error", message: "delivery" };
  } catch {
    // Do not log email addresses, tokens, connection strings or SMTP secrets.
    console.error("[newsletter] Signup failed; no automatic delivery retry.");
    return { status: "error", message: "server" };
  }
}
