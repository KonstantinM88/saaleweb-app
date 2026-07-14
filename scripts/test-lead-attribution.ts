import assert from "node:assert/strict";
import {
  ATTRIBUTION_TTL_MS,
  buildAttributionCandidate,
  sanitizeInternalPath,
  sanitizeReferrer,
  updateStoredAttribution,
} from "../src/features/analytics/attribution";

const now = new Date("2026-07-14T08:00:00.000Z");

const telegram = buildAttributionCandidate({
  href: "https://saaleweb.de/kostenlose-website-analyse?utm_source=Telegram&utm_medium=social&utm_campaign=audit_test",
  includeClickIds: true,
  now,
});
assert.equal(telegram.touch.source, "telegram");
assert.equal(telegram.touch.medium, "social");
assert.equal(telegram.touch.channel, "Social");
assert.equal(telegram.touch.campaign, "audit_test");
assert.equal(telegram.touch.landingPage, "/kostenlose-website-analyse");

const firstStore = updateStoredAttribution(undefined, telegram, now);
const linkedin = buildAttributionCandidate({
  href: "https://saaleweb.de/kontakt?utm_source=linkedin&utm_medium=social&utm_campaign=b2b_test",
  includeClickIds: true,
  now: new Date(now.getTime() + 60_000),
});
const updatedStore = updateStoredAttribution(firstStore, linkedin, new Date(now.getTime() + 60_000));
assert.equal(updatedStore.first.source, "telegram");
assert.equal(updatedStore.first.campaign, "audit_test");
assert.equal(updatedStore.last.source, "linkedin");
assert.equal(updatedStore.last.campaign, "b2b_test");

const internalNavigation = buildAttributionCandidate({
  href: "https://saaleweb.de/preise",
  referrer: "https://saaleweb.de/kontakt?private=value",
  ownHostname: "saaleweb.de",
  includeClickIds: true,
  now: new Date(now.getTime() + 120_000),
});
const preservedStore = updateStoredAttribution(updatedStore, internalNavigation, new Date(now.getTime() + 120_000));
assert.equal(preservedStore.last.source, "linkedin");

const google = buildAttributionCandidate({
  href: "https://saaleweb.de/kontakt",
  referrer: "https://www.google.de/search?q=private-query#result",
  ownHostname: "saaleweb.de",
  includeClickIds: true,
  now,
});
assert.deepEqual(
  { source: google.touch.source, medium: google.touch.medium, channel: google.touch.channel },
  { source: "google", medium: "organic", channel: "Organic Search" },
);
assert.equal(google.touch.referrer, "https://www.google.de/search");

const direct = buildAttributionCandidate({
  href: "https://saaleweb.de/ru/kontakt",
  includeClickIds: true,
  now,
});
assert.deepEqual(
  { source: direct.touch.source, medium: direct.touch.medium, channel: direct.touch.channel },
  { source: "direct", medium: "none", channel: "Direct" },
);

const paidGoogle = buildAttributionCandidate({
  href: "https://saaleweb.de/kontakt?gclid=test-click-id",
  includeClickIds: true,
  now,
});
assert.deepEqual(
  { source: paidGoogle.touch.source, medium: paidGoogle.touch.medium, channel: paidGoogle.touch.channel },
  { source: "google", medium: "cpc", channel: "Paid Search" },
);

const perplexity = buildAttributionCandidate({
  href: "https://saaleweb.de/leistungen",
  referrer: "https://www.perplexity.ai/search?q=private",
  ownHostname: "saaleweb.de",
  includeClickIds: true,
  now,
});
assert.deepEqual(
  { source: perplexity.touch.source, medium: perplexity.touch.medium, channel: perplexity.touch.channel },
  { source: "perplexity", medium: "ai_referral", channel: "AI Referral" },
);

const gemini = buildAttributionCandidate({
  href: "https://saaleweb.de/leistungen",
  referrer: "https://gemini.google.com/app/123?prompt=private",
  ownHostname: "saaleweb.de",
  includeClickIds: true,
  now,
});
assert.deepEqual(
  { source: gemini.touch.source, medium: gemini.touch.medium, channel: gemini.touch.channel },
  { source: "gemini", medium: "ai_referral", channel: "AI Referral" },
);

const referral = buildAttributionCandidate({
  href: "https://saaleweb.de/kontakt",
  referrer: "https://partner.example/path?client=private",
  ownHostname: "saaleweb.de",
  includeClickIds: true,
  now,
});
assert.deepEqual(
  { source: referral.touch.source, medium: referral.touch.medium, channel: referral.touch.channel },
  { source: "partner.example", medium: "referral", channel: "Referral" },
);

const requestOnly = buildAttributionCandidate({
  href: "https://saaleweb.de/contact?gclid=must-not-persist&utm_source=telegram&utm_medium=social",
  includeClickIds: false,
  now,
});
assert.equal(requestOnly.touch.source, "telegram");
assert.equal(requestOnly.touch.gclid, undefined);

assert.equal(sanitizeInternalPath("/kontakt?email=private@example.com#form"), "/kontakt");
assert.equal(sanitizeInternalPath("https://evil.example/path"), undefined);
assert.equal(sanitizeReferrer("javascript:alert(1)"), undefined);
assert.equal(
  sanitizeReferrer("https://example.com/path?email=private@example.com#section"),
  "https://example.com/path",
);

const expiredAt = new Date(now.getTime() + ATTRIBUTION_TTL_MS + 1);
const resetStore = updateStoredAttribution(firstStore, linkedin, expiredAt);
assert.equal(resetStore.first.source, "linkedin");

console.log("Lead attribution pure-function tests passed.");
