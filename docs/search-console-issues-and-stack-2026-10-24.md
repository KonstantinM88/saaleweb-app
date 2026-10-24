# Search Console и обновление стека — 24.10.2026

## Проверка четырёх категорий со скриншотов

Источники: текущий HTTP-ответ сайта с обычным User-Agent и Googlebot User-Agent, URL Inspection API и исходный код. HTTP-запрос с Googlebot User-Agent не заменяет настоящий обход из сети Google. Данные сохранены в [аудите до исправления](audits/2026-10-24-gsc-issue-before.json).

| Категория GSC | Что подтверждено | Действие |
|---|---|---|
| Google выбрал другой canonical: RU WordPress modernization | Google хранит обход 07.10.2026 18:04 UTC с выбором старого `sajta`. Сейчас старый alias делает один 308 на `sayta`; конечный URL — 200, self-canonical и правильные DE/EN/RU/x-default. | Сохранить корректный редирект; добиваться повторного обхода, не менять направление обратно. |
| Ошибка переадресации: два `ai-optimization` | Последний обход обоих URL в API — 14.07.2026. Сейчас DE alias делает `308 → /leistungen/ki-optimierung → 200`, RU alias — `308 → /ru/uslugi/optimizaciya-pod-ii → 200`. Цикла нет, браузерный и Googlebot UA эквивалентны. | Новые правила не нужны; результат GSC исторический. |
| Дубликат без выбранного canonical: EN категории web-design и seo | Прямой 200, но явного canonical нет. Google выбрал www-версии на основании обходов 01.08 и 23.07. | Добавить self-canonical для всех локализованных списков/категорий блога и x-default на немецкий эквивалент. |
| Заблокирован robots.txt: `/api/og?...` | URL относится к генерируемой Open Graph картинке, а не к HTML-посадочной странице. `/api/` намеренно закрыт для обхода. | Сохранить исключение API. Не открывать все API ради устранения строки из GSC. |

Дата последнего сканирования и состояние в GSC описывают известную Google копию, а не текущий тест live URL. Исправный ответ сайта не означает, что Google уже обновил выбранный canonical или завершил валидацию.

## Изменение metadata

- `src/app/[locale]/blog/page.tsx`: canonical на текущий локализованный `/blog`, `x-default` на DE; RSS alternate сохранён.
- `src/app/[locale]/blog/kategorie/[slug]/page.tsx`: canonical на текущую языковую категорию с её собственным slug; `x-default` на DE-эквивалент; существующие языковые alternates сохранены.
- Область: три списка и 12 категорий, всего 15 URL. Категории не объединяются и не перенаправляются на блог или главную.
- Правила www и исторические service aliases сохраняются; новый redirect или изменение robots для этих проблем не требуется.
- Это улучшает однозначность канонических сигналов; гарантии выбора Google или роста позиций нет. [Рекомендации Google](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

## Обновление зависимостей

По запросу владельца Next.js закреплён на **16.4.3**, вместе с `@next/third-parties` и `eslint-config-next`. Официальный релиз: [v16.4.3](https://github.com/vercel/next.js/releases/tag/v16.4.3).

В пределах существующих major-версий обновлены React/React DOM до 19.3.1, Prisma/client/adapter-pg до 7.10.1, Nodemailer до 10.2.1, React Hook Form до 7.91.0, resolvers до 5.9.2, Zod до 4.6.7, jose до 6.2.13, Blob до 2.8.2, Geist до 1.8.2 и связанные транзитивные пакеты. PostCSS закреплён на 8.5.31. Major-миграции TypeScript, ESLint, motion, иконок и других независимых инструментов не включались.

После первого совместимого обновления npm audit выявил закреплённые старые `fast-uri@3.1.8`, `undici@6.29.0` и вложенный `zod@4.1.11` в `@vercel/cli-config`. Применены минимальные исправления: fast-uri 3.1.9, undici 6.29.1 и scoped override Zod 4.6.7 только для cli-config. Сохранён compatibility bridge для minimatch@3 / brace-expansion 5.0.12.

Финальные полные и production-only аудиты сообщают **0 уязвимостей**: [все зависимости](audits/2026-10-24-npm-audit.json), [production](audits/2026-10-24-npm-audit-production.json). Это результат npm advisory database на момент проверки, а не гарантия отсутствия неизвестных уязвимостей. Advisory: [undici](https://github.com/advisories/GHSA-xjj6-f33q-929c), [fast-uri](https://github.com/advisories/GHSA-w74x-v6f9-j3xg), [Zod](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).

Prisma Client 7.10.1 сгенерирован штатным postinstall; schema и migration history не менялись, записи БД не обновлялись. Настройки окружения не менялись; `.env` не предназначен для коммита.

## Проверки и публикация

- TypeScript после обновления — пройден.
- ESLint после обновления — пройден.
- Обычная production-сборка и отдельная forced-WASM сборка Next.js 16.4.3 — пройдены, 249/249 статических страниц. Для WASM проверена фактическая версия `@next/swc-wasm-nodejs@16.4.3`.
- Локальный production runtime: 15/15 страниц блога с одним правильным self-canonical, четырьмя hreflang и x-default как в sitemap; RSS сохранён. Три исторических alias проверены обычным и Googlebot UA: шесть цепочек `308 → 200`, query-параметры сохранены.
- Восемь контрольных публичных страниц DE/EN/RU — 200 с canonical и H1; `/admin` — 307 на login; `/api/og` — 200 `image/png` с корректной PNG-сигнатурой; robots сохраняет исключение API. [HTTP-доказательство](audits/2026-10-24-blog-canonical-local.json).
- При тесте RSC с произвольным `_rsc=indexation-audit` новая версия Next вернула 307 на тот же путь с `_rsc`: штатная валидация cache-busting hash в `next/dist/server/base-server.js`. После нормализации — 200 `text/x-component` с `Vary: rsc`. Первые проверки ошибочно ожидали прямой 200 и регистрозависимое `RSC`; исправлен только диагностический скрипт, поведение приложения не менялось. После каждой попытки сервер остановлен; порт 3194 освобождён, в том числе после финального успешного запуска.
- Неблокирующие предупреждения: существующий Edge Runtime для OG объявлен deprecated; Webpack не анализирует динамический import в extractor next-intl для инвалидации build cache. Обе сборки завершились успешно. Визуальная браузерная регрессия и новые PageSpeed-замеры не выполнялись.
- Публикация и проверка production — следующий шаг.
- Начальные попытки npm/tsx в песочнице завершились EPERM/uv_os_get_passwd; повторные разрешённые запуски вне песочницы отработали. Это проблема среды запуска, а не исправление кода приложения.

## Search Console после публикации

Приоритет для проверки live URL и одного запроса индексирования:

1. `https://saaleweb.de/en/blog/category/web-design`
2. `https://saaleweb.de/en/blog/category/seo`
3. `https://saaleweb.de/ru/uslugi/modernizaciya-wordpress-sayta`

Для старых AI alias сначала проверять редирект и конечный canonical; старые alias не нужно добавлять в sitemap или запрашивать как самостоятельные индексируемые страницы. В группах «Ошибка переадресации», «Дубликат без выбранного canonical» и «Google выбрал другой canonical» можно повторно запустить «Проверить исправление» после проверки production. Для `/api/og` валидацию как ошибку публичной страницы не запускать.

URL Inspection API не запускает live test, не отправляет индивидуальный indexing request и не нажимает Validate fix. Отправка существующего sitemap будет зафиксирована отдельно после подтверждения опубликованных canonical; её нельзя выдавать за индивидуальный запрос индексирования.
