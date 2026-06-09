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
- `src/generated/prisma/` - generated Prisma client; git-ignored and created by `npm run db:generate`.

## Commands

- Install dependencies: `npm install`
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
- Required: `DATABASE_URL`, for example `postgresql://postgres:postgres@localhost:5432/saaleweb?schema=public`.
- Public site URL: `NEXT_PUBLIC_SITE_URL`, defaulting in code to `https://saaleweb.de`.
- `npm install` intentionally does not run Prisma generation. Generate the client manually after `.env` is configured.

## Stack Notes

- Next.js 16 uses `src/proxy.ts` instead of `middleware.ts`.
- next-intl 4 `NextIntlClientProvider` is used without explicit props because messages are inherited from `src/i18n/request.ts`.
- `getRequestConfig` must return `locale`.
- Prisma 7 uses the Rust-free `prisma-client` generator with required `output = "../src/generated/prisma"`.
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

## Verification Expectations

- For code changes, run the smallest useful check first.
- Prefer at least `npm run typecheck` and `npm run lint` for TypeScript/UI changes.
- Run `npm run build` when routing, i18n, metadata, Prisma generation, or Next.js config changes.
- If Prisma schema changes, run `npm run db:generate` and the appropriate database command when `.env` is available.

## Local Workspace Notes

- On 2026-06-09, this working directory did not contain a `.git` directory. Check git availability before relying on git commands.
- README output in PowerShell may show mojibake for Cyrillic/dashes depending on console encoding; prefer editor view or UTF-8-aware output if exact text matters.

## Project Memory

- 2026-06-09: Created this file as mandatory project memory for agents. Initial project read confirmed Next.js 16, React 19.2, next-intl 4, Prisma 7, PostgreSQL, Zod 4, Tailwind CSS 3.4, FSD layout, locales `de/en/ru`, and homepage copy sourced from `messages/*.json`.
