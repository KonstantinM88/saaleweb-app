# AI visibility stage 1

Stage 1 creates a measurable baseline instead of treating crawler visits as search visibility.

## What is included

- 20 fixed German commercial prompts for Halle and SaaleWeb's core services.
- Four consumer surfaces: ChatGPT Search, Google AI/Gemini, Perplexity and Microsoft Copilot.
- Weekly manual checks in `/admin/ai-visibility`.
- Separate states for not checked, not mentioned, mentioned and cited with a link.
- Optional mention order, cited SaaleWeb URL, visible competitor and notes.
- IndexNow submission for the deduplicated priority target pages.
- Russian admin interface and Telegram `/visibility` control with inline buttons for weeks, prompts, platforms, statuses and IndexNow.

Manual checks are intentional. API responses are not a reliable substitute for the results shown in the consumer products, which can vary by product, account, location and time.

## Weekly procedure

1. Open a clean/private browser session and avoid carrying an earlier conversation into the test.
2. Open the platform from the admin monitor.
3. Copy the prompt exactly without adding SaaleWeb to it.
4. Record whether SaaleWeb is mentioned and whether a SaaleWeb page is linked as a source.
5. Record the first clearly visible competitor and a short factual note when useful.
6. Complete all 80 prompt/platform combinations during the same weekly test window.

The main KPIs are citation coverage, mention coverage, cited target pages and recurring competitors. Crawler visits alone are only a discovery signal.

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

- **Не проверено**: the platform has not been checked for the selected week.
- **Не найден**: it was checked and SaaleWeb did not appear.
- **Упомянут**: SaaleWeb appeared but was not linked as a source.
- **Есть ссылка**: the answer linked to a SaaleWeb page.

## Telegram control

Use the persistent **🔎 AI-видимость** button or `/visibility`. Inline buttons open the weekly summary, groups of five prompts, platform details and four status actions. Telegram supports fast status recording and IndexNow submission; position, citation URL, competitor and notes remain available through **Расширенное редактирование** in the protected admin area.

After four weeks, compare prompt groups rather than single volatile answers. Content and authority work should prioritize prompts that repeatedly cite competitors but not SaaleWeb.
