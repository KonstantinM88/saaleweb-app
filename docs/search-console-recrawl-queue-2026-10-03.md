# Search Console: очередь изменённых страниц

Дата: 03.10.2026. Свойство: `https://saaleweb.de/`. Перед отправкой проверять, что production уже отдаёт новую версию, HTTP 200 и self-canonical. Исторические slug кейсов сохраняются.

Карта `https://saaleweb.de/sitemap.xml` повторно отправлена через Search Console API после финального деплоя C1/C2 03.10.2026 в **01:09 UTC**: ответ HTTP 204, `lastSubmitted` обновился, `isPending=true`, ошибок и предупреждений нет. Production уже возвращает новые тексты, ссылки и корректные HTML hreflang; для detail-страниц услуг устранён противоречивый HTTP `Link`. Это не означает, что перечисленные страницы уже повторно обойдены. Доступный API URL Inspection только читает версию в индексе; индивидуальный запрос «Индексировать» доступен через интерфейс Search Console. В текущей сессии браузер владельца не подключился, поэтому такие запросы не отправлены.

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

Все восемь адресов проверены через URL Inspection API 03.10: `PASS`, «Submitted and indexed», выбранный Google canonical совпадает с адресом. Последний обход этих страниц был **14–25 сентября**, то есть до нынешних правок. Это данные уже индексированной версии, а не проверка новой страницы в реальном времени.

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

Новые предметные ответы добавлены на все пять кейсов в трёх языках. Для этих URL после деплоя проверить HTTP 200, self-canonical, вопросы в HTML и отсутствие противоречивого HTTP hreflang `Link`. Приоритет ручного запроса переобхода — пять DE-адресов; EN/RU находятся в sitemap и могут быть проверены выборочно.

| DE | EN | RU |
|---|---|---|
| `https://saaleweb.de/projekte/online-buchungen-verdreifacht` | `https://saaleweb.de/en/projects/online-bookings-tripled` | `https://saaleweb.de/ru/proekty/onlajn-zapisi-vyrosli-vtroe` |
| `https://saaleweb.de/projekte/neue-liebe-nebra` | `https://saaleweb.de/en/projects/neue-liebe-nebra` | `https://saaleweb.de/ru/proekty/neue-liebe-nebra` |
| `https://saaleweb.de/projekte/direktbuchungen-ohne-portale` | `https://saaleweb.de/en/projects/direct-bookings-without-portals` | `https://saaleweb.de/ru/proekty/pryamye-broni-bez-agregatorov` |
| `https://saaleweb.de/projekte/qualifizierte-bauanfragen` | `https://saaleweb.de/en/projects/qualified-construction-leads` | `https://saaleweb.de/ru/proekty/kvalificirovannye-zayavki` |
| `https://saaleweb.de/projekte/glaserei-schubert` | `https://saaleweb.de/en/projects/glaserei-schubert` | `https://saaleweb.de/ru/proekty/glaserei-schubert` |

Документация Google: [повторный обход и лимиты](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl), [URL Inspection API](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect), [Indexing API](https://developers.google.com/search/apis/indexing-api/v3/using-api).
