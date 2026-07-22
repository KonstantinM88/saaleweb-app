# AI visibility Stage 3: answer and evidence strengthening

Date: 23 July 2026

## Baseline used for this stage

The complete manual `2026-W30` benchmark contains 80 checks: 20 fixed German
commercial prompts across ChatGPT Search, Google AI/Gemini, Perplexity and
Microsoft Copilot.

- Mentions: 8/80 (10%)
- Citations with a SaaleWeb link: 4/80 (5%)
- ChatGPT Search: 6 mentions, including 3 citations
- Microsoft Copilot: 2 mentions, including 1 citation
- Google AI/Gemini: no verified mention
- Perplexity: no verified mention

The strongest verified target pages were `/leistungen/webdesign-halle` and
`/leistungen/seo-halle`. Near-wins without a verified link appeared for
`/branchen/handwerker-website`, `/leistungen/website-erstellen-lassen` and
`/kostenlose-website-analyse`. Pricing and the second Local SEO prompt remained
important misses.

## What Stage 3 changes

No new landing pages or benchmark prompts are created. Existing pages are made
easier to quote and verify:

1. The first two visible FAQ answers are promoted into an answer-first block
   directly below the hero on code-backed service, industry and location pages.
2. The same block links to up to two relevant real project examples, placing
   evidence next to the commercial answer instead of far below it.
3. The promoted questions are removed only from the lower visual FAQ list to
   avoid duplicate content. They remain visible near the top and remain in the
   full `FAQPage` JSON-LD graph.
4. The pricing page exposes its exact starting-price answer and package values
   before the detailed comparison.
5. The free audit page exposes its exact answer, scope, manual-review promise
   and links to project evidence before the longer page sections.
6. The trades page now links directly to the real Glaserei Schubert and
   SorgfaltBau project pages in DE, EN and RU.
7. Website-development content now states how multilingual URL, navigation and
   metadata architecture is handled in DE, EN and RU.
8. `llms.txt` contains a concise factual question-and-answer summary linked to
   the canonical supporting pages.

## Integrity rules

- Do not change the wording or order of the 20 benchmark prompts between weekly
  measurements.
- Do not report a citation without verifying a clickable SaaleWeb URL in the
  generated answer.
- A separate Google Maps card or ordinary search result is not an AI mention.
  Count it only when it is part of the generated answer being evaluated.
- Do not invent customer results, rankings, awards or performance metrics.
- Do not repeatedly submit unchanged URLs to IndexNow.

## Retest procedure

1. Deploy the material page changes.
2. Submit only the changed priority URLs through IndexNow.
3. Request recrawling for the most important changed URLs in Google Search
   Console where appropriate.
4. Keep the `2026-W30` records unchanged as the baseline.
5. Run the same 20 × 4 manual benchmark in a new week after discovery has had
   time to update.
6. Compare mention rate, citation rate and platform-level movement. Pay special
   attention to prompts 2, 5, 6, 9, 18 and 19.

The purpose is not to force an AI answer. It is to make the correct SaaleWeb
answer shorter to extract, easier to verify and better connected to first-party
evidence.
