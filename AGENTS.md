# AGENTS.md

Instructions and project memory for coding agents working in this repository.

## Mandatory Workflow

1. Before starting any task, read this file from top to bottom.
2. Treat this file as the project memory. Keep it current when you learn or change something that will matter later.
3. Record important decisions, architecture changes, setup gotchas, commands, environment requirements, and recurring bugs in this file.
4. Do not remove existing notes unless they are obsolete or wrong. If a note becomes obsolete, replace it with the new fact and add context.
5. Prefer small, focused updates. This file should stay useful as a fast briefing, not become a full changelog.

## Project Snapshot

- Product: SaaleWeb marketing site for `saaleweb.de`.
- Stack: Next.js 16 App Router, React 19.2, TypeScript, Tailwind CSS 3.4, next-intl 4, Prisma 7, PostgreSQL, Zod 4.
- Architecture: Feature-Sliced Design.
- Locales: `de`, `en`, `ru`; German is the default locale.
- Locale routing: German lives at `/`, English at `/en`, Russian at `/ru`.
- Public URL segments are localized through `next-intl` `pathnames`: services use `/leistungen`, `/services`, `/uslugi`; industries use `/branchen`, `/industries`, `/otrasli`; pricing uses `/preise`, `/pricing`, `/tseny`; locations use `/standorte`, `/locations`, `/lokacii`; blog categories use `/blog/kategorie`, `/blog/category`, `/blog/kategoriya`.
- Public service and industry index pages exist at `/leistungen` and `/branchen` with localized public URLs; cards link to DB-backed detail pages.
- Public project/case pages exist at `/projekte`, `/projects`, `/proekty` and detail pages at localized `/projekte/[slug]`, `/projects/[slug]`, `/proekty/[slug]`.
- Public pricing page exists at `/preise`, `/en/pricing`, and `/ru/tseny`; homepage pricing section remains available at `#pricing`.
- Most homepage sections now prefer published DB rows and fall back to `messages/*.json` when DB data is unavailable, empty, or incomplete. DB-backed homepage sections include services, industries, case studies/projects, FAQ, and testimonials.
- Database is required for contact form persistence and future CMS/content features.
- First-party analytics stores page views in `PageView` via `/api/track` without cookies or raw IP storage; bot user agents and admin routes are not tracked, and unique visitors are counted through a daily salted `visitorHash`.
- Admin image uploads convert images to WebP with `sharp`; production storage uses Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set, otherwise local dev writes to `public/uploads`.

## Important Paths

- `src/app/[locale]/page.tsx` - homepage composition.
- `src/app/[locale]/layout.tsx` - locale validation, metadata, fonts, `NextIntlClientProvider`.
- `src/proxy.ts` - Next.js 16 middleware/proxy entry for next-intl.
- `src/i18n/` - locale routing, navigation, request config.
- `messages/de.json`, `messages/en.json`, `messages/ru.json` - localized UI copy.
- `src/widgets/` - page sections.
- `src/widgets/testimonials/Testimonials.tsx` - homepage testimonial section; reads published testimonials from DB by locale and falls back to message JSON.
- `src/widgets/services/Services.tsx`, `src/widgets/industries/Industries.tsx`, `src/widgets/case-studies/CaseStudies.tsx`, `src/widgets/faq/Faq.tsx` - homepage sections that read published DB content by locale with message fallbacks.
- `src/widgets/pricing/Pricing.tsx` and `src/widgets/pricing/PricingPlans.tsx` - homepage and pricing-page tariff rendering with DB rows and message fallback.
- `src/widgets/ai-ready/AiOrbit.tsx` - code-native animated AI engine orbit scene used inside the AI-ready homepage section.
- `src/widgets/ai-ready/AiSearchWindow.tsx` - CSS-only AI search ecosystem scroll-through background window inside the AI-ready homepage section; mobile keeps the image visible with bright brand-aware icon-only AI nodes and text moved below the image.
- `src/widgets/local-seo/LocalSeo.tsx` - code-native animated multi-city regional visibility map section on the homepage; desktop and mobile use separate coordinate layouts to avoid label/card overlaps on phones.
- `src/widgets/growth-window/GrowthWindow.tsx` - homepage premium scroll-window visual section using an optimized static WebP and CSS-only sticky positioning.
- `src/widgets/why-saaleweb/WhySaaleWebSection.tsx` - conversion-focused homepage value section that replaced the old technical SaaleWeb-vs-WordPress comparison.
- `src/widgets/comparison/BeforeAfter.tsx` - legacy client-side before/after visual comparison slider retained for reference; no longer rendered on the homepage after `WhySaaleWebSection` replaced the comparison block.
- `public/images/comparison/` - static WebP assets for the legacy before/after comparison slider.
- `public/images/cases/` - static WebP assets used as project/case study covers when media should live in the committed public asset tree.
- `public/images/sections/` - static optimized WebP/WebM assets for non-record-specific homepage/landing sections.
- `src/widgets/tech-stack/CodeWindow.tsx` - code-native animated editor/build scene used inside the tech-stack homepage section.
- `src/widgets/blog/` - blog UI pieces such as post cards, table of contents, and share buttons.
- `src/features/` - interactive feature units such as contact and language switching.
- `src/features/analytics/PageViewTracker.tsx` - client-side first-party page-view tracker mounted in the locale layout.
- `src/features/admin/analytics/data.ts` - admin dashboard aggregations for page views, leads, and top paths.
- `src/features/language-switcher/LocaleSlugsContext.tsx` - per-locale slug context used by detail pages for smart language switching.
- `src/shared/` - shared UI, config, helpers.
- `src/shared/ui/ScrollProgress.tsx` - client-side gradient scroll progress bar mounted inside the sticky navbar.
- `src/shared/ui/BrandText.tsx` - shared `BrandWord` / `BrandText` helpers for rendering visible `SaaleWeb` text with the same brand-gradient `Web` styling as the public logo.
- `src/shared/ui/BrandLogo.tsx` - shared SVG monogram logo component with icon/horizontal variants, light/dark/mono tones, and optional one-shot intro animation.
- `src/shared/ui/CustomCursor.tsx` - public desktop-only custom gradient cursor; mounted only in localized public layout.
- `src/shared/ui/Magnetic.tsx` - desktop-only reduced-motion-aware magnetic wrapper used by primary buttons/CTA.
- `src/shared/ui/CountUp.tsx` - client-side numeric stat counter used in the founder section.
- `src/shared/config/site.ts` - site identity, contact data, nav keys.
- `src/shared/seo/metadata.ts` - admin-managed `SEOPage` overrides and Open Graph/Twitter metadata builder.
- `src/shared/seo/og.ts` - absolute dynamic OG image URL helper for `/api/og`.
- `src/entities/blog/api.ts` - DB-backed blog queries.
- `src/shared/lib/markdown.ts` - Markdown TOC extraction and reading-time helper.
- `src/app/[locale]/blog/` - localized blog listing and article pages.
- `src/app/[locale]/leistungen/page.tsx` - localized service index page from DB content.
- `src/app/[locale]/branchen/page.tsx` - localized industry index page from DB content.
- `src/app/[locale]/projekte/` - localized project/case index and detail pages from DB content.
- `src/app/[locale]/preise/page.tsx` - localized pricing page from DB-backed tariff plans.
- `src/app/admin/` - non-localized protected admin/CMS area.
- `src/features/auth/` - env-based admin authentication, JWT session cookie, login/logout actions.
- `src/features/admin/` - admin server actions for services, industries, pricing plans, blog posts, and leads.
- `src/features/admin/crud.ts` - shared admin form helpers; keep translation rows typed with Prisma `Locale`.
- `src/features/admin/projects/media.ts` - server actions for project media create/update/delete and homepage/admin revalidation.
- `src/features/admin/upload/storage.ts` - admin image storage abstraction for Vercel Blob and local `public/uploads` fallback.
- `src/app/admin/api/upload/route.ts` - protected image upload route; converts uploads to WebP.
- `src/app/admin/(protected)/leads/export/route.ts` - protected CSV export for leads; returns UTF-8 BOM CSV with `;` delimiter for Excel-friendly opening.
- `src/app/api/og/route.tsx` - dynamic Open Graph image endpoint using `next/og`.
- `src/app/api/track/route.ts` - page-view ingestion endpoint for `PageView` analytics.
- `src/app/blog/rss.xml/route.ts` - RSS 2.0 feed for blog posts; default German, with `?lang=en` and `?lang=ru`.
- `src/widgets/admin/` - admin UI forms, sidebar, page headers, and controls.
- `src/widgets/admin/GenericForm.tsx` - reusable config-driven admin create/edit form for multilingual records.
- `src/widgets/admin/ImageUpload.tsx` - admin image upload field with preview and editable URL.
- `src/features/notifications/mailer.ts` - optional Resend HTTP email notification helper for new contact leads.
- `src/lib/prisma.ts` - Prisma singleton with `@prisma/adapter-pg`.
- `prisma/schema.prisma` - Prisma 7 schema.
- `prisma.config.ts` - Prisma 7 runtime config.
- `src/generated/prisma/` - generated Prisma client; git-ignored and created by `postinstall` / `npm run db:generate`.
- `public/flags/` - static flag assets.
- `public/images/` - static image assets.
- `public/brand/` - static SVG brand assets: main logo, icon-only mark, horizontal logo, favicon, app icon, social avatar, dark version, and monochrome version.
- `public/video/` - static video assets.
- `public/uploads/` - local/runtime upload staging; contents are ignored by git except the folder `.gitignore`.

## Commands

- Install dependencies: `npm install`
- `npm install` also runs `prisma generate` through `postinstall`.
- Start dev server: `npm run dev`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Production build: `npm run build`
- Generate Prisma client: `npm run db:generate`
- Push schema to database: `npm run db:push`
- Create migration: `npm run db:migrate`
- Seed database: `npm run db:seed`
- Sync original homepage message content into editable DB rows: `npm run db:sync-home`
- Sync original pricing message content into editable DB rows: `npm run db:sync-pricing`
- Open Prisma Studio: `npm run db:studio`
- Generate admin password hash: `node scripts/hash-password.mjs "your-password"`

## Environment

- Copy `.env.example` to `.env` before running Prisma commands.
- `.env*` files are ignored by git; `.env.example` is intentionally kept as the committed template.
- Local `.env` is for developer-specific values only. Do not copy real secrets into committed files.
- Local `.env` currently reserves sections for database, auth/admin CMS, email notifications, analytics/SEO, captcha, object storage, AI APIs, and webhooks.
- Admin auth uses `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD_HASH`. Do not store plaintext admin passwords in env.
- `AUTH_SECRET` signs admin JWT cookies. It must be a random 32+ character secret, not the admin password and not a bcrypt hash.
- Next.js expands `$` references while loading `.env`; bcrypt hashes in `ADMIN_PASSWORD_HASH` must escape every dollar sign as `\$`, or login will fail because the hash is corrupted at runtime.
- Required: `DATABASE_URL`, for example `postgresql://postgres:postgres@localhost:5432/saaleweb?schema=public`.
- Public site URL: `NEXT_PUBLIC_SITE_URL`, defaulting in code to `https://saaleweb.de`.
- Optional production upload storage: `BLOB_READ_WRITE_TOKEN` for Vercel Blob. Without it, admin uploads are stored locally under `public/uploads` and served as `/uploads/...`.
- Optional lead email notifications: `RESEND_API_KEY`, `LEAD_NOTIFY_FROM`, and `LEAD_NOTIFY_TO`. If `LEAD_NOTIFY_TO` is empty, `ADMIN_EMAIL` is used. Missing values silently disable notification sending.
- Optional analytics salt: `ANALYTICS_SALT` for stable daily unique-visitor hashes. If it is empty, `AUTH_SECRET` is used as fallback.
- `npm install` runs Prisma generation through `postinstall`, so `DATABASE_URL` must be available before install in local and deployment environments.

## Stack Notes

- Next.js 16 uses `src/proxy.ts` instead of `middleware.ts`.
- next-intl 4 `NextIntlClientProvider` is used without explicit props because messages are inherited from `src/i18n/request.ts`.
- `getRequestConfig` must return `locale`.
- Prisma 7 uses the Rust-free `prisma-client` generator with required `output = "../src/generated/prisma"`.
- The generated Prisma client is not committed. Vercel and other clean environments rely on `"postinstall": "prisma generate"` before `next build`.
- Prisma 7 requires a driver adapter. This project uses `@prisma/adapter-pg`.
- Zod 4 supports top-level validators such as `z.email()`.
- Blog Markdown rendering uses `react-markdown`, `remark-gfm`, `rehype-slug`, and `github-slugger`.
- Admin authentication uses `jose`, `bcryptjs`, and `server-only`; bcrypt only runs in server actions, not middleware.
- Generate admin password hashes with `node scripts/hash-password.mjs "your-password"` and copy the printed `Next.js .env value`.
- Admin multilingual CRUD actions should use `readTranslations` from `src/features/admin/crud.ts`; Prisma translation creates require `locale` to remain typed as generated `Locale`, not widened to plain `string`.
- Admin image uploads require `sharp`; `next.config.ts` keeps `sharp` in `serverExternalPackages` because it ships native binaries.
- Analytics bot filtering uses the `isbot` package inside `/api/track`; update the package periodically if crawler detection quality matters.
- Prisma 7 `prisma db execute` reads the datasource from `prisma.config.ts`; do not pass the old `--schema` flag.
- Use `-LiteralPath` in PowerShell for paths containing square brackets, for example `src/app/[locale]/page.tsx`.

## UI And Content Rules

- Keep page sections in `src/widgets/` and reusable primitives in `src/shared/ui/`.
- Keep localized copy in all three message files when user-facing text changes.
- Use existing design tokens from `tailwind.config.ts`: brand pink/purple, `dark`, `ink`, `muted`, `surface`, `line`.
- Shared UI includes `Button`, `Container`, `SectionHeader`, and `Reveal`; reuse them before adding new primitives.
- The public brand system uses `BrandLogo` for logo marks and `BrandText` / `BrandWord` for inline visible text. The logo mark is a minimal flowing `S` monogram, not a generic web-agency icon.
- For visible UI text that contains `SaaleWeb`, render it through `BrandText` / `BrandWord` so the brand mark stays visually consistent. Metadata, JSON-LD, and plain text SEO fields should remain unstyled strings.
- The public motion system is CSS-first and must respect `prefers-reduced-motion`. Current motion primitives include `btn-shine`, `card-border-glow`, `hero-gradient-field`, `marquee`, `glow-card`, directional `Reveal`, navbar scroll shadow/progress, magnetic buttons, founder `CountUp`, custom desktop cursor, and dashboard pointer tilt guarded by pointer/reduced-motion checks.
- Keep `CustomCursor` mounted only in `src/app/[locale]/layout.tsx` so admin pages keep the native cursor. Do not mount it in `src/app/admin/layout.tsx`.
- Code-native animated scenes live in widgets and use existing CSS keyframes in `globals.css`. When applying future scene/motion packages, merge `globals.css` manually so `hero-gradient-field`, `gradient-field-drift`, and cursor styles are not reverted to older package versions.
- The homepage includes `LocalSeo` immediately after `Industries`; its text lives in the `LocalSeo` namespace in all three message files. The former technical `Comparison` block is replaced on the homepage by `WhySaaleWebSection`, with copy in the `WhySaaleWeb` namespace.
- The homepage `GrowthWindow` section sits between `Industries` and `LocalSeo` to bridge industry specialization into regional visibility with a premium visual pause. Keep large text outside the image so it does not hide the illustration. The media window uses a small client component with WebM video, WebP poster fallback, viewport-triggered play/pause, hover lift on desktop, and `prefers-reduced-motion` protection.
- In Tailwind class names, use only configured opacity steps such as `/10`, `/20`, `/75`, `/80`, `/85`, or bracket syntax like `/[0.76]`. Invalid values such as `text-white/76` are silently omitted and can break contrast/readability.
- German public URLs are unprefixed because `localePrefix` is `as-needed`; use `next-intl` `Link`/`getPathname` for public links instead of hardcoding `/de/...`.
- Contact form validation lives in `src/features/contact/schema.ts`; server action lives in `src/features/contact/actions.ts`.
- Contact form stores `Lead` rows with source `homepage_contact` and has a honeypot field named `website`.
- Contact form optionally sends a Resend email notification after storing a lead. `sendLeadNotification()` must never throw or block a successful form submission if email delivery fails.
- Blog content is DB-backed through `BlogPost`, `BlogCategory`, `Author`, and translation tables. Article body content is Markdown stored in `BlogPostTranslation.content`.
- Homepage testimonials are DB-backed through `Testimonial` / `TestimonialTranslation`; admin testimonial create/update/delete/toggle actions must revalidate `/`, `/de`, `/en`, and `/ru`.
- Homepage services, industries, case studies/projects, FAQ, and testimonials are DB-backed with message fallbacks. For services/industries/cases/FAQ, partial DB datasets must not hide the fuller message fallback; use DB rows only when they are at least as complete as the fallback set. Admin changes for those entities should call `revalidateHome()` from `src/features/admin/crud.ts`.
- Services and industries have optional `coverImage` fields. Admin forms use `ImageUpload`; public homepage/index/detail views show the cover when present and fall back to the icon/emoji when absent.
- Blog RSS is available at `/blog/rss.xml`, `/blog/rss.xml?lang=en`, and `/blog/rss.xml?lang=ru`; localized blog index metadata should expose the matching RSS alternate link.
- Page-view analytics are privacy-light first-party tracking only: store path, locale, referrer, timestamp, and a daily salted `visitorHash`, with no cookies and no raw IP address. Keep `/admin` excluded. Existing historical `PageView` rows without `visitorHash` count as views but do not contribute to unique-visitor metrics.
- `npm run db:sync-home` copies the original homepage message content into editable DB records for services, industries, projects/cases, project categories, and FAQ. It is intentional overwrite/restore tooling; do not run it after manual admin edits unless you want to reset those sections back to message content.
- SEO overrides are managed at `/admin/seo` through `SEOPage` / `SEOPageTranslation`. Store canonical internal paths there (`/`, `/leistungen`, `/branchen`, `/projekte`, `/blog`), not localized public aliases such as `/services` or `/ru/uslugi`.
- Detail-page SEO overrides also use German canonical internal paths, for example `/leistungen/website-entwicklung`, `/branchen/hotels`, `/projekte/online-buchungen-verdreifacht`, and `/blog/lokales-seo-halle`; one `SEOPage` entry covers all locales through per-locale translations.
- The dynamic OG endpoint `/api/og` requires at least one bundled font for `ImageResponse`; keep `src/app/api/og/Geist-Bold.ttf` in place as the local fallback if Google font loading fails.
- Project media uses `Media` rows. `Media.order` controls ordering; the lowest-order image is treated as the project cover on the homepage and the remaining rows are gallery-ready.
- Public project detail pages use DB `ProjectTranslation` challenge/solution/results, `Project.technologies`, `Project.resultValue`, `Project.year`, and `Media` rows. Unpublished projects must not be reachable by direct slug.
- Detail pages with translated slugs should wrap content in `LocaleSlugsProvider`; `LanguageSwitcher` uses that map to switch to the target locale's real slug instead of reusing the current slug.
- Pricing plans are DB-backed through `PricingPlan` / `PricingPlanTranslation`; features are stored as `String[]` and edited one item per line in `/admin/pricing`.
- `npm run db:sync-pricing` copies the original `messages/*.json` pricing packages into editable DB records. It updates plans by German name or order, so do not run it after manual admin edits unless you intentionally want to reset the public pricing content back to message values.
- Admin pages are outside localized routing at `/admin`, are `noindex`, and are protected by both `src/proxy.ts` and the admin protected layout. Current admin sections cover leads, services, industries, pricing, projects/cases, blog posts, blog categories, authors, testimonials, SEO, and FAQ.
- Leads can be exported from `/admin/leads/export`; keep this route protected with both middleware and a server-side session check.
- Project categories are managed separately at `/admin/project-categories` and can be selected in project/case forms.
- `prisma/seed.ts` should remain repeatable; demo service/testimonial/FAQ/blog records must not fail on existing unique slugs.
- Keep seed content as real UTF-8 text. If RU/DE content renders as mojibake, check `prisma/seed.ts` first before blaming PostgreSQL encoding.
- Public static assets should be placed in the structured `public/flags`, `public/images`, and `public/video` folders.
- Do not commit generated or user-uploaded files from `public/uploads`. For production uploads on Vercel, use object storage because the deployment filesystem is not persistent.
- After applying package files from `public/uploads`, delete the consumed source package files from `public/uploads` and keep only files still awaiting processing plus the folder `.gitignore`. Do not delete runtime image files generated there by the local admin upload fallback unless explicitly cleaning local media.

## Verification Expectations

- For code changes, run the smallest useful check first.
- Prefer at least `npm run typecheck` and `npm run lint` for TypeScript/UI changes.
- Run `npm run build` when routing, i18n, metadata, Prisma generation, or Next.js config changes.
- If Prisma schema changes, run `npm run db:generate` and the appropriate database command when `.env` is available.

## Local Workspace Notes

- On 2026-06-10, this working directory contains a `.git` directory. An earlier 2026-06-09 session did not see one, so still check git availability if the workspace changes.
- README output in PowerShell may show mojibake for Cyrillic/dashes depending on console encoding; prefer editor view or UTF-8-aware output if exact text matters.
- Avoid writing Cyrillic text through PowerShell here-strings or console pipelines; use `apply_patch`, editor-save UTF-8, or ASCII-only Unicode escapes so `messages/*.json` does not get `?` placeholders.
- On 2026-06-09, Node.js was installed at `C:\Program Files\nodejs`, but the active PowerShell PATH did not include it. If `node` or `npm` are not recognized, run commands with a temporary PATH prefix: `$env:Path = 'C:\Program Files\nodejs;C:\Windows\System32;C:\Windows;' + $env:Path`.
- When using a hosted PostgreSQL URL with SSL, `pg` may warn that `sslmode=require` semantics will change in a future major version. Use `sslmode=verify-full` in `DATABASE_URL` if the current strict verification behavior should be preserved.
- `.editorconfig` enforces `charset = utf-8` without BOM for project files.

## Project Memory

- 2026-06-09: Created this file as mandatory project memory for agents. Initial project read confirmed Next.js 16, React 19.2, next-intl 4, Prisma 7, PostgreSQL, Zod 4, Tailwind CSS 3.4, FSD layout, locales `de/en/ru`, and homepage copy sourced from `messages/*.json`.
- 2026-06-09: Updated `.gitignore` to ignore all `.env*` files while explicitly allowing `.env.example`, plus common Next.js/Node outputs, logs, Vercel state, coverage, TypeScript build info, and generated Prisma client output.
- 2026-06-09: Created local `.env` with development defaults for `DATABASE_URL` and `NEXT_PUBLIC_SITE_URL`, plus empty placeholders for future auth/admin, email, analytics, captcha, storage, AI, and webhook secrets. The file is ignored by git.
- 2026-06-09: First project run completed: installed npm dependencies, generated Prisma Client, pushed Prisma schema to the configured PostgreSQL database, ran seed successfully, started Next dev server on `http://localhost:3000`, verified `/`, `/en`, and `/ru` return `200 OK`, and confirmed `npm run typecheck` plus `npm run lint` pass.
- 2026-06-09: Fixed Vercel build failure where `@/generated/prisma/client` was missing after clone. Added `"postinstall": "prisma generate"` so clean installs generate `src/generated/prisma` before `next build`; deployment environments must define `DATABASE_URL`.
- 2026-06-10: Created public asset folders `public/flags`, `public/images`, `public/uploads`, and `public/video`. Added `.gitkeep` markers for static asset folders and an ignore rule inside `public/uploads` so uploaded/generated files are not committed by default.
- 2026-06-10: Applied SEO update package from `public/uploads/saaleweb-seo-update.zip`: added JSON-LD helpers, breadcrumbs, CTA banner, localized service/industry/city pages, `sitemap.ts`, `robots.ts`, `public/llms.txt`, and extended message namespaces. `public/uploads` remains a staging area; source zip/instructions are ignored. Verified JSON parsing, `npm run typecheck`, `npm run lint`, and `npm run build`.
- 2026-06-10: Added workflow rule to delete consumed files from `public/uploads` after processing. Removed the already applied `saaleweb-seo-APPLY.md` and `saaleweb-seo-update.zip`; only `public/uploads/.gitignore` remains.
- 2026-06-10: Applied blog update package from `public/uploads/saaleweb-blog-update.zip`: added DB-backed localized blog listing/article routes, Markdown rendering with TOC/share/related posts, blog JSON-LD, updated founder name to `Konstantin Mykhailov`, added markdown dependencies, and seeded demo blog content. Adjusted `prisma/seed.ts` to be repeatable for existing demo slugs. Verified JSON parsing through `npm install`/Prisma generate, `npm run db:push`, `npm run db:seed`, `npm run typecheck`, `npm run lint`, and `npm run build`. Removed the consumed blog upload files afterward.
- 2026-06-10: Fixed mojibake source in `prisma/seed.ts` by replacing corrupted RU/DE seed strings with valid UTF-8 text and keeping the seed repeatable. `npm run typecheck` and `npm run lint` pass. Current `.env` was observed pointing to database `neondb`; switch `DATABASE_URL` to `saaleweb` before seeding the newly recreated database.
- 2026-06-10: Confirmed `.env` points to Neon `neondb`, reran `npm run db:seed` against it, and verified RU blog/service rows now contain valid Cyrillic in the database. Scanned project files for UTF-8 BOM outside generated/dependency folders and found none; added `.editorconfig` to keep UTF-8 without BOM going forward. Port `3000` was not listening during HTTP verification.
- 2026-06-10: Applied `saaleweb-i18n-routes-db-update.zip`: added `next-intl` localized `pathnames`, locale-aware navbar/CTA/breadcrumb/post-card/language-switcher links, DB-backed localized sitemap helpers, and blog category route `src/app/[locale]/blog/kategorie/[slug]/page.tsx`. Added `Blog.categoryEyebrow` to all message files, removed `.next`, and verified JSON parsing, `npm run typecheck`, `npm run lint`, `npm run build`, plus sitemap URL presence for `/en/locations/halle`, `/ru/lokacii/halle`, `/ru/uslugi/razrabotka-sajtov`, and `/ru/blog/kategoriya/seo`. No DB schema or seed changes were required. Consumed upload files were deleted.
- 2026-06-10: Applied `saaleweb-smart-lang-switch-update.zip`: added `LocaleSlugsProvider` and smart `LanguageSwitcher` behavior so service, industry, blog post, and blog category detail pages switch to the target locale's translated slug. No dependencies, messages, Prisma schema, or seed changes were required. Removed `.next`; verified `npm run typecheck`, `npm run lint`, `npm run build`, provider usage, and production `200` responses for localized service/blog/category/location URLs. Temporary `next start` server was stopped and consumed upload files were deleted.
- 2026-06-10: Applied `saaleweb-admin-cms-update.zip`: added protected `/admin` CMS for leads, services, industries, and blog posts; added env-based single-admin auth with JWT httpOnly cookie; added `jose`, `bcryptjs`, `server-only`, and `@types/bcryptjs`; added `scripts/hash-password.mjs`; updated `.env.example` and local `.env` to use `ADMIN_PASSWORD_HASH`. Prisma schema/seed did not change. Verified `npm run typecheck`, `npm run lint`, `npm run build`, password hash script, `/admin/login` 200, `/admin` 307 redirect to login, and existing localized public routes. Temporary `next start` server was stopped and consumed upload files were deleted.
- 2026-06-10: Fixed local admin login env formatting: Next.js was expanding `$` inside the bcrypt `ADMIN_PASSWORD_HASH`, so runtime saw a corrupted hash. Local `.env` now uses escaped bcrypt dollars and a separate random `AUTH_SECRET`; `scripts/hash-password.mjs` prints a Next.js-ready escaped env value.
- 2026-06-10: Applied `saaleweb-index-admin-update.zip`: added DB-backed ISR index pages for services and industries, updated localized nav links to route pages, and expanded admin CRUD with projects/cases, blog categories, authors, testimonials, and FAQ using `GenericForm`. Fixed the package's translation helper typing so Prisma `Locale` is preserved. Verified `npm run typecheck`, `npm run lint`, `npm run build`, and production `200` responses for `/leistungen`, `/en/services`, `/ru/uslugi`, `/branchen`, `/en/industries`, `/ru/otrasli`; protected new admin routes return `307` without a session.
- 2026-06-10: Fixed homepage testimonial freshness: admin updates were saved to DB, but `src/widgets/testimonials/Testimonials.tsx` still rendered static `messages/*.json` items. The widget now reads published DB testimonials for the current locale with message fallback, homepage has `revalidate = 300`, and testimonial admin actions revalidate localized homepages. Verified DB contains `Elena D.`, production HTML visibly renders `Elena D.`, and `npm run typecheck`, `npm run lint`, `npm run build` pass.
- 2026-06-11: Applied `saaleweb-projcat-upload-update.zip`: added `/admin/project-categories` CRUD for `ProjectCategory`, admin image upload route `/admin/api/upload`, `ImageUpload`, WebP conversion via `sharp`, Vercel Blob storage via `@vercel/blob`, and local fallback to `public/uploads`. Added `BLOB_READ_WRITE_TOKEN` to `.env.example`; pinned `sharp` to `0.34.5` because `0.35.0` did not expose types correctly with TypeScript `moduleResolution: bundler`. Verified `npm run typecheck`, `npm run lint`, `npm run build`, and production `307` protection for project-category routes and upload endpoint without a session.
- 2026-06-11: Applied `saaleweb-media-home-db-update.zip`: added project media management through `Media` rows, added `Media.order` and `onDelete: Cascade` to Prisma schema, updated upload route to return image dimensions, moved homepage Services/Industries/CaseStudies/FAQ to DB-first rendering with `messages` fallback, and added `revalidateHome()` usage for services, industries, projects, FAQ, and project media. Ran `npm run db:push`, `npm run db:generate`, `npm run typecheck`, `npm run lint`, `npm run build`, and verified production `200` responses for `/` and `/ru` plus protected `307` responses for `/admin/projects` and `/admin/api/upload` without a session.
- 2026-06-11: Restored the complete pre-DB homepage content for Services/Industries/CaseStudies/FAQ when the DB contains only a partial dataset. Those widgets now use DB rows only when `dbItems.length >= fallback.length`; otherwise they render the original `messages` data. Verified `npm run typecheck`, `npm run lint`, `npm run build`, and production HTML contains old service cards such as `SEO Optimierung`, `KI Integration`, and `Hosting`.
- 2026-06-11: Added `scripts/sync-homepage-content.ts` and `npm run db:sync-home`, then synced the original homepage message content into the current DB so it is editable from admin. The sync produced 9 published services, 8 industries, 6 FAQ rows, and 3 published projects/cases with project categories. Verified `npm run typecheck`, `npm run lint`, `npm run build`, and production HTML contains synced items such as `SEO Optimierung`, `KI Integration`, `Hosting`, and `Online-Buchungen verdreifacht`.
- 2026-06-11: Applied `saaleweb-projekte-pages-update.zip`: added localized public project/case index and detail pages, `Projects` message namespace, `caseStudySchema`, sitemap entries for project index/detail URLs, and homepage case-card links to project detail pages while preserving the full-data fallback rule. Detail pages use `LocaleSlugsProvider`, `CreativeWork` JSON-LD, cover/gallery media, technologies, result, year, and 404 unpublished projects. Verified JSON parsing, `npm run typecheck`, `npm run lint`, `npm run build`, runtime `200` responses for `/projekte`, `/en/projects`, `/ru/proekty` and localized detail URLs, sitemap project URL presence, and homepage links. Consumed upload files were deleted.
- 2026-06-11: Applied `saaleweb-seo-og-update.zip`: added `/admin/seo` CRUD for `SEOPage`, `buildMetadata()` / `getSeoOverride()`, generated OG helper `/api/og`, Open Graph/Twitter metadata for the homepage layout and index pages `/leistungen`, `/branchen`, `/projekte`, and image-field support inside translated admin form fields. Fixed the package's OG route by bundling `src/app/api/og/Geist-Bold.ttf` so `ImageResponse` always has a font when Google font loading fails. Verified `npm run typecheck`, `npm run lint`, `npm run build`, runtime OG/Twitter tags on `/`, `/leistungen`, `/branchen`, `/projekte`, `/api/og` returns `image/png`, and `/admin/seo` redirects to login without a session. Consumed upload files were deleted.
- 2026-06-11: Applied `saaleweb-detail-seo-nav-update.zip`: extended `buildMetadata()` with `image` and `ogType`, moved service/industry/project/blog detail page metadata to `buildMetadata()` with German canonical SEOPage paths, cover-image OG fallback for projects/blog posts, and article OG type for blog posts. Replaced the top nav `cases` anchor with a localized `projects` link to `/projekte`, added a footer Projects link, and added an "All projects" button under homepage Cases while preserving the complete-DB fallback rule. Added `Nav.projects` and `Projects.all` to all message files. Verified JSON parsing, `npm run typecheck`, `npm run lint`, `npm run build`, runtime OG/Twitter tags on representative detail pages, localized project nav links for `/en` and `/ru`, and homepage `/projekte` links. Consumed upload files were deleted.
- 2026-06-11: Applied `saaleweb-analytics-covers-rss-update.zip`: added privacy-light `PageView` analytics through `/api/track` and `PageViewTracker`, upgraded `/admin` dashboard with 7/30/90 day views/leads/top pages, added optional `coverImage` fields for services and industries with admin upload and public homepage/index/detail rendering, and added localized blog RSS at `/blog/rss.xml` plus `?lang=en` / `?lang=ru`. Ran `npm run db:push`, `npm run db:generate`, `npm run typecheck`, `npm run lint`, `npm run build`, verified RSS responses, `/api/track`, and `/admin` redirect without a session. Consumed upload files were deleted.
- 2026-06-11: Applied `saaleweb-pricing-page-update.zip`: added DB-backed `PricingPlan` / `PricingPlanTranslation`, public localized pricing page `/preise` with public aliases `/en/pricing` and `/ru/tseny`, shared `PricingPlans` rendering, DB-backed homepage pricing fallback to `messages`, `/admin/pricing` CRUD, navbar/footer links to the pricing page, and sitemap pricing entries. Ran `npm run db:push`, `npm run db:generate`, `npm run typecheck`, `npm run lint`, `npm run build`, verified production `200` responses for `/preise`, `/en/pricing`, `/ru/tseny`, sitemap localized pricing URLs, and protected `/admin/pricing` redirect without a session. Consumed upload files were deleted.
- 2026-06-11: Added `scripts/sync-pricing-content.ts` and `npm run db:sync-pricing`, then synced the original `messages` pricing packages into the current DB so they are editable from `/admin/pricing`. The sync produced 3 published plans: Starter, Business, and Premium, each with DE/EN/RU translations; Business is marked featured. Verified DB rows, `npm run typecheck`, and `npm run lint`.
- 2026-06-12: Applied `saaleweb-bot-unique-analytics-update.zip`: added `isbot`, bot filtering in `/api/track`, client-side `navigator.webdriver` skip, daily salted `PageView.visitorHash` for cookieless unique-visitor metrics, `ANALYTICS_SALT` in `.env.example`, and unique visitor total/series in the admin dashboard. Ran `npm run db:push`, `npm run db:generate`, `npm run typecheck`, `npm run lint`, `npm run build`, and runtime-verified that browser UA writes a hashed page view while Googlebot UA is ignored. Consumed upload files were deleted.
- 2026-06-12: Applied `saaleweb-leads-csv-email-update.zip`: added protected `/admin/leads/export` CSV download with UTF-8 BOM and `;` delimiter, added optional Resend lead notifications through `src/features/notifications/mailer.ts`, wired notifications after contact-form lead creation, and documented `RESEND_API_KEY`, `LEAD_NOTIFY_FROM`, and `LEAD_NOTIFY_TO` in `.env.example`. Verified `npm run typecheck`, `npm run lint`, `npm run build`, unauthenticated export redirect, and authenticated CSV response headers/content. Consumed upload files were deleted.
- 2026-06-12: Applied `saaleweb-motion-design-update.zip`: added CSS-first motion design with `ScrollProgress`, animated navbar/hero/dashboard/trust marquee/services/pricing cards, directional `Reveal`, and button/card microinteractions. Preserved complete-content DB fallback rules for Services and FAQ (`dbItems.length >= fallback.length`) instead of the package's partial-DB condition, and used a full-surface hero gradient field rather than discrete decorative gradient blobs. Verified `npm run typecheck`, `npm run lint`, `npm run build`, runtime `200` responses for `/`, `/ru`, and `/preise`, and motion class presence in rendered HTML.
- 2026-06-12: Applied `saaleweb-cursor-magnetic-update.zip`: added public desktop-only `CustomCursor`, `Magnetic` button wrapper, navbar magnetic CTA, and founder stat `CountUp`. Integrated layout manually to preserve analytics/SEO setup, and merged only cursor CSS so the existing `hero-gradient-field` motion was not reverted to old discrete aurora blobs. Verified `npm run typecheck`, `npm run lint`, `npm run build`, runtime `200` responses for `/`, `/ru`, and `/preise`, and rendered `cursor-layer` / `magnetic` markers. Consumed upload files were deleted.
- 2026-06-12: Applied `saaleweb-animated-scenes-update.zip`: added code-native animated `AiOrbit` and `CodeWindow` scenes, moved AI-ready benefits beside the orbit scene, added the code editor scene under the tech stack chips, and upgraded founder avatar with `glow-card` / `auto-shine` while preserving existing `CountUp`. Merged only scene keyframes/CSS so `hero-gradient-field`, `gradient-field-drift`, and custom cursor styles stayed intact. Verified `npm run typecheck`, `npm run lint`, `npm run build`, runtime `200` responses for `/`, `/ru`, and `/preise`, plus rendered scene markers. Consumed upload files were deleted.
- 2026-06-12: Applied `saaleweb-map-slider-mobile-update.zip`: added homepage `LocalSeo` animated regional map, `BeforeAfter` comparison slider, localized `LocalSeo` messages and `Comparison.before/after`, industry card wave/wiggle CSS, route travel CSS, and mobile spacing updates across homepage sections. Preserved DB completeness fallback rules (`dbItems.length >= fallback.length`) and existing `hero-gradient-field` / cursor / scene CSS while merging package changes manually. Verified messages JSON parsing, `npm run typecheck`, `npm run lint`, `npm run build`, runtime `200` responses for `/`, `/ru`, and `/preise`, plus rendered map/slider/motion markers. Consumed upload files were deleted.
- 2026-06-13: Fixed RU `?` placeholders introduced in the previous homepage motion package by restoring `messages/ru.json` values for `LocalSeo` and `Comparison.before/after` as real UTF-8 text. Added a workspace note to avoid PowerShell here-string/console-pipeline writes for Cyrillic message content.
- 2026-06-13: Updated `LocalSeo` from a Halle-to-Leipzig route visual to a Halle-centered SEO hub with animated reach lines to all shown regional cities. Updated DE/EN/RU `LocalSeo` copy so the section communicates map-wide regional visibility instead of only Halle/Leipzig.
- 2026-06-13: Updated the public SaaleWeb wordmark in navbar and footer so `Web` uses the brand gradient while `Saale` remains dark.
- 2026-06-15: Improved the `LocalSeo` map marker hierarchy: Halle (Saale) now renders as a prominent branded `SEO` hub badge with its own label, while all other cities remain secondary reach points.
- 2026-06-15: Added code-native SVG icons to `AiOrbit` labels for ChatGPT, Gemini, Perplexity, Claude, Google AI, and Copilot. Keep these icons inline unless a future brand-asset system is introduced.
- 2026-06-15: Replaced the drawn `BeforeAfter` comparison mockups with real WebP assets: `public/images/comparison/old-fashioned.webp` for the old-fashioned side and `public/images/comparison/premium-modern.webp` for the premium modern side. Converted the uploaded PNG sources from `public/uploads` with `sharp` and deleted the consumed upload files.
- 2026-06-16: Converted `public/uploads/permanent-halle.png` to `public/images/cases/permanent-halle.webp`, assigned it as the first `Media` cover for the `online-buchungen-verdreifacht` project, and made homepage case-study covers render responsively while keeping external admin-upload URLs supported. Deleted the consumed upload PNG afterward.
- 2026-06-16: Adjusted homepage and project-index case cards to use a 3:2 cover area with `object-contain`, so the `permanent-halle.webp` project mockup is shown fully instead of being cropped by fixed-height card headers.
- 2026-06-16: Converted `public/uploads/waldschlosschen.png` to `public/images/cases/waldschlosschen.webp` and assigned it as the first `Media` cover for the `direktbuchungen-ohne-portale` / `direct-bookings-without-portals` / `pryamye-broni-bez-agregatorov` project. Deleted the consumed upload PNG afterward.
- 2026-06-16: Converted `public/uploads/SorafalBau-mix.png` to `public/images/cases/sorgfaltbau-mix.webp` and assigned it as the first `Media` cover for the `qualifizierte-bauanfragen` / `qualified-construction-leads` / `kvalificirovannye-zayavki` project. Deleted the consumed upload PNG afterward.
- 2026-06-16: Replaced the technical homepage SaaleWeb-vs-WordPress comparison with `WhySaaleWebSection`, a conversion-focused business value block with 6 benefit cards, a Standard Website vs SaaleWeb System result comparison, CTA, and localized DE/EN/RU copy. Links use existing localized routes (`/projekte`, contact anchor, Halle location page, and AI integration service) rather than hardcoded `/de/...` paths.
- 2026-06-16: Added shared `BrandWord` / `BrandText` helpers and applied them to visible UI text where `SaaleWeb` appears, including the homepage value block, FAQ, contact, founder, CTA banner, city pages, footer, navbar, and admin login. Metadata/JSON-LD remain plain strings. Also fixed mojibake copy/arrow artifacts in `Footer` and `CtaBanner` while touching those files.
- 2026-06-16: Upgraded the SaaleWeb logo from a simple `S` favicon-style square to a premium SVG monogram system. Added `BrandLogo` with icon/horizontal variants, light/dark/mono tones, CSS-only one-shot intro animation, hover glow, and larger header presence. Added static SVG assets under `public/brand/` plus `public/favicon.svg`, `public/icon.svg`, and `public/apple-icon.svg`; locale metadata now exposes these icons.
- 2026-06-16: Converted `public/uploads/Premium_SaaS_technology_illustration_futuristic_2.png` to `public/images/sections/premium-saas-technology.webp` (~75 KB) and added `GrowthWindow` after `Industries` on the homepage. The section uses `next/image`, localized DE/EN/RU HTML copy, and a desktop CSS sticky "window view" effect without extra client-side scroll logic. Deleted the consumed upload PNG.
- 2026-06-16: Fixed `GrowthWindow` text readability by replacing invalid Tailwind opacity classes (`/12`, `/14`, `/35`, `/74`, `/76`) with valid opacity steps, strengthening the image overlay, and adding a subtle dark glass panel behind the headline/lead copy. Verified `npm run typecheck`, `npm run lint`, and `npm run build`.
- 2026-06-16: Reworked `GrowthWindow` so the headline/lead render above the visual and the image becomes the main asset. Added desktop CSS `bg-fixed` parallax inside the rounded window, kept mobile on `next/image`, and reduced overlays to compact browser/status/badge elements plus a caption below the image. Verified `npm run typecheck`, `npm run lint`, and `npm run build`.
- 2026-06-16: Converted `public/uploads/Premium_SaaS_technology_illustration_futuristic_3.mp4` to `public/images/sections/premium-saas-technology.webm` (~256 KB, VP9, no audio). Added `GrowthMediaWindow` so the homepage visual animates when it enters the viewport on mobile/desktop and reacts to hover on desktop, with `premium-saas-technology.webp` as poster fallback. Verified `npm run typecheck`, `npm run lint`, `npm run build`, runtime `200` responses for `/`, `/ru`, `.webm`, and `.webp`; deleted the consumed upload MP4.
- 2026-06-16: Optimized `LocalSeo` for mobile by adding a separate taller mobile map scene (`420px` / `500px` on `sm`) with phone-specific city coordinates and label directions. Desktop keeps the original 10:7 map scene. Verified no invalid Tailwind opacity classes in the touched widgets, `npm run typecheck`, `npm run lint`, `npm run build`, and runtime `200` responses for `/` and `/ru`.
- 2026-06-16: Converted `public/uploads/Artificial_intelligence_search_ecosystem_0.png` to `public/images/sections/ai-search-ecosystem.webp` (~35 KB) and added `AiSearchWindow` inside the `AiReady` homepage section as a CSS-only scroll-through background window. The window uses desktop `bg-fixed`, mobile static cover behavior, subtle hover glow, localized DE/EN/RU copy under `AiReady.window`, and no extra client JS. Verified JSON parsing, no invalid Tailwind opacity classes in touched widgets, `npm run typecheck`, `npm run lint`, `npm run build`, runtime `200` responses for `/`, `/ru`, and the WebP asset; deleted the consumed upload PNG.
- 2026-06-16: Refined `AiSearchWindow` for mobile readability: removed visible AI-name pills from the image, moved the caption below the window, increased mobile height, and added five custom brand-aligned icon-only AI nodes around a central SaaleWeb mark. Verified no invalid Tailwind opacity classes in the component, `npm run typecheck`, `npm run lint`, and `npm run build`.
- 2026-06-16: Upgraded `AiSearchWindow` AI nodes from muted generic glyphs to bright brand-aware icon-only marks for ChatGPT, Gemini, Claude, Perplexity, Google AI, and Copilot. Each node now uses recognizable brand color, glass tile styling, glow/shadow, hover lift, and `aria-label`/`title` while keeping visible text off the image. Verified no invalid Tailwind opacity classes in the component, `npm run typecheck`, `npm run lint`, `npm run build`, and runtime `200` responses for `/` and `/ru`.
