import assert from "node:assert/strict";

process.env.NEXT_PUBLIC_GTM_ID = "GTM-TEST";
process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST";
const { initializeGoogleConsent } = await import("../src/features/analytics/googleConsent");
const { updateAnalyticsConsent } = await import("../src/features/analytics/gtm");
const previousWindow = globalThis.window;

function setup(saved: string | null = null, path = "/", storageBlocked = false) {
  const queue: unknown[] = [];
  globalThis.window = {
    dataLayer: queue,
    location: { pathname: path },
    localStorage: { getItem() { if (storageBlocked) throw new Error("Storage blocked"); return saved; } },
  } as unknown as Window & typeof globalThis;
  return queue;
}

function command(entry: unknown, action: string, analytics: string) {
  // Google gtag commands use Arguments objects; arrays have a different dataLayer meaning.
  assert.equal(Object.prototype.toString.call(entry), "[object Arguments]");
  assert.equal(Array.isArray(entry), false);
  const [category, mode, values] = Array.from(entry as IArguments);
  assert.equal(category, "consent");
  assert.equal(mode, action);
  assert.equal(values.analytics_storage, analytics);
  for (const key of ["ad_storage", "ad_user_data", "ad_personalization"]) {
    assert.equal(values[key], "denied");
  }
}

try {
  let queue = setup();
  initializeGoogleConsent();
  assert.equal(queue.length, 2);
  command(queue[1], "default", "denied");
  initializeGoogleConsent();
  assert.equal(queue.length, 2, "Bootstrap must be idempotent");
  updateAnalyticsConsent("granted");
  command(queue[2], "update", "granted");
  updateAnalyticsConsent("denied");
  command(queue[3], "update", "denied");

  queue = setup("granted");
  initializeGoogleConsent();
  command(queue[1], "default", "denied");
  command(queue[2], "update", "granted");

  queue = setup(null, "/", true);
  initializeGoogleConsent();
  command(queue[1], "default", "denied");
  assert.equal(queue.length, 2);

  queue = setup();
  updateAnalyticsConsent("denied");
  command(queue[0], "update", "denied");

  queue = setup(null, "/admin/leads");
  initializeGoogleConsent();
  assert.equal(queue.length, 0);

  setup();
  const calls: unknown[][] = [];
  const existingTag = (...args: unknown[]) => { calls.push(args); };
  window.gtag = existingTag;
  initializeGoogleConsent();
  updateAnalyticsConsent("granted");
  assert.equal(window.gtag, existingTag);
  assert.equal(calls.length, 2);
  console.log("Google consent regression checks passed (no network or analytics events sent).");
} finally {
  if (previousWindow === undefined) Reflect.deleteProperty(globalThis, "window");
  else globalThis.window = previousWindow;
}
