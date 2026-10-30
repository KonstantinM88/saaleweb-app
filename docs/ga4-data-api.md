# Google Analytics Data API reporting

SaaleWeb reads GA4 reporting data only on the server and adds it to the private
Telegram admin reports. This does not replace or modify the existing browser
GTM integration described in `docs/gtm-ga4-setup.md`.

## 1. Enable the API

1. Open the Google Cloud project that owns the existing service account.
2. Enable the
   [Google Analytics Data API](https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com).
3. Keep the existing service-account key. A second private key is unnecessary.

The server follows Google's
[service-account OAuth flow](https://developers.google.com/identity/protocols/oauth2/service-account),
requests the read-only scope
`https://www.googleapis.com/auth/analytics.readonly`, and calls the official
[`properties:runReport`](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport)
REST endpoint.

## 2. Grant access to the GA4 property

In Google Analytics open:

`Admin -> Property access management -> Add users`

Add the exact email from `GSC_CLIENT_EMAIL` and grant the **Viewer** role. The
service account must be added to the GA4 property itself; enabling the API in
Google Cloud alone is not enough.

The current SaaleWeb property ID is `545228440`. A Measurement ID such as
`G-30BVTE3FPZ` is not a Property ID and cannot be used by the Data API.

## 3. Environment variables

```env
GSC_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
GSC_PRIVATE_KEY_BASE64="BASE64_ENCODED_PRIVATE_KEY"
GA4_PROPERTY_ID="545228440"
```

These values are server-only. Never create `NEXT_PUBLIC_GSC_PRIVATE_KEY` or
`NEXT_PUBLIC_GA4_PROPERTY_ID`, and never commit the private key. Hostinger must
receive the variables for both build and runtime.

For Hostinger, `GSC_PRIVATE_KEY_BASE64` is the preferred format. It keeps the
entire PEM key on one line and prevents hosting dashboards from changing or
dropping its line breaks. Encode the existing valid PEM file locally, then
copy only the resulting Base64 string into Hostinger:

```bash
node -e "const fs=require('fs'); process.stdout.write(Buffer.from(fs.readFileSync('private-key.pem','utf8')).toString('base64'))"
```

The legacy variable remains supported as a fallback when the Base64 variable
is empty:

```env
GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

When both variables are present, `GSC_PRIVATE_KEY_BASE64` has priority. The
server decodes it in memory, normalizes line endings, verifies the PKCS#8 PEM
boundaries, and never logs or stores the encoded value or decoded key.

The shared Google JWT helper exchanges the service-account assertion for an
OAuth access token and caches that token only in process memory until shortly
before expiration. Tokens and private-key contents are never logged or stored
in PostgreSQL.

## 4. GA4 versus SaaleWeb first-party analytics

- SaaleWeb first-party analytics is cookieless and stores rolling page-view
  windows in PostgreSQL. Its daily report covers the latest 24 hours.
- GA4 is queried from Google and follows the GA4 property timezone and Consent
  Mode behavior. Depending on eligibility, GA4 can include modeled metrics.
- The two systems use different collection and identity rules. Their totals
  should be compared for trends, not merged into one number.
- Synthetic first-party interaction paths under `/e/*` remain stored but are
  excluded from Telegram page-view, visitor, locale, referrer, and top-page
  statistics.

## 5. Telegram reports and periods

- `/report`: first-party rolling 24 hours, a calendar traffic chart, and a
  compact GA4 block. GA4 checks the last **seven completed calendar days** and
  selects the most recent day with records, normally yesterday. If yesterday
  has no records yet, the block names the actual selected date and explains
  the fallback; it never presents older data as yesterday. Comparison uses the
  calendar day immediately before the selected date. An empty or failed
  comparison response is marked unavailable, not converted into a zero
  baseline. The GA4 block also shows the selected day's
  `form_submit` events, contact-channel clicks (`phone_click`, `email_click`,
  `telegram_click`, `whatsapp_click`), and `ai_assistant_open` events. These are
  separate GA4 event counts, not additions to the first-party lead total.
- `/week`: first-party rolling 7 days plus a compact GA4 block for
  `7daysAgo -> yesterday`, compared with `14daysAgo -> 8daysAgo`.
- `/ga4` or the `📈 GA4` button: detailed audience, channel, landing-page,
  device, country, and business-event data (including `scroll_depth`) for the
  last seven completed days.

The `/report`, `/week`, and daily cron chart shows first-party views and
approximate daily visitors for the last seven completed days plus the partial
current day. Summary cards and text compare yesterday with the preceding day,
the last seven completed days with the preceding seven days, and today's
elapsed time with the same elapsed duration yesterday. Today is explicitly
marked incomplete. Calendar boundaries follow `TELEGRAM_REPORT_TIMEZONE`
(default `Europe/Berlin`), including DST; GA4's daily selection uses the
property timezone returned by its Data API. PageView UTC timestamps are
converted to the report timezone before grouping. Daily visitor identifiers
rotate at UTC midnight, so these are estimates, not distinct people over a
week. The existing rolling lead/AI/source periods remain explicitly labeled.

PNG generation uses the existing server-side Sharp dependency and aggregate
counts only, without an external chart service. Each recipient receives the
chart before the text. If rendering or photo delivery fails, the text still
contains the comparisons and a clear chart-unavailable notice. Text keeps
the existing 4096-character splitting and final-chunk menu behavior.

The daily cron endpoint `/api/telegram/daily-report` uses the same `/report`
content. A cron-job.org job at `08:00` in `Europe/Berlin` was verified from
the 2026-10-02 execution history: HTTP 200, `delivery.attempted: 2`,
`delivery.sent: 2`, `delivery.failed: 0`, `partial: false`. A future HTTP 200
alone proves only that at least one recipient received the report; inspect the
response body for all recipient counts. The endpoint does not have a per-day
send lock, so manually repeating the cron request sends another report.
When a photo is attached, `delivery.photos` separately counts attempted/sent/
failed photos. `delivery.sent` counts completed text deliveries; `partial`
also becomes true when a photo fails but text succeeds.
An authenticated manual request with `?test=1` sends the full report with a
`[TEST]` prefix; leave this parameter off the scheduled job.

Use `Authorization: Bearer <TELEGRAM_REPORT_SECRET>` as a custom cron-job.org
request header and keep the URL free of `?secret=`. [cron-job.org supports
custom headers](https://cron-job.org/en/faq/). If the secret was displayed in a screenshot or shared URL,
replace it in Hostinger and the cron job, then run a controlled test and
confirm `sent: 2`, `failed: 0`. Do not place the new secret in screenshots,
commits, or chat messages.

GA4 failures never block `/report`, `/week`, the daily cron report, Search
Console, PageSpeed, AI monitoring, or first-party analytics.

## 6. Troubleshooting

- `invalid_google_private_key`: on Hostinger prefer `GSC_PRIVATE_KEY_BASE64`;
  otherwise verify that the legacy PEM keeps escaped `\n` line breaks.
- `401`: verify the service-account email/key pair and that the key belongs to
  the configured service account.
- `403`: verify that Google Analytics Data API is enabled, then add the
  service-account email in GA4 **Property access management** with Viewer
  access and verify `GA4_PROPERTY_ID`.
- `429`: the Data API quota is temporarily exhausted; wait and retry.
- `5xx` or timeout: Google is temporarily unavailable; the Telegram report
  falls back to first-party analytics.
- Empty report: confirm the property contains data for completed calendar days,
  GTM is published, the Google tag receives events, and the selected property
  is correct.

An empty GA4 response does not prove zero website traffic. The daily fallback
is bounded to seven completed days; if none contains records, the report says
so rather than reusing arbitrary old traffic. Google documents processing
delays of [24–48 hours](https://support.google.com/analytics/answer/11198161?hl=en).
Consent behavior is preserved; first-party counts are never substituted for
GA4 metrics.

Run `npm run telegram:report:test` for isolated calendar, fallback, PNG,
comparison, text splitting, and photo failure checks. It uses mocked Google
and Telegram requests, synthetic credentials, and no database writes or real
Telegram messages. A production test remains a separate controlled action.

Use the Telegram `/ga4` command after deployment for a safe smoke test. It does
not print the OAuth token, private key, raw Google response, or stack trace.
