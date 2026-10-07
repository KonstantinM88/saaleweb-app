# Tailwind CSS 4 migration — 08.10.2026

## Scope

The project was migrated from Tailwind CSS 3.4.19 to 4.3.3 with the official `@tailwindcss/upgrade` tool and then reviewed against the existing SaaleWeb configuration.

Main changes:

- `tailwindcss` updated to `4.3.3`;
- `@tailwindcss/postcss` added and the old PostCSS plugin entry replaced;
- standalone `autoprefixer` removed because the Tailwind 4 PostCSS pipeline handles prefixing;
- the JavaScript theme from `tailwind.config.ts` was moved to `@theme` tokens in `src/app/globals.css`;
- the obsolete config file was removed;
- Tailwind 3 compatibility border colors were retained explicitly;
- templates were migrated to Tailwind 4 utility names by the official upgrade tool.

No public text, route, metadata, database model, environment variable or business logic was changed.

## Verification before deployment

- `npm audit --omit=dev`: 0 vulnerabilities;
- full `npm audit`: 5 high findings, all in the current `eslint-config-next` development chain;
- `npm run typecheck`: passed;
- `npm run lint`: passed;
- `npm run build`: passed with Next.js 16.4.0 and Webpack;
- all custom theme utilities (`max-w-container`, `bg-brand`, `text-ink`, `animate-bob`, `eyebrow`, `text-gradient`, `shadow-card`, `bg-brand-soft`) are present in generated CSS.

The remaining audit chain is `eslint-config-next` → `@next/eslint-plugin-next` / `fast-glob` → `micromatch` → `braces`. The registry currently proposes downgrading `eslint-config-next` to 14.2.35, which is incompatible with the Next.js 16.4 stack and is not applied.

## Production visual gate

Baseline screenshots were saved before deployment for the homepage, Webdesign Halle service page and restaurant industry page at mobile and desktop widths. After deployment, the same production views must be captured and compared. If Tailwind 4 changes layout, typography, spacing, colors or overflow materially, revert the migration immediately.
