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
