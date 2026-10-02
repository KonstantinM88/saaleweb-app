# Google Tag Manager and GA4 setup

SaaleWeb loads the GTM container with Next.js `GoogleTagManager` on every
public App Router page. The admin area is deliberately excluded. GA4 is not
mounted directly in the application; all Google Analytics tags are managed in
GTM so there is only one data layer and no duplicate loader.

## Environment

```env
NEXT_PUBLIC_GTM_ID="GTM-T3P99HPH"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-30BVTE3FPZ"
```

Both identifiers are public browser configuration, not secrets. Add them to
Hostinger for both build and runtime, then rebuild the application.

## Management API access (checked 2026-10-02)

The owner supplied GA4 property `545228440` and GTM account/container/workspace
`6365582562/258072740/2`. The configured GA4 property matches, and the existing
Google service-account credentials successfully obtain OAuth tokens. The owner
enabled both APIs in Google Cloud project `1062236669975`, resolving the initial
`SERVICE_DISABLED` responses. Subsequent checks found:

- GA4 property and stream reads succeed. Stream `15242153469` matches
  `G-30BVTE3FPZ` and `https://saaleweb.de`.
- The initial settings PATCH was denied despite successful reads. After the owner
  granted GA4 property Editor, the prepared PATCH/create requests succeeded and
  were verified by GET readback. GA4 write access is now confirmed.
- GTM access is now confirmed: account Admin and container Publish. Earlier account
  Admin alone yielded only container Read; the first variable creation was denied.
  After the owner granted container Publish, draft creation succeeded.
- Live container version `1` is `Empty Container` with zero tags. Existing Google
  and page-view tags were unpublished workspace changes; this explains why that
  published GTM container was not collecting GA4 events.

For configuration, use the existing identity
`saaleweb-platform@saaleweb.iam.gserviceaccount.com`. GTM container Publish
permission includes editing and version creation. Keep account ownership with the owner.
Never print private keys or access tokens during these checks. The owner clarified
that GA4 is not yet actively used/configured; empty reports alone are not an outage.

### GA4 configuration applied on 2026-10-02

Changed industry from `FINANCE` to `TECHNOLOGY`; preserved timezone `Europe/Berlin`
and currency `EUR`. Disabled enhanced measurement `pageChangesEnabled` and
`formInteractionsEnabled` to avoid competing with controlled App Router page
views and confirmed persisted-lead events. Automatic form detection must not be
mistaken for a successfully saved lead. Registered six event-scoped dimensions:
`page_language`, `locale`, `form_name`, `lead_source`, `lead_medium`, `lead_channel`.
All six definitions, category and both disabled settings passed API readback.
Retention and existing key events remain as found. Add lead key events only after
runtime verification. An audit submission emits both `form_submit` and
`audit_request`; do not sum those as two leads.

Browser Preview/DebugView and end-to-end collection remain unverified: the
supported browser connection still reports `No browser is available`. The owner
can run GTM Preview in the signed-in browser and supply the event/consent results.
The successful API configuration is not proof that events have reached GA4.

### Consent queue regression found in owner Preview

The owner confirmed three page-view tag firings across the homepage and two
App Router transitions, with one Google tag initialization. However, Tag Assistant
showed no default consent state on the third page-view event. The site wrappers
were pushing rest-parameter arrays instead of Google's required `arguments`
command objects. `ensureGoogleTag()` now supplies the shared standard wrapper
for initial consent, restored consent, and subsequent banner updates. Preserve
this protocol even if a linter suggests rest parameters: ordinary arrays are not
equivalent gtag commands. Existing externally installed `window.gtag` is preserved.

Run `node --import tsx scripts/test-google-consent.ts` for regression checks of
command format, default denial, restored consent, acceptance/revocation, storage
failure, idempotency, admin exclusion and preservation of an existing gtag. The
test reproduced the array-format failure before the fix and passes afterward.
The deployed `main-app-c671ccc280fdfbfc.js` was also inspected and contained the
same rest-array wrapper, confirming that the affected code reached production.
Protocol reference: [Google's consent setup example](https://developers.google.com/tag-platform/security/guides/consent).
This is a site-code change and must reach the deployed client bundle before
repeating Preview; editing or publishing GTM alone cannot deploy this fix.
After deployment verify default denied for all four signals, analytics-only
grant on acceptance and denial on revocation before publishing the container.
Local verification passed: consent regression script, `npm run typecheck`,
`npm run lint`, `npm run build` (252 static pages), and `git diff --check`.

### GTM draft prepared on 2026-10-02

Workspace `2` now has six tags: the two preserved existing tags plus
`GA4 - Persisted leads`, `GA4 - Contact and outbound clicks`,
`GA4 - Scroll depth`, and `GA4 - AI assistant open`. Eight DLV v2 variables and
four custom-event triggers were added. The ten existing application business
events match exactly one new trigger each. New triggers allow only `saaleweb.de`
or `www.saaleweb.de` and exclude `/admin` paths. Lead attribution parameters are
sent only by the lead tag; contact tags do not forward raw link URLs/text or form
fields. Scroll depth and assistant locale have their own parameter groups.

Google API quick_preview compiled successfully; API readback and local event/
hostname mapping assertions passed. This is configuration validation, not browser
Preview or proof of GA4 event receipt. No version was published; live remains the
empty container. GA4 Editor access/settings are now complete; finish browser
consent/navigation/event checks and DebugView before publishing per the checklist below. Existing
Google/page-view draft tags remain as found; their production-only filtering and
consent behavior must be included in that runtime check.

## Controlled App Router page views

`src/features/analytics/GtmRouteTracker.tsx` publishes one event after the
initial public render and after every real App Router URL change. It includes
query parameters, reads the validated next-intl locale passed by the public
layout, ignores `/admin`, and stores the last canonical tracking URL in a ref.
The ref is updated only immediately before the real push, so a cancelled
animation frame or React Strict Mode effect replay cannot lose or duplicate the
initial event.

The exact payload is:

```js
{
  event: "page_view",
  page_location: window.location.href,
  page_path: `${window.location.pathname}${window.location.search}`,
  page_title: document.title,
  page_language: "de" | "en" | "ru"
}
```

The event is queued in the single global `window.dataLayer` independently of
the visitor's analytics choice. The Google tag remains responsible for its
built-in consent checks; the application does not load a second GA script.

Consent defaults are initialized by `src/instrumentation-client.ts`. Next.js
runs this lightweight client instrumentation after the document loads but
before React hydration; the official `GoogleTagManager` component loads after
hydration. This preserves the required order without rendering a script tag
from the locale React layout.

## Required GTM container setup

1. Create a **Data Layer Variable** named `DLV - GA Measurement ID`:
   - Data Layer Variable Name: `ga_measurement_id`
   - Data Layer Version: 2
2. Create a **Google tag**:
   - Tag ID: `{{DLV - GA Measurement ID}}`
   - Trigger: **Initialization – All Pages**
   - Configuration parameter: `send_page_view` = `false`
   - Consent: keep the built-in consent checks enabled. Do not grant ad
     storage; the application defaults all Consent Mode v2 signals to denied.
3. In the GA4 web stream, open **Enhanced measurement → Page views → Advanced
   settings** and disable **Page changes based on browser history events**.
   SaaleWeb sends controlled App Router `page_view` events itself, so leaving
   this enabled would produce duplicates.
4. Create a **Custom Event trigger** named `CE - page_view` with event name
   `page_view`.
5. Create a **Google Analytics: GA4 Event** tag:
   - Measurement ID: `{{DLV - GA Measurement ID}}`
   - Event Name: `page_view`
   - Trigger: `CE - page_view`
   - Event parameters must use these **Data Layer Variables, Version 2**:
     - `DLV - page_location` → Data Layer Variable Name `page_location`
     - `DLV - page_path` → Data Layer Variable Name `page_path`
     - `DLV - page_title` → Data Layer Variable Name `page_title`
     - `DLV - page_language` → Data Layer Variable Name `page_language`

Do not set `page_language` to a static `de` value and do not use an undefined
placeholder such as `{{Page Title}}`. Use the four DLVs above in the GA4 Event
tag so every locale and App Router navigation carries its real values.

## Business events

The application already publishes these stable data layer event names:

- `form_submit`
- `phone_click`
- `email_click`
- `telegram_click`
- `whatsapp_click`
- `booking_click`
- `audit_request`
- `scroll_depth`
- `outbound_link`
- `ai_assistant_open`

Create one Custom Event trigger with this regular expression:

```text
^(form_submit|phone_click|email_click|telegram_click|whatsapp_click|booking_click|audit_request|scroll_depth|outbound_link|ai_assistant_open)$
```

Then create a GA4 Event tag with Event Name `{{Event}}`. Add the useful custom
parameters from Preview mode, for example `form_name`, `lead_source`,
`lead_medium`, `lead_channel`, `lead_campaign`, `device_category`, `link_url`,
`link_domain`, `link_text`, `percent_scrolled`, `page_path`, `locale` and
`widget_locale`. Lead conversion dimensions contain no PII or advertising
click IDs. Configure `form_submit` and `audit_request` as GA4 key events
only after verifying them in DebugView.

For a future booking control, add `data-gtm-event="booking_click"` to the
interactive element. The delegated tracker will publish the event without a
new listener or component dependency.

## Consent Mode v2

The application sets these defaults before GTM runs:

- `analytics_storage`: `denied`
- `ad_storage`: `denied`
- `ad_user_data`: `denied`
- `ad_personalization`: `denied`

Only `analytics_storage` can be granted by the public consent panel. Advertising
signals remain denied. The selected value is stored under
`saaleweb_analytics_consent` in local storage and can be changed through the
persistent privacy-settings control.

This is advanced consent mode: restricted cookieless signals may be sent while
analytics consent is denied. Do not add marketing or advertising tags without
reviewing the consent UI and privacy policy again.

## Verification after deployment

1. GTM → **Preview** → connect `https://saaleweb.de`.
2. Reject analytics: confirm Consent shows `analytics_storage = denied` and no
   GA cookies are created.
3. Accept analytics: confirm `analytics_storage = granted` while all ad consent
   values remain denied.
4. Navigate between `/`, `/leistungen`, `/kontakt`, `/en`, and `/ru`; exactly
   one `page_view` should appear per URL change.
5. Test a phone, email and WhatsApp link, submit a test form, open the AI
   assistant, and inspect the corresponding data layer events.
6. Verify `page_view` and business events in GA4 DebugView and Realtime.
7. Publish the GTM container only after Preview shows no duplicates.

GTM/GA4 is an additional consent-aware layer. The existing SaaleWeb first-party
cookieless analytics remains active and independent.
