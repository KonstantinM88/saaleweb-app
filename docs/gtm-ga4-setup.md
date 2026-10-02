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
Retention and the pre-existing key events remain as found. After the owner
verified a saved test lead in Tag Assistant and GA4 Realtime, `form_submit` was
registered as a GA4 key event with `ONCE_PER_EVENT` counting and passed API
readback. An audit submission emits both `form_submit` and `audit_request`;
`audit_request` remains a regular event so one audit lead has one primary key
event.

The supported browser connection still reports `No browser is available`, so
the owner uses signed-in Tag Assistant screenshots for the runtime verification.
Page-view, consent, AI-assistant, scroll-depth, email-click and persisted-lead
observations are recorded below. GA4 Realtime also confirmed events in an owner
reported normal browser session after publication. The separate DebugView UI
remains unverified.

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

Post-deploy check at 2026-10-03 00:00 Europe/Berlin: production HTTP 200 loads
`main-app-ed98bbe6ec8c4f36.js`, whose gtag wrapper now pushes `arguments`. The
owner's Tag Assistant screenshot shows default denial for all four signals and
an update granting only `analytics_storage`; advertising signals remain denied.
GA4 Realtime API reports 6 page_view, 1 session_start and 1 user_engagement in its
last-30-minute window. These observations confirm receipt during testing, not a
published production container: the live GTM version at that time was `1`,
Empty Container.
The owner's next Tag Assistant screenshot shows default denial of all four
signals after choosing `Nur notwendige Funktionen`, with the current state also
denied on a subsequent `page_view` history event. Consent revocation now passes
the observed Preview check. After analytics was granted again, Tag Assistant
showed an `ai_assistant_open` data-layer event and exactly one firing of
`GA4 - AI assistant open` on that event. GA4 Realtime API then returned
`ai_assistant_open: 1` (alongside `page_view: 4` and `user_engagement: 4`) at
2026-10-03 00:14 Europe/Berlin. This verifies GA4 receipt of that business
event during Preview.
The next owner screenshot showed two `scroll_depth` data-layer events after
scrolling across two thresholds; the selected event fired `GA4 - Scroll depth`
once. GA4 Realtime API returned `scroll_depth: 2` at 2026-10-03 00:19
Europe/Berlin. The two events correspond to separate threshold crossings,
not duplicate tag firings on one event.
The owner next clicked a mail link; Tag Assistant showed `email_click` and
exactly one `GA4 - Contact and outbound clicks` firing on that event. GA4
Realtime API returned `email_click: 1` at 2026-10-03 00:24 Europe/Berlin.
The owner then submitted a test contact form. Tag Assistant showed `form_submit`
and exactly one `GA4 - Persisted leads` firing. The application emits this event
only after the server action reports that a new lead was saved. GA4 Realtime API
returned `form_submit: 1` at 2026-10-03 00:29 Europe/Berlin. No form values or
personal data were used in API verification.

### Publication on 2026-10-03

Before publication, GTM workspace `2` contained exactly the six reviewed tags,
five triggers and twelve data-layer variables, with no merge conflicts. A fresh
`quick_preview` compiled successfully. Version `2`, `GA4 launch - consent, page
views and business events`, was created and published through the GTM API. GET
readback of `versions:live` confirmed version `2` with all six expected tags.
The production site continued serving the deployed consent-fix bundle and HTTP
200. The prior live version `1` was the empty container. After publication, the
owner opened the site without GTM Preview. GA4 Realtime reported a new
`page_view` and four `scroll_depth` events at about 00:39 Europe/Berlin, then
`ai_assistant_open: 1` in the current minute immediately after the owner opened
the assistant at 00:42. The minute-level API result links the latter event to
the owner's post-publication action. The live version still read back as `2`.

### GTM draft prepared on 2026-10-02

Workspace `2` had six tags before version creation: the two preserved existing tags plus
`GA4 - Persisted leads`, `GA4 - Contact and outbound clicks`,
`GA4 - Scroll depth`, and `GA4 - AI assistant open`. Eight DLV v2 variables and
four custom-event triggers were added. The ten existing application business
events match exactly one new trigger each. New triggers allow only `saaleweb.de`
or `www.saaleweb.de` and exclude `/admin` paths. Lead attribution parameters are
sent only by the lead tag; contact tags do not forward raw link URLs/text or form
fields. Scroll depth and assistant locale have their own parameter groups.

Google API quick_preview compiled successfully; API readback and local event/
hostname mapping assertions passed. Owner Tag Assistant screenshots and GA4
Realtime subsequently verified representative events from each tag group.
The reviewed workspace was published as version `2`; keep the original Google
and page-view tag configuration intact in future versions.

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

## Published GTM container setup

1. Data Layer Variable `DLV - ga_measurement_id` reads `ga_measurement_id`
   with Data Layer Version 2 for the four business-event tags.
2. Google tag `Google tag - GA4`:
   - Tag ID: `G-30BVTE3FPZ`
   - Trigger: **Initialization – All Pages**
   - Configuration parameter: `send_page_view` = `false`
   - Consent: keep the built-in consent checks enabled. Do not grant ad
     storage; the application defaults all Consent Mode v2 signals to denied.
3. The GA4 web stream has Enhanced measurement history-change page views and
   automatic form interactions disabled. SaaleWeb sends controlled App Router
   `page_view` events and tracks only successfully saved leads.
4. Custom Event trigger `CE - page_view` matches `page_view`.
5. Google Analytics: GA4 Event tag `GA4 - page_view`:
   - Measurement ID: `G-30BVTE3FPZ`
   - Event Name: `page_view`
   - Trigger: `CE - page_view`
   - Event parameters must use these **Data Layer Variables, Version 2**:
     - `DLV - page_location` → Data Layer Variable Name `page_location`
     - `DLV - page_path` → Data Layer Variable Name `page_path`
     - `DLV - page_title` → Data Layer Variable Name `page_title`
     - `DLV - page_language` → Data Layer Variable Name `page_language`

Keep `page_language` dynamic. The four DLVs above give each locale and App
Router navigation its actual URL, title and language.

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

The published version groups them into four Custom Event triggers and four
GA4 Event tags, each with Event Name `{{Event}}` and Measurement ID override
`{{DLV - ga_measurement_id}}`:

| Tag | Events | Additional parameters |
| --- | --- | --- |
| `GA4 - Persisted leads` | `form_submit`, `audit_request` | `form_name`, `lead_source`, `lead_medium`, `lead_channel`, `locale` |
| `GA4 - Contact and outbound clicks` | `phone_click`, `email_click`, `telegram_click`, `whatsapp_click`, `booking_click`, `outbound_link` | none |
| `GA4 - Scroll depth` | `scroll_depth` | `percent_scrolled` |
| `GA4 - AI assistant open` | `ai_assistant_open` | `widget_locale` |

All four tags also send `page_path` and `page_language`. Contact tags do not
send raw URLs, link text or contact data. Lead conversion dimensions contain
no PII or advertising click IDs. `form_submit` is the primary lead key event;
`audit_request` remains descriptive because an audit lead emits both names.

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
7. For changes to this container, publish only after Preview shows no duplicates.

For this launch, Preview and GA4 Realtime verified `page_view`,
`ai_assistant_open`, `scroll_depth`, `email_click` and `form_submit`. Consent
denial, analytics-only grant and revocation were observed in Preview. The
owner confirmed `page_view`, `scroll_depth` and `ai_assistant_open` collection
outside Preview after version `2` went live. The separate GA4 DebugView UI
remains unverified.

GTM/GA4 is an additional consent-aware layer. The existing SaaleWeb first-party
cookieless analytics remains active and independent.
