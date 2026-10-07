# Dependency security audit — 07.10.2026

## Результат

До обновления `npm audit` показывал 21 уязвимость: 1 critical, 19 high и 1 moderate. В production-дереве присутствовали критические advisory для Next.js 16.3.0, а также уязвимые версии Nodemailer и Sharp.

После обновления:

- `npm audit --omit=dev`: **0 уязвимостей**;
- critical в полном дереве: **0**;
- production build, TypeScript и ESLint проходят;
- Prisma Client успешно генерируется.

Коммит `217377b` опубликован в обоих репозиториях и развёрнут на production. После деплоя проверены главная, контактная страница, три локализованные WordPress-страницы, sitemap и новые постоянные редиректы.

Основные версии:

| Пакет | Было | Стало |
|---|---:|---:|
| Next.js | 16.3.0 | 16.4.0 |
| React / React DOM | 19.2.8 | 19.3.0 |
| Prisma | 7.9.1 | 7.10.0 |
| Nodemailer | 9.0.5 | 10.0.16 |
| Sharp | 0.35.3 | 0.35.5 |
| next-intl | 4.13.5 | 4.14.9 |

Также обновлены безопасные patch/minor-версии PostCSS, `undici`, `fast-uri`, `js-yaml`, `nanoid`, `brace-expansion`, `source-map-js`, `postcss-selector-parser`, `mysql2` и `deepmerge-ts`.

## Оставшиеся сообщения полного audit

08.10 выполнена отдельная миграция Tailwind CSS 3.4.19 → 4.3.3. После неё полный `npm audit` показывает 5 high только в цепочке актуального `eslint-config-next` через `@next/eslint-plugin-next`, `fast-glob`, `micromatch` и `braces`. Production audit остаётся чистым. Реестр предлагает downgrade `eslint-config-next` до ветки 14, что несовместимо с Next.js 16.4 и не применяется.

Следующий security-шаг — повторно проверить эту dev-цепочку после выхода совместимого исправления в актуальной ветке `eslint-config-next`. Подробности миграции: [Tailwind CSS 4](./tailwind-4-migration-2026-10-08.md).
