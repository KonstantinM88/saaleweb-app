# Search Console: очередь изменённых страниц

## Crawled — currently not indexed, 09.10.2026

Проверен экспорт из 13 URL: 11 HTML-страниц технически доступны для индексации, `favicon.ico` и `manifest.webmanifest` являются служебными ресурсами. Найден один доказанный кластер дублей: старые CMS-страницы Performance объединены с более полными страницами оптимизации через постоянные редиректы и удалены из sitemap/JSON-LD. Исправление `a6b9b9b` опубликовано: три цепочки production отвечают `308 → 200`, все 231 URL sitemap отвечают прямым 200. Sitemap повторно отправлен через GSC API 09.10 в **10:37 UTC**: HTTP 204, `isPending=true`, ошибок и предупреждений нет.

После деплоя повторно отправить sitemap. Для ручного URL Inspection приоритетны существующие канонические страницы, которые Google давно не переобходил:

1. `https://saaleweb.de/en/services/web-design-halle`
2. `https://saaleweb.de/en/industries/medical-practices`
3. `https://saaleweb.de/en/pricing`
4. `https://saaleweb.de/ru/ceny`
5. `https://saaleweb.de/ru/uslugi/razrabotka-saytov`

Канонические Performance URL после объединения:

| DE | EN | RU |
|---|---|---|
| `https://saaleweb.de/leistungen/performance-optimierung` | `https://saaleweb.de/en/services/performance-optimization` | `https://saaleweb.de/ru/uslugi/optimizaciya-proizvoditelnosti` |

Подробности и данные URL Inspection: [search-console-crawled-not-indexed-audit-2026-10-09.md](./search-console-crawled-not-indexed-audit-2026-10-09.md).

## Исправление источника 404 — 07.10.2026

Технический аудит отчёта с 157 URL `Не найдено (404)` выявил активный источник на сайте: next-intl создавал ошибочные HTTP hreflang для отраслей, статей и категорий с разными DE/EN/RU slug. Из 219 уникальных адресов в таких заголовках 81 отвечал 404, а 24 уже перенаправлялись. URL Inspection подтвердил один характерный 404 и указал источниками две канонические страницы с конфликтующим заголовком.

Исправление `ef82fa4` опубликовано в обоих remote и production. Все 150 точных compatibility redirect прошли проверку `308 → 200`, все 234 sitemap URL вернули 200, а на 183 динамических страницах больше нет конфликтующего HTTP hreflang. Sitemap повторно отправлен через Search Console API 07.10 в **17:24 UTC**: HTTP 204, `isPending=true`, ошибок и предупреждений нет. Канонические URL и sitemap не менялись. В интерфейсе GSC остаётся запустить `Проверить исправление` для группы 404. Полный аудит и доказательства: [search-console-404-audit-2026-10-07.md](./search-console-404-audit-2026-10-07.md).

Дата: 03.10.2026. Свойство: `https://saaleweb.de/`. Перед отправкой проверять, что production уже отдаёт новую версию, HTTP 200 и self-canonical. Исторические slug кейсов сохраняются.

Карта `https://saaleweb.de/sitemap.xml` повторно отправлена через Search Console API после деплоя FAQ кейсов 03.10.2026 в **01:43 UTC**: ответ HTTP 204, `lastSubmitted` обновился, `isPending=true`, ошибок и предупреждений нет. Production уже возвращает новые тексты, ссылки и корректные HTML hreflang; для detail-страниц услуг и проектов устранён противоречивый HTTP `Link`. Это не означает, что перечисленные страницы уже повторно обойдены. Доступный API URL Inspection только читает версию в индексе; индивидуальный запрос «Индексировать» доступен через интерфейс Search Console. В текущей сессии браузер владельца не подключился, поэтому такие запросы не отправлены.

## AI-видимость W40: после публикации блока собственного ассистента

После деплоя `dbb66e0` все три версии ответили HTTP 200, показали собственный публичный пример ассистента вместо нерелевантных клиентских кейсов, self-canonical и четыре HTML hreflang. В GSC при необходимости один раз запросить переобход основного адреса `https://saaleweb.de/leistungen/ki-assistent`; дополнительные языковые версии `https://saaleweb.de/en/services/ai-assistant` и `https://saaleweb.de/ru/uslugi/ai-assistent` входят в sitemap/hreflang и могут быть проверены выборочно. **Индивидуальные запросы переобхода не отправлены**: URL Inspection API не выполняет это действие, а авторизованный интерфейс GSC в текущей сессии недоступен. Подробнее: [разбор W40](./ai-visibility-w40-review-2026-10-04.md).

## Приоритет для ручного URL Inspection

После деплоя правок ссылок, страницы услуги и цен проверить и при необходимости **один раз** запросить индексирование этих восьми канонических DE-адресов:

1. `https://saaleweb.de/leistungen/webdesign-halle` — уточнены коммерческий текст, FAQ и внутренние ссылки; главная целевая страница запроса `webdesign halle`.
2. `https://saaleweb.de/leistungen/website-erstellen-lassen` — конкретизированы состав сайта малого бизнеса, материалы клиента, последующая редактура и ссылка на цены.
3. `https://saaleweb.de/` — заменены неподтверждённые числовые утверждения в карточках; здесь Google пока показывает большинство целевых запросов.
4. `https://saaleweb.de/preise` — добавлена ссылка на Webdesign Halle.
5. `https://saaleweb.de/projekte/online-buchungen-verdreifacht` — описание кейса и ссылка на услугу.
6. `https://saaleweb.de/projekte/qualifizierte-bauanfragen` — описание кейса и ссылка на услугу.
7. `https://saaleweb.de/projekte/neue-liebe-nebra` — описание кейса без неподтверждённой метрики.
8. `https://saaleweb.de/projekte/direktbuchungen-ohne-portale` — описание проектной версии без неподтверждённой метрики.

Все восемь адресов проверены через URL Inspection API 03.10: `PASS`, «Submitted and indexed», выбранный Google canonical совпадает с адресом. На момент первой проверки последний обход был **14–25 сентября**. Повторная проверка пяти кейсов после публикации FAQ показала новый обход трёх старых DE-кейсов примерно **01:20 UTC 03.10**, до деплоя FAQ; Salon Elen и Glaserei Schubert были обойдены в сентябре. Это данные уже индексированной версии, а не проверка новой страницы в реальном времени.

## Остальные изменённые языковые версии

Они включены в отправленный sitemap с `hreflang`. При необходимости точечно проверять URL Inspection; не отправлять повторный запрос для одного URL несколько раз подряд.

| EN | RU |
|---|---|
| `https://saaleweb.de/en` | `https://saaleweb.de/ru` |
| `https://saaleweb.de/en/pricing` | `https://saaleweb.de/ru/ceny` |
| `https://saaleweb.de/en/services/website-development` | `https://saaleweb.de/ru/uslugi/razrabotka-saytov` |
| `https://saaleweb.de/en/projects/online-bookings-tripled` | `https://saaleweb.de/ru/proekty/onlajn-zapisi-vyrosli-vtroe` |
| `https://saaleweb.de/en/projects/qualified-construction-leads` | `https://saaleweb.de/ru/proekty/kvalificirovannye-zayavki` |
| `https://saaleweb.de/en/projects/neue-liebe-nebra` | `https://saaleweb.de/ru/proekty/neue-liebe-nebra` |
| `https://saaleweb.de/en/projects/direct-bookings-without-portals` | `https://saaleweb.de/ru/proekty/pryamye-broni-bez-agregatorov` |

После каждого будущего деплоя вести здесь компактный список **только реально изменённых канонических URL**, отмечать способ уведомления Google и результат проверки. Для обычных страниц не использовать Indexing API: Google ограничивает его страницами `JobPosting` и прямых трансляций `BroadcastEvent`.

## Пакет P1: FAQ опубликованных кейсов

Новые предметные ответы добавлены на все пять кейсов в трёх языках. После деплоя все 15 URL вернули HTTP 200, self-canonical, три FAQ-ответа в HTML и четыре правильные HTML hreflang-ссылки без противоречивого HTTP `Link`. Пять DE-адресов проверены через URL Inspection API: все `PASS`, «Submitted and indexed», Google canonical совпадает. Приоритет ручного запроса переобхода — пять DE-адресов; EN/RU находятся в sitemap и могут быть проверены выборочно. Индивидуальные запросы через интерфейс не отправлены.

| DE | EN | RU |
|---|---|---|
| `https://saaleweb.de/projekte/online-buchungen-verdreifacht` | `https://saaleweb.de/en/projects/online-bookings-tripled` | `https://saaleweb.de/ru/proekty/onlajn-zapisi-vyrosli-vtroe` |
| `https://saaleweb.de/projekte/neue-liebe-nebra` | `https://saaleweb.de/en/projects/neue-liebe-nebra` | `https://saaleweb.de/ru/proekty/neue-liebe-nebra` |
| `https://saaleweb.de/projekte/direktbuchungen-ohne-portale` | `https://saaleweb.de/en/projects/direct-bookings-without-portals` | `https://saaleweb.de/ru/proekty/pryamye-broni-bez-agregatorov` |
| `https://saaleweb.de/projekte/qualifizierte-bauanfragen` | `https://saaleweb.de/en/projects/qualified-construction-leads` | `https://saaleweb.de/ru/proekty/kvalificirovannye-zayavki` |
| `https://saaleweb.de/projekte/glaserei-schubert` | `https://saaleweb.de/en/projects/glaserei-schubert` | `https://saaleweb.de/ru/proekty/glaserei-schubert` |

## Пакет C3: WordPress-агентство и релонч

После деплоя `fed4ef7` эти шесть канонических адресов проверены: HTTP 200, новый текст, self-canonical, четыре правильные HTML hreflang, без конфликтующего HTTP `Link`. Скорректированы условия инвентаризации и поддержки, выбор между обслуживанием и релончем, риски SEO-миграции и внутренние ссылки. Sitemap повторно отправлен через GSC API 03.10 в **11:52 UTC**: HTTP 204, `lastSubmitted=2026-10-03T11:52:45.986Z`, `isPending=true`, ошибок и предупреждений нет. Это уведомление о карте сайта, не запрос индивидуального переобхода. В интерфейсе GSC в первую очередь однократно запросить индексирование двух DE-адресов; EN/RU входят в sitemap.

URL Inspection API для двух DE-страниц вернул `PASS`, «Submitted and indexed», Google canonical совпадает. Последний обход WordPress-страницы был **09.09**, релонча — **22.08**. Новые тексты пока подтверждены на production, но не в уже проиндексированной копии Google.

| DE | EN | RU |
|---|---|---|
| `https://saaleweb.de/leistungen/wordpress-agentur-halle` | `https://saaleweb.de/en/services/wordpress-agency-halle` | `https://saaleweb.de/ru/uslugi/wordpress-agentstvo-halle` |
| `https://saaleweb.de/leistungen/website-relaunch` | `https://saaleweb.de/en/services/website-relaunch` | `https://saaleweb.de/ru/uslugi/relonch-sajta` |

## T1: нормализация www

После деплоя `3732632` URL вида `https://www.saaleweb.de/<путь>?<параметры>` возвращают 308 на тот же путь и параметры хоста `https://saaleweb.de`. Проверены главная и услуги DE/EN/RU; конечные страницы вернули 200 без цикла. Содержание и адреса канонических страниц не менялись, sitemap уже содержит версии без www. **Новых отдельных канонических URL для ручного запроса индексирования нет.** Следить за обнаружением редиректа в GSC можно при следующей плановой проверке индексации.

После `8991bae` уменьшен только сериализованный payload переводов. Проверены production `/`, `/leistungen/webdesign-halle`, `/leistungen/website-erstellen-lassen`, `/en`, `/ru`: HTTP 200, те же canonical и hreflang. Видимый SEO-текст и URL не изменены; новых индивидуальных запросов индексирования для этого изменения не требуется.

Документация Google: [повторный обход и лимиты](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl), [URL Inspection API](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect), [Indexing API](https://developers.google.com/search/apis/indexing-api/v3/using-api).

## Canonical mismatch WordPress RU, 07.10

URL Inspection подтвердил, что для `https://saaleweb.de/ru/uslugi/modernizaciya-wordpress-sayta` Google выбрал старый alias с `sajta`. После деплоя `217377b` старый alias перенаправляется `308` на canonical, внутренняя ссылка исправлена, а sitemap содержит только canonical. Sitemap повторно отправлен через GSC API 07.10 в **17:57 UTC**: HTTP 204, `isPending=true`, 0 ошибок и предупреждений. В интерфейсе GSC один раз проверить canonical URL, запросить индексирование и запустить «Проверить исправление» для группы несовпадающих canonical. Подробности: [аудит](./search-console-canonical-audit-2026-10-07.md).

## T1: ранние загрузки mobile, 04.10

Техническое изменение главных `https://saaleweb.de/`, `https://saaleweb.de/en`, `https://saaleweb.de/ru`: prefetch Hero-кнопок и отложенная загрузка нижних иллюстраций. Видимые тексты, ссылки и canonical/hreflang прежние; новых отдельных запросов индексирования не требуется. Проверка и статус публикации: [отчёт](./performance-mobile-2026-10-04.md).

## T1: скрытая анимация и CSS отраслевых страниц, 04.10

На главных `/`, `/en`, `/ru` ползунок далёкого нижнего блока перестаёт перерисовываться до появления на экране. Стили отельного, ресторанного, строительного и beauty-шаблонов вынесены из общей таблицы стилей на маршрут отраслевых деталей. Затронутые канонические адреса:

| DE | EN | RU |
|---|---|---|
| `https://saaleweb.de/` | `https://saaleweb.de/en` | `https://saaleweb.de/ru` |
| `https://saaleweb.de/branchen/hotel-website` | `https://saaleweb.de/en/industries/hotel-website` | `https://saaleweb.de/ru/otrasli/sayt-dlya-otelya` |
| `https://saaleweb.de/branchen/restaurant-website` | `https://saaleweb.de/en/industries/restaurant-website` | `https://saaleweb.de/ru/otrasli/sayt-dlya-restorana` |
| `https://saaleweb.de/branchen/bauunternehmen-website` | `https://saaleweb.de/en/industries/construction-company-website` | `https://saaleweb.de/ru/otrasli/sayt-dlya-stroitelnoy-kompanii` |
| `https://saaleweb.de/branchen/beauty-studio-website` | `https://saaleweb.de/en/industries/beauty-studio-website` | `https://saaleweb.de/ru/otrasli/sayt-dlya-salona-krasoty` |

После `e9653db` три главные проверены браузером, а все 12 отраслевых URL — прямым HTTP: 200, self-canonical и CSS шаблонов. Изменены только загрузка CSS и поведение анимации, а не видимый SEO-текст, URL, canonical или hreflang. **Отдельные запросы индексирования в GSC для этих адресов не нужны.** Статус и замеры: [повторный отчёт T1](./performance-mobile-followup-2026-10-04.md).

## C1: Webdesign Halle, 04.10

Изменены видимые тексты о планировании объёма, сроках и сопровождении на трёх языковых версиях. EN/RU страницы теперь также ссылаются на релевантные кейсы Salon Elen и SorgfaltBau и на свои цены. После деплоя `6ddcfcf` все три production URL ответили HTTP 200, показали новый текст, ссылки, self-canonical и четыре HTML hreflang без конфликтующего HTTP `Link`. Sitemap отправлен через GSC API 04.10 в **14:08 UTC**: HTTP 204, `lastSubmitted=2026-10-04T14:08:59.161Z`, `isPending=true`, 0 ошибок и предупреждений. Это не индивидуальный запрос переобхода. URL Inspection API для DE-страницы вернул `PASS`, «Submitted and indexed», выбранный Google canonical совпал; последний обход **03.10 в 01:16 UTC** был до новых правок. Один ручной запрос в GSC UI можно сделать для приоритетного DE-адреса; API URL Inspection его не отправляет.

| DE | EN | RU |
|---|---|---|
| `https://saaleweb.de/leistungen/webdesign-halle` | `https://saaleweb.de/en/services/web-design-halle` | `https://saaleweb.de/ru/uslugi/webdesign-halle` |

## L1: региональные страницы, 04.10

На этих страницах уточнены зона работы и связь кейсов с регионом. После деплоя `f4acf10` все девять production URL ответили HTTP 200 с self-canonical, четырьмя hreflang и нужными кейсами в серверном HTML; нерелевантный кейс Neue Liebe Nebra здесь не выводится. Существующий sitemap отправлен через GSC API 04.10, ответ HTTP 204. Владелец сообщил 04.10, что страницы отправлены на индексирование через интерфейс GSC. Точный список отправленных URL и статус обработки Google не подтверждены; не повторять запросы без причины. При следующей проверке URL Inspection сверить дату последнего обхода и выбранный Google canonical, прежде всего для трёх DE-адресов.

| DE | EN | RU |
|---|---|---|
| `https://saaleweb.de/standorte/halle` | `https://saaleweb.de/en/locations/halle` | `https://saaleweb.de/ru/goroda/halle` |
| `https://saaleweb.de/standorte/merseburg` | `https://saaleweb.de/en/locations/merseburg` | `https://saaleweb.de/ru/goroda/merseburg` |
| `https://saaleweb.de/standorte/saalekreis` | `https://saaleweb.de/en/locations/saalekreis` | `https://saaleweb.de/ru/goroda/saalekreis` |
