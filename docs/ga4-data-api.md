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
GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GA4_PROPERTY_ID="545228440"
```

These values are server-only. Never create `NEXT_PUBLIC_GSC_PRIVATE_KEY` or
`NEXT_PUBLIC_GA4_PROPERTY_ID`, and never commit the private key. Hostinger must
receive the variables for both build and runtime.

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

- `/report`: first-party rolling 24 hours plus a compact GA4 block for
  **yesterday**, compared with `2daysAgo`.
- `/week`: first-party rolling 7 days plus a compact GA4 block for
  `7daysAgo -> yesterday`, compared with `14daysAgo -> 8daysAgo`.
- `/ga4` or the `📈 GA4` button: detailed audience, channel, landing-page,
  device, country, and business-event data for the last seven completed days.

GA4 failures never block `/report`, `/week`, the daily cron report, Search
Console, PageSpeed, AI monitoring, or first-party analytics.

## 6. Troubleshooting

- `401`: verify the service-account email/private key and ensure the key keeps
  escaped `\n` line breaks in the hosting environment.
- `403`: verify that Google Analytics Data API is enabled, then add the
  service-account email in GA4 **Property access management** with Viewer
  access and verify `GA4_PROPERTY_ID`.
- `429`: the Data API quota is temporarily exhausted; wait and retry.
- `5xx` or timeout: Google is temporarily unavailable; the Telegram report
  falls back to first-party analytics.
- Empty report: confirm the property contains data for completed calendar days,
  GTM is published, the Google tag receives events, and the selected property
  is correct.

Use the Telegram `/ga4` command after deployment for a safe smoke test. It does
not print the OAuth token, private key, raw Google response, or stack trace.
