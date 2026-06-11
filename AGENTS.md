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
- Public URL segments are localized through `next-intl` `pathnames`: services use `/leistungen`, `/services`, `/uslugi`; industries use `/branchen`, `/industries`, `/otrasli`; locations use `/standorte`, `/locations`, `/lokacii`; blog categories use `/blog/kategorie`, `/blog/category`, `/blog/kategoriya`.
- Public service and industry index pages exist at `/leistungen` and `/branchen` with localized public URLs; cards link to DB-backed detail pages.
- Public project/case pages exist at `/projekte`, `/projects`, `/proekty` and detail pages at localized `/projekte/[slug]`, `/projects/[slug]`, `/proekty/[slug]`.
- Most homepage sections now prefer published DB rows and fall back to `messages/*.json` when DB data is unavailable, empty, or incomplete. DB-backed homepage sections include services, industries, case studies/projects, FAQ, and testimonials.
- Database is required for contact form persistence and future CMS/content features.
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
- `src/widgets/blog/` - blog UI pieces such as post cards, table of contents, and share buttons.
- `src/features/` - interactive feature units such as contact and language switching.
- `src/features/language-switcher/LocaleSlugsContext.tsx` - per-locale slug context used by detail pages for smart language switching.
- `src/shared/` - shared UI, config, helpers.
- `src/shared/config/site.ts` - site identity, contact data, nav keys.
- `src/entities/blog/api.ts` - DB-backed blog queries.
- `src/shared/lib/markdown.ts` - Markdown TOC extraction and reading-time helper.
- `src/app/[locale]/blog/` - localized blog listing and article pages.
- `src/app/[locale]/leistungen/page.tsx` - localized service index page from DB content.
- `src/app/[locale]/branchen/page.tsx` - localized industry index page from DB content.
- `src/app/[locale]/projekte/` - localized project/case index and detail pages from DB content.
- `src/app/admin/` - non-localized protected admin/CMS area.
- `src/features/auth/` - env-based admin authentication, JWT session cookie, login/logout actions.
- `src/features/admin/` - admin server actions for services, industries, blog posts, and leads.
- `src/features/admin/crud.ts` - shared admin form helpers; keep translation rows typed with Prisma `Locale`.
- `src/features/admin/projects/media.ts` - server actions for project media create/update/delete and homepage/admin revalidation.
- `src/features/admin/upload/storage.ts` - admin image storage abstraction for Vercel Blob and local `public/uploads` fallback.
- `src/app/admin/api/upload/route.ts` - protected image upload route; converts uploads to WebP.
- `src/widgets/admin/` - admin UI forms, sidebar, page headers, and controls.
- `src/widgets/admin/GenericForm.tsx` - reusable config-driven admin create/edit form for multilingual records.
- `src/widgets/admin/ImageUpload.tsx` - admin image upload field with preview and editable URL.
- `src/lib/prisma.ts` - Prisma singleton with `@prisma/adapter-pg`.
- `prisma/schema.prisma` - Prisma 7 schema.
- `prisma.config.ts` - Prisma 7 runtime config.
- `src/generated/prisma/` - generated Prisma client; git-ignored and created by `postinstall` / `npm run db:generate`.
- `public/flags/` - static flag assets.
- `public/images/` - static image assets.
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
- Use `-LiteralPath` in PowerShell for paths containing square brackets, for example `src/app/[locale]/page.tsx`.

## UI And Content Rules

- Keep page sections in `src/widgets/` and reusable primitives in `src/shared/ui/`.
- Keep localized copy in all three message files when user-facing text changes.
- Use existing design tokens from `tailwind.config.ts`: brand pink/purple, `dark`, `ink`, `muted`, `surface`, `line`.
- Shared UI includes `Button`, `Container`, `SectionHeader`, and `Reveal`; reuse them before adding new primitives.
- Contact form validation lives in `src/features/contact/schema.ts`; server action lives in `src/features/contact/actions.ts`.
- Contact form stores `Lead` rows with source `homepage_contact` and has a honeypot field named `website`.
- Blog content is DB-backed through `BlogPost`, `BlogCategory`, `Author`, and translation tables. Article body content is Markdown stored in `BlogPostTranslation.content`.
- Homepage testimonials are DB-backed through `Testimonial` / `TestimonialTranslation`; admin testimonial create/update/delete/toggle actions must revalidate `/`, `/de`, `/en`, and `/ru`.
- Homepage services, industries, case studies/projects, FAQ, and testimonials are DB-backed with message fallbacks. For services/industries/cases/FAQ, partial DB datasets must not hide the fuller message fallback; use DB rows only when they are at least as complete as the fallback set. Admin changes for those entities should call `revalidateHome()` from `src/features/admin/crud.ts`.
- `npm run db:sync-home` copies the original homepage message content into editable DB records for services, industries, projects/cases, project categories, and FAQ. It is intentional overwrite/restore tooling; do not run it after manual admin edits unless you want to reset those sections back to message content.
- Project media uses `Media` rows. `Media.order` controls ordering; the lowest-order image is treated as the project cover on the homepage and the remaining rows are gallery-ready.
- Public project detail pages use DB `ProjectTranslation` challenge/solution/results, `Project.technologies`, `Project.resultValue`, `Project.year`, and `Media` rows. Unpublished projects must not be reachable by direct slug.
- Detail pages with translated slugs should wrap content in `LocaleSlugsProvider`; `LanguageSwitcher` uses that map to switch to the target locale's real slug instead of reusing the current slug.
- Admin pages are outside localized routing at `/admin`, are `noindex`, and are protected by both `src/proxy.ts` and the admin protected layout. Current admin sections cover leads, services, industries, projects/cases, blog posts, blog categories, authors, testimonials, and FAQ.
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
