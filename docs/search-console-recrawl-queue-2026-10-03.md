# Search Console: очередь изменённых страниц

Дата: 03.10.2026. Свойство: `https://saaleweb.de/`. Перед отправкой проверять, что production уже отдаёт новую версию, HTTP 200 и self-canonical. Исторические slug кейсов сохраняются.

Карта `https://saaleweb.de/sitemap.xml` повторно отправлена через Search Console API после деплоя FAQ кейсов 03.10.2026 в **01:43 UTC**: ответ HTTP 204, `lastSubmitted` обновился, `isPending=true`, ошибок и предупреждений нет. Production уже возвращает новые тексты, ссылки и корректные HTML hreflang; для detail-страниц услуг и проектов устранён противоречивый HTTP `Link`. Это не означает, что перечисленные страницы уже повторно обойдены. Доступный API URL Inspection только читает версию в индексе; индивидуальный запрос «Индексировать» доступен через интерфейс Search Console. В текущей сессии браузер владельца не подключился, поэтому такие запросы не отправлены.

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
