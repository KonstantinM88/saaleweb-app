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
- Main page content is currently rendered from `messages/*.json`, so the homepage can run without a database connection.
- Database is required for contact form persistence and future CMS/content features.

## Important Paths

- `src/app/[locale]/page.tsx` - homepage composition.
- `src/app/[locale]/layout.tsx` - locale validation, metadata, fonts, `NextIntlClientProvider`.
- `src/proxy.ts` - Next.js 16 middleware/proxy entry for next-intl.
- `src/i18n/` - locale routing, navigation, request config.
- `messages/de.json`, `messages/en.json`, `messages/ru.json` - localized UI copy.
- `src/widgets/` - page sections.
- `src/features/` - interactive feature units such as contact and language switching.
- `src/shared/` - shared UI, config, helpers.
- `src/shared/config/site.ts` - site identity, contact data, nav keys.
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
- Open Prisma Studio: `npm run db:studio`

## Environment

- Copy `.env.example` to `.env` before running Prisma commands.
- `.env*` files are ignored by git; `.env.example` is intentionally kept as the committed template.
- Local `.env` is for developer-specific values only. Do not copy real secrets into committed files.
- Local `.env` currently reserves sections for database, auth/admin CMS, email notifications, analytics/SEO, captcha, object storage, AI APIs, and webhooks.
- Required: `DATABASE_URL`, for example `postgresql://postgres:postgres@localhost:5432/saaleweb?schema=public`.
- Public site URL: `NEXT_PUBLIC_SITE_URL`, defaulting in code to `https://saaleweb.de`.
- `npm install` runs Prisma generation through `postinstall`, so `DATABASE_URL` must be available before install in local and deployment environments.

## Stack Notes

- Next.js 16 uses `src/proxy.ts` instead of `middleware.ts`.
- next-intl 4 `NextIntlClientProvider` is used without explicit props because messages are inherited from `src/i18n/request.ts`.
- `getRequestConfig` must return `locale`.
- Prisma 7 uses the Rust-free `prisma-client` generator with required `output = "../src/generated/prisma"`.
- The generated Prisma client is not committed. Vercel and other clean environments rely on `"postinstall": "prisma generate"` before `next build`.
- Prisma 7 requires a driver adapter. This project uses `@prisma/adapter-pg`.
- Zod 4 supports top-level validators such as `z.email()`.
- Use `-LiteralPath` in PowerShell for paths containing square brackets, for example `src/app/[locale]/page.tsx`.

## UI And Content Rules

- Keep page sections in `src/widgets/` and reusable primitives in `src/shared/ui/`.
- Keep localized copy in all three message files when user-facing text changes.
- Use existing design tokens from `tailwind.config.ts`: brand pink/purple, `dark`, `ink`, `muted`, `surface`, `line`.
- Shared UI includes `Button`, `Container`, `SectionHeader`, and `Reveal`; reuse them before adding new primitives.
- Contact form validation lives in `src/features/contact/schema.ts`; server action lives in `src/features/contact/actions.ts`.
- Contact form stores `Lead` rows with source `homepage_contact` and has a honeypot field named `website`.
- Public static assets should be placed in the structured `public/flags`, `public/images`, and `public/video` folders.
- Do not commit generated or user-uploaded files from `public/uploads`. For production uploads on Vercel, use object storage because the deployment filesystem is not persistent.
- After applying files from `public/uploads`, delete the consumed source files from `public/uploads` and keep only files still awaiting processing plus the folder `.gitignore`.

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

## Project Memory

- 2026-06-09: Created this file as mandatory project memory for agents. Initial project read confirmed Next.js 16, React 19.2, next-intl 4, Prisma 7, PostgreSQL, Zod 4, Tailwind CSS 3.4, FSD layout, locales `de/en/ru`, and homepage copy sourced from `messages/*.json`.
- 2026-06-09: Updated `.gitignore` to ignore all `.env*` files while explicitly allowing `.env.example`, plus common Next.js/Node outputs, logs, Vercel state, coverage, TypeScript build info, and generated Prisma client output.
- 2026-06-09: Created local `.env` with development defaults for `DATABASE_URL` and `NEXT_PUBLIC_SITE_URL`, plus empty placeholders for future auth/admin, email, analytics, captcha, storage, AI, and webhook secrets. The file is ignored by git.
- 2026-06-09: First project run completed: installed npm dependencies, generated Prisma Client, pushed Prisma schema to the configured PostgreSQL database, ran seed successfully, started Next dev server on `http://localhost:3000`, verified `/`, `/en`, and `/ru` return `200 OK`, and confirmed `npm run typecheck` plus `npm run lint` pass.
- 2026-06-09: Fixed Vercel build failure where `@/generated/prisma/client` was missing after clone. Added `"postinstall": "prisma generate"` so clean installs generate `src/generated/prisma` before `next build`; deployment environments must define `DATABASE_URL`.
- 2026-06-10: Created public asset folders `public/flags`, `public/images`, `public/uploads`, and `public/video`. Added `.gitkeep` markers for static asset folders and an ignore rule inside `public/uploads` so uploaded/generated files are not committed by default.
- 2026-06-10: Applied SEO update package from `public/uploads/saaleweb-seo-update.zip`: added JSON-LD helpers, breadcrumbs, CTA banner, localized service/industry/city pages, `sitemap.ts`, `robots.ts`, `public/llms.txt`, and extended message namespaces. `public/uploads` remains a staging area; source zip/instructions are ignored. Verified JSON parsing, `npm run typecheck`, `npm run lint`, and `npm run build`.
- 2026-06-10: Added workflow rule to delete consumed files from `public/uploads` after processing. Removed the already applied `saaleweb-seo-APPLY.md` and `saaleweb-seo-update.zip`; only `public/uploads/.gitignore` remains.
