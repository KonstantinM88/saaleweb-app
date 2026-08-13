# Telegram AI analyst

The SaaleWeb Telegram bot includes an administrator-only, read-only AI analyst.
It is opened through `/ask` or the native Telegram command menu.

## Interface

`/ask` shows compact inline buttons:

- keywords;
- traffic and channels;
- leads and conversions;
- AI visibility;
- SEO and technical quality;
- general overview;
- a free-form question.

The free-form button sends a Telegram `ForceReply` prompt. The reply marker is
used as stateless context, so no conversation table, polling process or extra
database write is required. `/ask <question>` is also supported.

## Data boundaries

The analyst uses the existing reporting infrastructure and loads data only
after an administrator action:

- Google Search Console search analytics for keyword questions;
- GA4 aggregate reports for traffic questions;
- the aggregate weekly report for leads and conversion questions;
- AI crawler/referral plus manual AI visibility summaries;
- the cached daily SEO Score for technical questions.

Custom questions are classified into at most two relevant data areas and those
snapshots are loaded sequentially. This prevents an arbitrary question from
creating a wide parallel request burst against Neon or Google APIs.

The model never receives lead names, email addresses, phone numbers, messages,
IP addresses, click IDs, database IDs, secrets or raw tokens. It has no SQL,
write, deployment, advertising or admin tools. Existing Telegram webhook
authentication and the configured admin chat allowlist protect the entry point.

## Operational behavior

- No background job is added.
- No database migration or new environment variable is required.
- The existing `OPENAI_API_KEY` and `OPENAI_MODEL` are reused.
- If OpenAI is unavailable, normal Telegram reports continue to work.
- Answers must distinguish facts from recommendations and state when the
  available period or source is insufficient.

## Daily Search Console demand block

The regular daily report includes a separate TOP-10 query block for the latest
seven-day Search Console window available (normally delayed by about two days).
The ranking uses impressions as a measure of demand visible to SaaleWeb and
shows clicks, CTR, and average position. It is not external keyword volume and
not a live fixed Google rank.

Up to three short AI recommendations are generated only from those aggregate
rows. The model cannot invent a target page or query, and a deterministic
quick-win/CTR/content fallback keeps the report working if OpenAI is missing,
times out, or returns output that cannot be verified against the input rows.

After deployment, send `/start` once so Telegram refreshes the per-chat native
command menu, then open `AI-аналитик` and test one predefined topic and one
free-form reply.
