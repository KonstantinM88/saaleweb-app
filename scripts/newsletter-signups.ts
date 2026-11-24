import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { NEWSLETTER_SIGNUP_SETTING, NEWSLETTER_LOCK_ID, NEWSLETTER_LOCK_NAMESPACE, newsletterCaptchaConfigured, newsletterSignupsEnabled } from "../src/features/newsletter/policy";

// Explicit operator command; never run automatically on build/deploy or import.
const command = process.argv[2];
if (!["status", "disable", "enable"].includes(command)) {
  throw new Error("Usage: node --conditions=react-server --import tsx scripts/newsletter-signups.ts status|disable|enable");
}
try {
  if (command === "enable" && !newsletterCaptchaConfigured()) {
    throw new Error("Configure both Turnstile keys before enabling newsletter signup.");
  }
  if (command !== "status") {
    await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT 1 AS locked FROM pg_advisory_xact_lock(${NEWSLETTER_LOCK_NAMESPACE}::int, ${NEWSLETTER_LOCK_ID}::int)`;
      await tx.settings.upsert({
        where: { key: NEWSLETTER_SIGNUP_SETTING },
        create: { key: NEWSLETTER_SIGNUP_SETTING, value: command === "enable" },
        update: { value: command === "enable" },
      });
    });
  }
  console.log(JSON.stringify({ setting: NEWSLETTER_SIGNUP_SETTING, enabled: await newsletterSignupsEnabled(prisma), captchaConfigured: newsletterCaptchaConfigured() }));
} finally {
  await prisma.$disconnect();
}
