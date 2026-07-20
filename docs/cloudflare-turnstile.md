# Cloudflare Turnstile for public lead forms

SaaleWeb uses one Cloudflare Turnstile Managed widget to protect every public
form that creates a `Lead`:

- homepage contact form;
- contact-page form;
- homepage website-audit form;
- dedicated free-audit landing-page form.

The browser widget alone is not trusted. Every token is validated by the
server action through Cloudflare Siteverify before a new lead is stored.
Tokens are single-use and expire after five minutes. The server also validates
the expected form action and, in production, the `saaleweb.de` hostname.

## Cloudflare setup

1. Open Cloudflare Dashboard → **Turnstile** → **Add widget**.
2. Use a descriptive name such as `SaaleWeb public lead forms`.
3. Select the **Managed** widget mode.
4. Add `saaleweb.de`; add `www.saaleweb.de` only if that hostname is served.
5. Copy the generated site key and secret key.

Turnstile works even when the website itself is not proxied through Cloudflare.

## Environment

Add both variables to Hostinger:

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY="public-site-key"
TURNSTILE_SECRET_KEY="server-secret-key"
```

`NEXT_PUBLIC_TURNSTILE_SITE_KEY` is intentionally public and is embedded into
the browser bundle at build time. `TURNSTILE_SECRET_KEY` must remain server-only
and must never be committed or exposed with a `NEXT_PUBLIC_` prefix.

After changing the Hostinger environment, rebuild/redeploy the application.

- Both values empty: CAPTCHA remains disabled, which keeps local development
  usable before keys are provisioned.
- Only one value present: submissions fail closed with a localized security
  message because the deployment is misconfigured.
- Both values present: every new public lead requires a valid Turnstile token.

## Security and privacy behavior

- the existing hidden honeypot remains active;
- idempotent retries with an already stored `submissionId` do not consume a new
  single-use token or create another lead;
- the request IP is sent only to Siteverify as an optional verification signal;
- the request IP, token and secret are never stored or printed in logs;
- logs contain only the form name, configuration state, safe failure reason and
  Cloudflare error-code names;
- CAPTCHA failure never creates a lead or sends email, Telegram or GA4
  conversion events.

The DE/EN/RU privacy policy documents the Cloudflare processing.

## Production verification

1. Open `/kontakt`, `/en/contact` and `/ru/kontakt` in a private browser window.
2. Confirm that the responsive security widget appears before the submit button.
3. Submit a valid request and verify one Lead, one Telegram notification and the
   expected email notifications.
4. In DevTools, remove or overwrite `cf-turnstile-response` before submission;
   the form must remain filled and show the localized CAPTCHA error.
5. Confirm that Cloudflare Turnstile Analytics records a successful token
   validation and that production logs do not contain the token or IP address.
6. Repeat one audit form to confirm it uses action `website_audit`.

Official references:

- [Embed the Turnstile widget](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [Validate tokens with Siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
