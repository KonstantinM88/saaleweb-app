import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { calendarDate, calendarMidnight, shiftCalendarDate } from "../src/shared/lib/reportCalendar";
import { trafficChange, type TelegramTrafficSnapshot } from "../src/features/notifications/trafficSummary";

// Entirely isolated: synthetic credentials, mocked Google/Telegram, no DB calls.
process.env.GSC_CLIENT_EMAIL = "report-test@example.test";
process.env.GSC_PRIVATE_KEY_BASE64 = "";
process.env.GSC_PRIVATE_KEY = generateKeyPairSync("rsa", { modulusLength: 2048 })
  .privateKey.export({ type: "pkcs8", format: "pem" }).toString();
process.env.GA4_PROPERTY_ID = "123";
process.env.TELEGRAM_BOT_TOKEN = "test-token";
process.env.TELEGRAM_ADMIN_CHAT_ID = "101 202";
process.env.TELEGRAM_REPORT_TIMEZONE = "Europe/Berlin";
const realFetch = globalThis.fetch;
const { fetchGa4Snapshot } = await import("../src/features/analytics/googleAnalytics");
const { sendTelegramAdminMessageDetailed } = await import("../src/features/notifications/telegram");
const { renderTelegramTrafficChart, trafficChartSvg } = await import("../src/features/notifications/telegramTrafficChart");
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json" },
});
let passed = 0;
function check(name: string, task: () => void) { task(); passed += 1; console.log(`PASS ${name}`); }

try {
  check("Berlin calendar handles both DST boundaries", () => {
    const hours = (start: string, end: string) =>
      (calendarMidnight(end, "Europe/Berlin").getTime() - calendarMidnight(start, "Europe/Berlin").getTime()) / 3_600_000;
    assert.equal(hours("2026-03-29", "2026-03-30"), 23);
    assert.equal(hours("2026-10-25", "2026-10-26"), 25);
    assert.equal(calendarDate(new Date("2026-10-29T23:30:00Z"), "Europe/Berlin"), "2026-10-30");
    assert.equal(shiftCalendarDate("2026-03-01", -1), "2026-02-28");
  });
  check("zero baselines never become infinity or an unexplained zero", () => {
    assert.equal(trafficChange(0, 0), "без изменений");
    assert.equal(trafficChange(4, 0), "+4, было 0");
    assert.equal(trafficChange(5, 10), "-5 / -50%");
  });

  const yesterday = shiftCalendarDate(calendarDate(new Date(), "Europe/Berlin"), -1);
  const selected = shiftCalendarDate(yesterday, -1);
  const previous = shiftCalendarDate(selected, -1);
  type RequestBody = { dateRanges: { startDate: string }[]; dimensions?: { name: string }[]; metrics: { name: string }[] };
  let mode: "fallback" | "empty" | "previous_empty" | "previous_error" | "probe_error" = "fallback";
  const requestedDates: string[] = [];
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (url === "https://oauth2.googleapis.com/token") return json({ access_token: "unit-token", expires_in: 3600 });
    assert(url.startsWith("https://analyticsdata.googleapis.com/"), "No unexpected outbound request");
    const body = JSON.parse(String(init?.body)) as RequestBody;
    const probe = body.dimensions?.[0]?.name === "date";
    if (probe && mode === "probe_error") return json({}, 503);
    if (mode === "empty") return json({ metadata: { timeZone: "Europe/Berlin" } });
    const start = body.dateRanges[0]!.startDate;
    if (!probe) requestedDates.push(start);
    if (!probe && start === previous && mode === "previous_error") return json({}, 503);
    if (!probe && start === previous && mode === "previous_empty") return json({ metadata: { timeZone: "Europe/Berlin" } });
    return json({
      metadata: { timeZone: "Europe/Berlin" },
      dimensionHeaders: body.dimensions,
      metricHeaders: body.metrics,
      rows: [{
        dimensionValues: (body.dimensions ?? []).map(({ name }) => ({ value: name === "date" ? selected.replaceAll("-", "") : name === "eventName" ? "form_submit" : "sample" })),
        metricValues: body.metrics.map(({ name }) => ({ value: name === "engagementRate" ? "0.5" : "3" })),
      }], rowCount: 1,
    });
  };
  const fallback = await fetchGa4Snapshot("daily");
  check("GA4 selects the last completed day with data and its real predecessor", () => {
    assert(fallback.available);
    assert.equal(fallback.periodEnd, selected);
    assert.equal(fallback.requestedDay, yesterday);
    assert.equal(fallback.fallbackDays, 1);
    assert(requestedDates.includes(previous));
    assert(!requestedDates.includes(yesterday));
  });
  mode = "previous_error";
  const partial = await fetchGa4Snapshot("daily");
  check("failed comparison is unavailable, never a fabricated zero baseline", () => {
    assert(partial.available);
    assert.equal(partial.previousAvailable, false);
    assert.equal(partial.errorCode, "ga4_partial_data");
  });
  mode = "empty";
  const empty = await fetchGa4Snapshot("daily");
  check("no GA4 records is distinct from failed authentication", () => {
    assert(empty.configured);
    assert.equal(empty.errorCode, "ga4_no_data");
    assert.equal(empty.available, false);
  });
  mode = "previous_empty";
  const noBaseline = await fetchGa4Snapshot("daily");
  check("empty previous day is not treated as a confirmed zero baseline", () => {
    assert(noBaseline.available);
    assert.equal(noBaseline.previousAvailable, false);
  });
  mode = "probe_error";
  const probeFailure = await fetchGa4Snapshot("daily");
  check("freshness-probe failure does not block ordinary GA4 reporting", () => {
    assert(probeFailure.available);
    assert.equal(probeFailure.periodEnd, yesterday);
  });

  const days = Array.from({ length: 15 }, (_, index) => ({ date: shiftCalendarDate(yesterday, index - 13), views: 0, visitors: 0 }));
  const traffic: TelegramTrafficSnapshot = {
    timeZone: "Europe/Berlin", days, today: days[14]!, yesterday: days[13]!, dayBefore: days[12]!,
    todayClock: "08:00", previousClock: "08:00", previousPartial: { views: 0, visitors: 0 },
    week: { views: 0, visitors: 0 }, previousWeek: { views: 0, visitors: 0 },
  };
  const png = await renderTelegramTrafficChart(traffic);
  check("zero-traffic chart is a real PNG without invented nonzero bars", () => {
    assert(png);
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert(trafficChartSvg(traffic).includes('height="0"'));
    assert(trafficChartSvg(traffic).includes("неполный"));
  });

  let photoFailure = false;
  const sent: { chat: string; method: string; text?: string; markup?: unknown }[] = [];
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    assert(url.startsWith("https://api.telegram.org/bottest-token/"), "No live Telegram calls");
    if (url.endsWith("/sendPhoto")) {
      assert(init?.body instanceof FormData);
      const form = init.body;
      const file = form.get("photo");
      assert(file instanceof Blob);
      assert(file.size > 0);
      sent.push({ chat: String(form.get("chat_id")), method: "photo" });
      return photoFailure ? json({ ok: false, error_code: 500 }, 500) : json({ ok: true });
    }
    const body = JSON.parse(String(init?.body));
    sent.push({ chat: String(body.chat_id), method: "text", text: body.text, markup: body.reply_markup });
    assert(body.text.length <= 4096);
    return json({ ok: true });
  };
  const options = { photo: { bytes: png!, caption: "Synthetic report fixture" }, replyMarkup: { remove_keyboard: true } };
  const delivered = await sendTelegramAdminMessageDetailed(Array(300).fill("A bounded report line").join("\n"), options);
  check("photo precedes split text per recipient; menu appears only on final text", () => {
    assert.equal(delivered.sent, 2);
    assert.deepEqual(delivered.photos, { attempted: 2, sent: 2, failed: 0 });
    assert.equal(delivered.partial, false);
    for (const chat of ["101", "202"]) {
      const messages = sent.filter((message) => message.chat === chat);
      assert.equal(messages[0]?.method, "photo");
      assert(messages.length >= 3);
      assert.equal(messages.filter((message) => message.markup).length, 1);
      assert(messages.at(-1)?.markup);
    }
  });
  photoFailure = true;
  sent.length = 0;
  const degraded = await sendTelegramAdminMessageDetailed("Report survives a photo error", options);
  check("photo failure preserves text delivery and reports partial rich delivery", () => {
    assert.equal(degraded.ok, true);
    assert.equal(degraded.partial, true);
    assert.equal(degraded.sent, 2);
    assert.equal(degraded.photos?.failed, 2);
    assert(sent.filter((message) => message.method === "text").every((message) => message.text?.includes("Диаграмму доставить не удалось")));
  });
  console.log(`Telegram report checks: ${passed} passed; no external messages or DB writes.`);
} finally {
  globalThis.fetch = realFetch;
}
