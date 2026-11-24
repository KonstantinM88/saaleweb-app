import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { PrismaPg } from "@prisma/adapter-pg";
import nodemailer from "nodemailer";
import { PrismaClient } from "../src/generated/prisma/client";

// This suite deliberately never loads .env. Refuse anything except its dedicated
// disposable loopback database, including a production URL accidentally supplied.
const databaseUrl = process.env.NEWSLETTER_TEST_DATABASE_URL;
if (!databaseUrl) throw new Error("Set NEWSLETTER_TEST_DATABASE_URL to the disposable local test database.");
const parsedUrl = new URL(databaseUrl);
assert(["127.0.0.1", "localhost"].includes(parsedUrl.hostname));
assert.equal(parsedUrl.port, "55439");
assert.equal(parsedUrl.pathname, "/newsletter_abuse_test");
process.env.DATABASE_URL = databaseUrl;
process.env.AUTH_SECRET = "newsletter-local-test-secret-never-used-in-production";
process.env.MAIL_PROVIDER = "smtp";
process.env.SMTP_HOST = "smtp.example.invalid";
process.env.SMTP_PORT = "465";
process.env.SMTP_SECURE = "true";
process.env.SMTP_USER = "sender@example.test";
process.env.SMTP_PASSWORD = "synthetic-test-password";
process.env.SMTP_FROM = "SaaleWeb Test <sender@example.test>";
process.env.NEWSLETTER_FROM = "SaaleWeb Test <sender@example.test>";
process.env.LEAD_NOTIFY_TO = "operator@example.test";
process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "synthetic-test-site-key";
process.env.TURNSTILE_SECRET_KEY = "synthetic-test-secret-key";
process.env.TELEGRAM_BOT_TOKEN = "";
process.env.RESEND_API_KEY = "";

const makeDb = () => new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl, max: 4 }) });
const db = makeDb();
const secondDb = makeDb();
(globalThis as unknown as { prisma: PrismaClient }).prisma = db;
const smtpCalls: { to: string; subject: string; text: string }[] = [];
let failSmtp = false;
const realTransport = nodemailer.createTransport;
nodemailer.createTransport = (() => ({
  sendMail: async (mail: { to: string; subject: string; text: string }) => {
    smtpCalls.push(mail);
    assert(mail.to.endsWith("@example.test"), "Test recipient must stay in the reserved test domain");
    if (failSmtp) throw new Error("Simulated SMTP failure");
    return { messageId: "local-test" };
  },
})) as typeof nodemailer.createTransport;

let captchaMode: "valid" | "invalid" | "mismatch" = "valid";
const realFetch = globalThis.fetch;
globalThis.fetch = async (input) => {
  assert.equal(String(input), "https://challenges.cloudflare.com/turnstile/v0/siteverify", "Unexpected outbound HTTP request");
  return Response.json({ success: captchaMode !== "invalid", hostname: "saaleweb.de", action: captchaMode === "mismatch" ? "contact_page" : "newsletter_signup" });
};
const { processNewsletterSignup } = await import("../src/features/newsletter/subscribe");
const { NEWSLETTER_SIGNUP_SETTING, NEWSLETTER_DELIVERY_SETTING } = await import("../src/features/newsletter/policy");
const { createNewsletterToken, verifyNewsletterToken } = await import("../src/features/newsletter/token");
const { sendNewsletterConfirmation } = await import("../src/features/notifications/newsletterMailer");
const { verifyTurnstileToken } = await import("../src/features/captcha/turnstile");
const { subscribeToNewsletter } = await import("../src/features/newsletter/actions");
const { GET: confirm } = await import("../src/app/api/newsletter/confirm/route");
const { GET: unsubscribe } = await import("../src/app/api/newsletter/unsubscribe/route");
const { GET: availability } = await import("../src/app/api/newsletter/status/route");
const { NextRequest } = await import("next/server");

function form(email = "new@example.test", locale = "de") {
  const data = new FormData();
  data.set("email", email); data.set("locale", locale); data.set("website", "");
  data.set("cf-turnstile-response", "synthetic-single-use-token");
  return data;
}
function signup(email?: string, client = db, locale = "de") {
  return processNewsletterSignup(form(email, locale), {
    db: client, createToken: createNewsletterToken, sendConfirmation: sendNewsletterConfirmation,
    verifyCaptcha: () => verifyTurnstileToken({ token: "test-token", expectedAction: "newsletter_signup" }),
  });
}
async function enabled(value: boolean | string) {
  await db.settings.upsert({ where: { key: NEWSLETTER_SIGNUP_SETTING }, create: { key: NEWSLETTER_SIGNUP_SETTING, value }, update: { value } });
}
async function reset() {
  await db.settings.deleteMany(); await db.newsletterSubscriber.deleteMany();
  smtpCalls.length = 0; failSmtp = false; captchaMode = "valid";
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "synthetic-test-site-key";
  process.env.TURNSTILE_SECRET_KEY = "synthetic-test-secret-key";
}
const checks: string[] = [];
async function check(name: string, task: () => Promise<void>) { await task(); checks.push(name); console.log(`PASS ${name}`); }
function worker(email: string) {
  return new Promise<{ status: string; message?: string; smtp: number }>((resolve, reject) => {
    const child = spawn(process.execPath, ["--conditions=react-server", "--import", "tsx", "scripts/test-newsletter-security.ts", "--worker", email], {
      cwd: process.cwd(), env: process.env, windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
    });
    let output = ""; let errors = "";
    child.stdout.on("data", (data) => { output += data; });
    child.stderr.on("data", (data) => { errors += data; });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve(JSON.parse(output.trim())) : reject(new Error(`Worker failed: ${errors.slice(0, 150)}`)));
  });
}

try {
  if (process.argv[2] === "--worker") {
    const result = await signup(process.argv[3]);
    console.log(JSON.stringify({ ...result, smtp: smtpCalls.length }));
  } else {
    await check("missing/false/string flag blocks direct action and all SMTP", async () => {
      await reset();
      for (const flag of [undefined, false, "true"]) {
        if (flag !== undefined) await enabled(flag);
        assert.deepEqual(await subscribeToNewsletter({ status: "idle" }, form()), { status: "unavailable" });
        assert.deepEqual(await availability().then((r) => r.json()), { enabled: false });
      }
      assert.equal(smtpCalls.length, 0); assert.equal(await db.newsletterSubscriber.count(), 0);
      assert.equal(await db.settings.count({ where: { key: NEWSLETTER_DELIVERY_SETTING } }), 0);
    });
    await check("enabled signup sends exactly one DOI and remains pending", async () => {
      await reset(); await enabled(true);
      assert.equal((await signup(" New@Example.test ")).status, "success");
      assert.equal(smtpCalls.length, 1); assert.equal(smtpCalls[0].to, "new@example.test");
      assert.equal((await db.newsletterSubscriber.findUniqueOrThrow({ where: { email: "new@example.test" } })).confirmed, false);
      const link = smtpCalls[0].text.match(/https:\/\/\S+\/api\/newsletter\/confirm\?token=\S+/)?.[0];
      assert(link); assert.deepEqual(await verifyNewsletterToken(new URL(link).searchParams.get("token")!, "newsletter-confirm"), { email: "new@example.test" });
      assert.deepEqual(await signup("NEW@example.test"), { status: "error", message: "rate_limited" });
      assert.equal(smtpCalls.length, 1);
    });
    await check("existing pending record can retry after cooldown, not repeatedly", async () => {
      await reset(); await enabled(true);
      await db.newsletterSubscriber.create({ data: { email: "pending@example.test", locale: "en", createdAt: new Date(Date.now() - 2 * 86_400_000) } });
      assert.equal((await signup("pending@example.test")).status, "success");
      assert.equal((await signup("pending@example.test")).message, "rate_limited");
      assert.equal(smtpCalls.length, 1);
      await db.newsletterSubscriber.create({ data: { email: "recent@example.test" } });
      assert.equal((await signup("recent@example.test")).message, "rate_limited");
      assert.equal(smtpCalls.length, 1);
    });
    await check("confirmed address sends nothing and consumes no quota", async () => {
      await reset(); await enabled(true);
      await db.newsletterSubscriber.create({ data: { email: "confirmed@example.test", confirmed: true } });
      assert.equal((await signup("confirmed@example.test")).status, "already");
      assert.equal(smtpCalls.length, 0); assert.equal(await db.settings.count({ where: { key: NEWSLETTER_DELIVERY_SETTING } }), 0);
    });
    await check("missing/invalid/wrong-action CAPTCHA and honeypot never send", async () => {
      await reset(); await enabled(true);
      process.env.TURNSTILE_SECRET_KEY = "";
      assert.equal((await signup()).status, "unavailable");
      process.env.TURNSTILE_SECRET_KEY = "synthetic-test-secret-key";
      assert.equal((await verifyTurnstileToken({ token: null, expectedAction: "newsletter_signup" })).reason, "missing_token");
      for (const mode of ["invalid", "mismatch"] as const) {
        captchaMode = mode; assert.equal((await signup()).message, "captcha");
      }
      captchaMode = "valid";
      const trap = form(); trap.set("website", "spam");
      assert.equal((await processNewsletterSignup(trap, { db, createToken: createNewsletterToken, sendConfirmation: sendNewsletterConfirmation, verifyCaptcha: () => { throw Error("Honeypot must short-circuit"); } })).status, "success");
      assert.equal(smtpCalls.length, 0); assert.equal(await db.newsletterSubscriber.count(), 0);
    });
    await check("concurrent same-recipient requests reserve only one SMTP attempt", async () => {
      await reset(); await enabled(true);
      const results = await Promise.all(Array.from({ length: 12 }, (_, i) => signup("race@example.test", i % 2 ? db : secondDb)));
      assert.equal(results.filter((r) => r.status === "success").length, 1);
      assert.equal(results.filter((r) => r.message === "rate_limited").length, 11);
      assert.equal(smtpCalls.length, 1); assert.equal(await db.newsletterSubscriber.count(), 1);
    });
    await check("global hourly cap holds across concurrent database clients", async () => {
      await reset(); await enabled(true);
      const results = await Promise.all(Array.from({ length: 18 }, (_, i) => signup(`volume${i}@example.test`, i % 2 ? db : secondDb)));
      assert.equal(results.filter((r) => r.status === "success").length, 5);
      assert.equal(results.filter((r) => r.message === "rate_limited").length, 13);
      assert.equal(smtpCalls.length, 5); assert.equal(await db.newsletterSubscriber.count(), 5);
    });
    await check("limits survive process restart and concurrent independent workers", async () => {
      assert.equal((await worker("volume0@example.test")).smtp, 0);
      await reset(); await enabled(true);
      for (let i = 0; i < 4; i++) assert.equal((await signup(`seed${i}@example.test`)).status, "success");
      const results = await Promise.all(Array.from({ length: 4 }, (_, i) => worker(`worker${i}@example.test`)));
      assert.equal(results.filter((r) => r.status === "success").length, 1);
      assert.equal(results.reduce((total, result) => total + result.smtp, 0), 1);
      assert.equal(results.filter((r) => r.message === "rate_limited").length, 3);
    });
    await check("rolling daily cap and expired recipient reservations", async () => {
      await reset(); await enabled(true);
      const at = Date.now() - 2 * 3_600_000;
      const attempts = Array.from({ length: 20 }, (_, i) => ({ at, recipient: createHash("sha256").update(`old${i}@example.test`).digest("hex") }));
      await db.settings.create({ data: { key: NEWSLETTER_DELIVERY_SETTING, value: { version: 1, attempts } } });
      assert.equal((await signup()).message, "rate_limited"); assert.equal(smtpCalls.length, 0);
      await db.settings.update({ where: { key: NEWSLETTER_DELIVERY_SETTING }, data: { value: { version: 1, attempts: attempts.map((entry) => ({ ...entry, at: Date.now() - 25 * 3_600_000 })) } } });
      assert.equal((await signup()).status, "success"); assert.equal(smtpCalls.length, 1);
    });
    await check("SMTP failure keeps quota; corrupt storage fails closed", async () => {
      await reset(); await enabled(true); failSmtp = true;
      const realError = console.error; console.error = () => {};
      try {
        assert.equal((await signup()).message, "delivery");
        assert.equal((await signup()).message, "rate_limited"); assert.equal(smtpCalls.length, 1);
        await db.settings.update({ where: { key: NEWSLETTER_DELIVERY_SETTING }, data: { value: { broken: true } } });
        assert.equal((await signup("other@example.test")).message, "server"); assert.equal(smtpCalls.length, 1);
      } finally { console.error = realError; }
    });
    await check("old DOI confirmation and unsubscribe work while signup is off", async () => {
      await reset(); await db.newsletterSubscriber.create({ data: { email: "old@example.test", locale: "ru" } });
      const token = await createNewsletterToken("old@example.test", "newsletter-confirm");
      const response = await confirm(new NextRequest(`https://saaleweb.de/api/newsletter/confirm?token=${token}`));
      assert(response.headers.get("location")?.endsWith("/ru/newsletter?status=confirmed"));
      assert.equal((await db.newsletterSubscriber.findUniqueOrThrow({ where: { email: "old@example.test" } })).confirmed, true);
      const unsubToken = await createNewsletterToken("old@example.test", "newsletter-unsubscribe");
      const unsub = await unsubscribe(new NextRequest(`https://saaleweb.de/api/newsletter/unsubscribe?token=${unsubToken}`));
      assert(unsub.headers.get("location")?.endsWith("/ru/newsletter?status=unsubscribed"));
      assert.equal(await db.newsletterSubscriber.count(), 0); assert.equal(smtpCalls.length, 0);
      const invalid = await confirm(new NextRequest("https://saaleweb.de/api/newsletter/confirm?token=invalid"));
      assert(invalid.headers.get("location")?.endsWith("status=invalid"));
    });
    await check("DE EN RU confirmations retain localized subjects", async () => {
      await reset(); await enabled(true);
      for (const locale of ["de", "en", "ru"]) assert.equal((await signup(`${locale}@example.test`, db, locale)).status, "success");
      assert.deepEqual(smtpCalls.map((mail) => mail.subject), ["Bitte bestätigen Sie Ihre Newsletter-Anmeldung", "Please confirm your newsletter subscription", "Подтвердите подписку на рассылку"]);
    });
    await check("contact notification and reply still send with newsletter off", async () => {
      await reset(); await enabled(false);
      const { sendLeadNotification, sendLeadAutoReply } = await import("../src/features/notifications/mailer");
      const lead = { name: "Local Test", email: "customer@example.test", locale: "de", message: "Local transport verification", source: "contact_page" };
      assert.equal(await sendLeadNotification(lead), true);
      assert.equal(await sendLeadAutoReply(lead), true);
      assert.equal(smtpCalls.length, 2);
      assert.deepEqual(smtpCalls.map((mail) => mail.to), ["operator@example.test", "customer@example.test"]);
    });
    const output = { checkedAt: new Date().toISOString(), passed: checks.length, storage: "isolated PostgreSQL 17 on loopback; independent Node processes", transport: "substituted nodemailer; no real email or Cloudflare requests", checks };
    if (process.env.NEWSLETTER_TEST_OUTPUT) await writeFile(process.env.NEWSLETTER_TEST_OUTPUT, JSON.stringify(output, null, 2));
    console.log(`Passed ${checks.length} newsletter security scenarios.`);
  }
} finally {
  nodemailer.createTransport = realTransport; globalThis.fetch = realFetch;
  await db.$disconnect(); await secondDb.$disconnect();
}
