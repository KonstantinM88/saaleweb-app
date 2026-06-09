# SaaleWeb — Next.js 16 + Prisma 7

Production-grade foundation for **SaaleWeb.de**: a multilingual (DE/EN/RU) marketing site
built on a fully current stack so you don't have to upgrade later.

## Stack (verified building together)

| Layer        | Choice                                   |
|--------------|------------------------------------------|
| Framework    | **Next.js 16** (App Router, Turbopack)   |
| UI runtime   | **React 19.2**                           |
| i18n         | **next-intl 4** — DE (default) / EN / RU |
| Database ORM | **Prisma 7** (Rust-free + driver adapter)|
| Database     | PostgreSQL (`@prisma/adapter-pg` + `pg`) |
| Validation   | **Zod 4**                                |
| Styling      | Tailwind CSS 3.4 + PostCSS 8.5           |
| Fonts        | Geist (local) with Inter fallback        |
| Architecture | Feature-Sliced Design                    |

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (REQUIRED before any prisma command)
cp .env.example .env
#   then set DATABASE_URL to your PostgreSQL instance

# 3. Generate the Prisma 7 client into src/generated/prisma
npm run db:generate

# 4. Create the schema in your database
npm run db:push          # or: npm run db:migrate  (creates a migration)

# 5. (optional) Seed sample content
npm run db:seed

# 6. Run the dev server
npm run dev
```

Open http://localhost:3000 — German by default, `/en` and `/ru` for the other locales.

> The marketing homepage renders entirely from the JSON message files, so `npm run dev`
> works even before you connect Postgres. The database is only needed for the contact form
> (stores leads) and future CMS content.

## Stack-specific notes (what changed vs. older tutorials)

- **Next 16**: the middleware file is named **`src/proxy.ts`** (was `middleware.ts` ≤ Next 15).
- **next-intl 4**: `NextIntlClientProvider` is used with **no props** — it auto-inherits
  messages from `src/i18n/request.ts`. `getRequestConfig` must return `locale`.
- **Prisma 7**: Rust-free `prisma-client` generator with a required `output`
  (`src/generated/prisma`, git-ignored — run `db:generate`). Connection config lives in
  **`prisma.config.ts`**, and a **driver adapter** (`@prisma/adapter-pg`) is mandatory.
  `prisma generate` / `db:*` commands need `DATABASE_URL` to be set in `.env`.
- **Zod 4**: top-level validators (e.g. `z.email()` instead of `z.string().email()`).
- `npm install` does **not** auto-generate the Prisma client (so a first install never fails
  without `.env`). Add `"postinstall": "prisma generate"` once your deploy env has `DATABASE_URL`.

## Project structure (Feature-Sliced Design)

```
prisma.config.ts       # Prisma 7 runtime config (datasource url, schema, seed)
prisma/
  schema.prisma        # full content model (translation tables per entity)
  seed.ts
messages/              # de.json / en.json / ru.json
src/
  proxy.ts             # next-intl middleware (Next 16 filename)
  i18n/                # routing, navigation, request config
  app/[locale]/        # routes, layout, metadata, not-found
  widgets/             # page sections (navbar, hero, services, pricing, faq, contact, footer)
  features/            # interactive units (language-switcher, contact form + server action)
  entities/            # domain entities (to be added)
  shared/              # ui kit (Button, Container), config, lib (cn)
  lib/prisma.ts        # Prisma client singleton (driver adapter)
  generated/prisma/    # generated client — created by `npm run db:generate`
```

## What's implemented

- Full localized homepage (16 sections): Navbar, Hero (animated SaaS dashboard), Trust, Case Studies, Services, Industries, Tech Stack, AI Ready, Comparison, Process, About Founder, Testimonials, Pricing, FAQ, Contact (final CTA), Footer
- Scroll-reveal animations (`Reveal`) and a shared `SectionHeader`
- Working DE/EN/RU language switcher that preserves the current path
- Contact form → Zod 4 validation → Server Action → `Lead` row in Postgres (with honeypot)
- Full Prisma 7 schema for every brief entity (Project, Service, Industry, BlogPost, Testimonial, SEOPage, Lead, …)
- SEO metadata + hreflang alternates per locale
- ESLint flat config (`eslint.config.mjs`) using `eslint-config-next` 16 native presets

## Verified locally

`npm run typecheck`, `npm run lint`, and `npm run build` all pass on this stack
(Next 16.2 / React 19.2 / next-intl 4 / Prisma 7 / Zod 4).

## Suggested next steps

1. Service / industry / local landing pages (`/leistungen/[slug]`, `/branchen/[slug]`, `/halle` …) from Prisma.
3. Blog (MDX or DB) with TOC, related articles, schema.
4. JSON-LD structured data components (Organization, LocalBusiness, Service, FAQPage, BreadcrumbList).
5. `llms.txt`, `robots.txt`, dynamic `sitemap.xml` with hreflang.
6. Protected admin/CMS dashboard.
7. Analytics: GA4, Search Console, Microsoft Clarity.
