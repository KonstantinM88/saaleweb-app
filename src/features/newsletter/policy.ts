import "server-only";

import { createHash } from "node:crypto";
import { z } from "zod";
import type { PrismaClient } from "@/generated/prisma/client";
import type { NewsletterInput } from "./schema";

export const NEWSLETTER_SIGNUP_SETTING = "newsletter.signup.enabled";
export const NEWSLETTER_DELIVERY_SETTING = "newsletter.signup.delivery-reservations.v1";
export const NEWSLETTER_HOUR_LIMIT = 5;
export const NEWSLETTER_DAY_LIMIT = 20;
export const NEWSLETTER_RECIPIENT_WINDOW_MS = 24 * 60 * 60 * 1000;
export const NEWSLETTER_LOCK_NAMESPACE = 62411;
export const NEWSLETTER_LOCK_ID = 1124;

export type NewsletterDatabase = Pick<PrismaClient, "settings" | "$transaction">;

const reservationsSchema = z.object({
  version: z.literal(1),
  attempts: z.array(z.object({
    at: z.number().int().nonnegative(),
    recipient: z.string().regex(/^[a-f0-9]{64}$/),
  })).max(NEWSLETTER_DAY_LIMIT),
});

export function newsletterCaptchaConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() && process.env.TURNSTILE_SECRET_KEY?.trim());
}

// No cache: stale UI or a directly invoked Server Action must not bypass this switch.
export async function newsletterSignupsEnabled(db: Pick<NewsletterDatabase, "settings">) {
  const setting = await db.settings.findUnique({
    where: { key: NEWSLETTER_SIGNUP_SETTING }, select: { value: true },
  });
  return setting?.value === true;
}

/** Reserve an SMTP attempt durably BEFORE sending; never refund ambiguous failures.
 * The transaction-scoped lock serializes reservations across workers/processes,
 * including first use when the Settings row does not exist yet. SMTP stays outside
 * the transaction. Database time avoids app-server clock skew and fixed-window bursts.
 */
export async function reserveNewsletterConfirmation(
  db: NewsletterDatabase,
  { email, locale }: Pick<NewsletterInput, "email" | "locale">,
): Promise<"reserved" | "already" | "unavailable" | "rate_limited"> {
  return db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT 1 AS locked FROM pg_advisory_xact_lock(${NEWSLETTER_LOCK_NAMESPACE}::int, ${NEWSLETTER_LOCK_ID}::int)`;
    if (!await newsletterSignupsEnabled(tx)) return "unavailable";

    const existing = await tx.newsletterSubscriber.findUnique({ where: { email } });
    if (existing?.confirmed) return "already";

    const [clock] = await tx.$queryRaw<{ now: Date }[]>`SELECT clock_timestamp() AS now`;
    const now = clock.now.getTime();
    const saved = await tx.settings.findUnique({ where: { key: NEWSLETTER_DELIVERY_SETTING }, select: { value: true } });
    // A malformed state fails closed instead of silently resetting the quota.
    const state = saved ? reservationsSchema.parse(saved.value) : { version: 1 as const, attempts: [] };
    const attempts = state.attempts.filter((attempt) => attempt.at > now - NEWSLETTER_RECIPIENT_WINDOW_MS);
    const recipient = createHash("sha256").update(email).digest("hex");
    if (
      attempts.some((attempt) => attempt.recipient === recipient) ||
      // Legacy pending rows predate the reservation ledger. Their creation is
      // the only known lower bound for a previous confirmation attempt.
      (existing && existing.createdAt.getTime() > now - NEWSLETTER_RECIPIENT_WINDOW_MS) ||
      attempts.length >= NEWSLETTER_DAY_LIMIT ||
      attempts.filter((attempt) => attempt.at > now - 60 * 60 * 1000).length >= NEWSLETTER_HOUR_LIMIT
    ) return "rate_limited";

    const value = { version: 1, attempts: [...attempts, { at: now, recipient }] };
    await tx.settings.upsert({
      where: { key: NEWSLETTER_DELIVERY_SETTING }, create: { key: NEWSLETTER_DELIVERY_SETTING, value }, update: { value },
    });
    await tx.newsletterSubscriber.upsert({
      where: { email }, create: { email, locale, confirmed: false }, update: { locale },
    });
    return "reserved";
  }, { isolationLevel: "ReadCommitted", maxWait: 5_000, timeout: 10_000 });
}
