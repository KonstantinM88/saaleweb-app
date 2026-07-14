# Lead attribution

SaaleWeb records privacy-aware first-touch and last-touch attribution for every
active public path that creates a CRM `Lead`: the homepage contact form, the
contact-page form, both website-audit forms, and qualified hand-offs from the
AI assistant. The legacy `ContactRequest` model is not used by a public handler
and remains unchanged.

## Attribution model

- **First touch** is the first campaign, external referrer, or direct landing
  seen after consent. It is immutable until the 90-day record expires.
- **Last touch** changes when a later landing contains UTM/click parameters or
  begins with a new external referrer. Internal SaaleWeb navigation does not
  replace it.
- **Conversion page** is the pathname where the successful request was sent.
- **Landing pages** contain only a pathname. Hashes and arbitrary query values
  are not stored.
- **Referrers** contain only a safe HTTP(S) origin/host and optional pathname;
  query strings, hashes, credentials, and unsafe protocols are removed.

The browser record uses `saaleweb_attribution_v1`, schema version `1`, and a
90-day TTL. No attribution visitor ID, full user agent, or fingerprint is
created. Device data is reduced to `mobile`, `tablet`, `desktop`, or `unknown`.

## Consent behavior

The existing `saaleweb_analytics_consent` choice remains the only consent
source.

- With `analytics_storage = granted`, first/last touch is read from and written
  to local storage. Advertising click IDs may be stored in their dedicated
  database fields.
- With denied or not-yet-selected analytics consent, persistent attribution is
  not read or written. A voluntary form submission carries only current UTM,
  safe referrer, conversion pathname, locale, and device category. Click IDs
  are removed and `captureMode` is `request_only`.
- When consent is withdrawn, `saaleweb_attribution_v1` is deleted.
- `/admin` is excluded from capture.

## Prisma storage

`Lead.submissionId` is a nullable unique UUID. `LeadAttribution` has a unique
one-to-one relation to `Lead` and stores separate queryable first/last fields:

- source, medium, channel, campaign, content, and term;
- landing page and sanitized referrer;
- `gclid`, `fbclid`, and `msclkid` (persistent-consent mode only);
- captured timestamps;
- conversion page, device category, and capture mode.

All attribution fields are nullable so old leads remain valid. New form leads
receive a safe `direct / none / Direct` request-level fallback when an old
client sends no attribution. Existing historical leads can still have no
attribution and appear as `Keine Daten` in admin.

## Source classification

One shared classifier applies this priority:

1. Explicit UTM values.
2. `gclid`, `msclkid`, or `fbclid`.
3. Search-engine referrer.
4. Known AI referrer from the existing AI traffic detector.
5. Known social referrer.
6. Unknown external referral.
7. Direct.

Examples include `google / organic / Organic Search`, `telegram / social /
Social`, `chatgpt / ai_referral / AI Referral`, and `direct / none / Direct`.
The server sanitizes and reclassifies every browser payload; it does not trust
the submitted channel label.

## UTM convention

- `utm_source`: lowercase platform, for example `telegram`, `linkedin`, or
  `google_business_profile`.
- `utm_medium`: stable channel value such as `social`, `organic`, `email`, or
  `cpc`.
- `utm_campaign`: human-readable campaign key, preferably
  `<offer>_<period>_<locale>`.
- `utm_content`: creative/placement variant.
- `utm_term`: paid-search term when applicable.

Do not add UTM parameters to internal links; they would overwrite meaningful
last-touch campaign context.

Canonical campaign examples:

- Telegram DE: <https://saaleweb.de/kostenlose-website-analyse?utm_source=telegram&utm_medium=social&utm_campaign=audit_july_de>
- Telegram RU: <https://saaleweb.de/ru/besplatnyy-audit-sayta?utm_source=telegram&utm_medium=social&utm_campaign=audit_july_ru>
- Telegram EN: <https://saaleweb.de/en/free-website-audit?utm_source=telegram&utm_medium=social&utm_campaign=audit_july_en>
- Google Business Profile: <https://saaleweb.de/?utm_source=google_business_profile&utm_medium=organic&utm_campaign=local_halle>

German is the default locale and therefore has no `/de` prefix. Using the
canonical URLs above avoids unnecessary redirects and duplicate campaign URLs.

## Idempotency and delivery

Each form creates one `crypto.randomUUID()` on its first submit attempt and
keeps it through validation/network retries. The server creates `Lead` and
`LeadAttribution` in one transaction. A repeated `submissionId` returns a
successful duplicate response without another database row, email, Telegram
message, or conversion event. The AI assistant keeps its existing atomic
`conversation.leadId` claim and creates attribution in the same transaction.

Database persistence happens before external email or Telegram delivery. A
notification failure therefore does not roll back a valid lead.

## GA4 and first-party events

After a newly created lead is confirmed by the server, the existing data-layer
pipeline emits `form_submit`. Website-audit forms also emit `audit_request`.
Both events use only:

- `form_name`;
- `lead_source`, `lead_medium`, `lead_channel`, `lead_campaign`;
- `page_path`, `locale`, and `device_category`.

They never contain names, contact details, messages, websites, click IDs,
submission/lead IDs, IP addresses, user agents, or full referrers. Consent Mode
continues to govern GA4. Matching first-party events remain under `/e/*` and
are excluded from ordinary page-view totals.

## Notifications and admin

The admin email and Telegram notification show a compact attribution summary
without click IDs or raw referrer. The existing admin lead table and CSV export
show channel, first/last source, campaign, landing/conversion pages, device,
and capture mode. Client auto-replies remain unchanged.

## Manual verification

1. Clear `saaleweb_attribution_v1`, grant analytics, and open a campaign URL.
2. Navigate internally before submitting and verify that first touch remains
   unchanged while conversion page matches the form page.
3. Open a second external/UTM campaign and verify only last touch changes.
4. Deny analytics, verify the attribution storage key is absent, and submit a
   current UTM request; it must use `request_only` and contain no click IDs.
5. Retry one request with the same submission UUID; verify one lead, one
   attribution row, one notification set, and one conversion event.
6. In GTM Preview/GA4 DebugView, verify exactly one `form_submit`; audit forms
   must additionally produce exactly one `audit_request`.

`npm run attribution:test` covers pure classification, sanitization, TTL,
first/last updates, internal-navigation preservation, and request-only click-ID
removal without creating production leads or sending Telegram messages.

## Stage 2B

Stage 2B can group these queryable fields into source/campaign reports,
Telegram `/attribution`, and an analytics dashboard. Advertising APIs,
spend/cost-per-lead, offline conversions, and campaign budget are deliberately
outside this foundation stage.
