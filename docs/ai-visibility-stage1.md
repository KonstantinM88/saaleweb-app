# AI visibility — Stage 1

## Goal

Stage 1 makes SaaleWeb easier to identify, understand and cite in answer engines without creating doorway pages or promising placements that no agency can guarantee.

The benchmark contains 20 German commercial questions across ChatGPT Search, Google AI/Gemini, Perplexity and Microsoft Copilot. This produces 80 manual checks per week. A check records whether SaaleWeb was mentioned and whether a SaaleWeb URL was cited.

The current dashboard can start at `0/80`. That means the weekly checks have not been recorded yet; it is not evidence that all platforms tested SaaleWeb and rejected it.

## What is included

- 20 fixed German commercial prompts for Halle and SaaleWeb's core services.
- Four consumer surfaces: ChatGPT Search, Google AI/Gemini, Perplexity and Microsoft Copilot.
- Weekly manual checks in `/admin/ai-visibility`.
- Separate states for not checked, not mentioned, mentioned and cited with a link.
- Optional mention order, cited SaaleWeb URL, visible competitor and notes.
- IndexNow submission for the deduplicated priority target pages.
- Russian admin interface and Telegram `/visibility` control with inline buttons for weeks, prompts, platforms, statuses and IndexNow.

Manual checks are intentional. API responses are not a reliable substitute for the results shown in the consumer products, which can vary by product, account, location and time.

## What Stage 1 changes

- Priority service, industry and location pages answer their assigned commercial benchmark question directly in the visible FAQ.
- Code-backed landing pages include a compact answer-first facts block with provider, focus, region and next step.
- The pricing page answers the Halle website-cost question with the published 600/990/1,990 EUR entry prices.
- The free audit page explains who provides the audit, what is checked and that it is manual and non-binding.
- The project index exposes real-project and verified-review evidence visibly and through `CollectionPage` and `ItemList` JSON-LD.
- Existing detailed content, internal links, organization schema, `llms.txt`, sitemap and IndexNow remain the supporting discovery layer.

## Commercial intent ownership

High-intent keyword variants are consolidated on existing authoritative pages instead of being split into near-duplicate landing pages:

- `/leistungen/webdesign-halle` owns Webdesign Halle, Webdesigner Halle and Webagentur Halle.
- `/leistungen/website-erstellen-lassen` owns Website-Erstellung für Unternehmen, Homepage erstellen lassen and Firmenwebsite erstellen lassen.
- `/standorte/halle` connects the Halle service entity with Sachsen-Anhalt and the wider regional service area.
- `/leistungen/ki-assistent` owns KI-Assistent and KI-Chatbot use cases for companies.
- `/preise` remains the source of truth for published entry prices.

The wording is used naturally in headings, summaries and decision-oriented FAQ answers. Do not create a separate page for every spelling variant; that would divide signals, duplicate intent and make both classical search and answer engines less certain about the primary source.

The 20 benchmark questions remain unchanged while this content layer is refined. This keeps weekly results comparable. Paid-search keyword reports may inform page wording, but they are not copied into the benchmark or the page as a visible keyword list.

## Weekly benchmark process

1. Use clean consumer sessions where practical; do not tell the assistant which company to choose.
2. Ask the exact saved question in each platform.
3. Record `mentioned` only when the answer explicitly names SaaleWeb.
4. Record `cited` only when the answer provides a clickable SaaleWeb URL or an identifiable source citation.
5. Save a short neutral note when the answer names a competitor, uses stale information or cites the wrong page.
6. Compare the same question set week over week; do not replace weak questions merely to improve the score.

## IndexNow setup

Generate one key:

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

Add it to local and Hostinger environments:

```env
INDEXNOW_KEY="generated-value"
```

After deployment:

1. Open `https://saaleweb.de/indexnow-key.txt` and confirm it returns the key as plain text.
2. Open `/admin/ai-visibility`.
3. Use **Отправить приоритетные страницы** only after adding or materially updating the tracked pages.
4. Verify submissions in Bing Webmaster Tools under IndexNow.

IndexNow accelerates discovery; it does not guarantee crawling, indexing, ranking or inclusion in an AI answer. Do not repeatedly submit unchanged URLs.

## Interpretation

- A mention without a link shows entity recognition but weak source attribution.
- A citation is the stronger signal because the platform selected a SaaleWeb page as supporting evidence.
- Changes may take several crawls or model refreshes to appear. Evaluate trends over at least four to eight weeks.
- Search personalization, location and model changes can alter answers. The benchmark is directional, not an official rank tracker.

Status meanings:

- **Не проверено**: the platform has not been checked for the selected week.
- **Не найден**: it was checked and SaaleWeb did not appear.
- **Упомянут**: SaaleWeb appeared but was not linked as a source.
- **Есть ссылка**: the answer linked to a SaaleWeb page.

## Telegram control

Use `/visibility` from Telegram's compact native **Menu** button. Inline buttons open the weekly summary, groups of five prompts, platform details and four status actions. Telegram supports fast status recording and IndexNow submission; position, citation URL, competitor and notes remain available through **Расширенное редактирование** in the protected admin area. The old persistent reply keyboard is removed after the next command so it no longer occupies the bottom third of the chat.

## Stage 2 handoff

The shared authority layer is documented in `docs/ai-visibility-stage2-authority.md`. It adds connected expert authorship, real modification dates, a dated methodology and links to verifiable projects and the public Google Business Profile. After the first complete baseline and at least one repeat measurement, prioritize questions that show either competitor citations or SaaleWeb mentions without links. Add query-specific original evidence only where it is genuinely available; never fabricate statistics, customer results or awards.
