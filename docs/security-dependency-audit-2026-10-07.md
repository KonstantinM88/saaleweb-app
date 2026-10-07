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

Полный `npm audit` показывает 7 high только в инструментах разработки: цепочки Tailwind CSS 3 и `eslint-config-next` через `chokidar`, `fast-glob`, `micromatch` и `braces`. Production audit чистый. Реестр предлагает breaking-переход Tailwind 3 → 4 и некорректный downgrade `eslint-config-next` до ветки 14. Эти изменения не применены в security-релизе, потому что требуют отдельной миграции CSS/lint и визуальной регрессии всего сайта.

Следующий отдельный этап обновления стека: миграция Tailwind 4 с визуальной проверкой ключевых страниц и повторный аудит после появления совместимого исправления в актуальной ветке `eslint-config-next`.
