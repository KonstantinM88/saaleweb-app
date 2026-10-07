# Search Console canonical audit — 07.10.2026

## Проверенный случай

- Канонический URL: `https://saaleweb.de/ru/uslugi/modernizaciya-wordpress-sayta`
- Старый alias: `https://saaleweb.de/ru/uslugi/modernizaciya-wordpress-sajta`
- Отчёт GSC: «Страница является копией. Канонические версии страницы, выбранные Google и пользователем, не совпадают».

URL Inspection API подтвердил состояние индексированной копии Google:

- новый URL был просканирован `2026-09-25T01:55:04Z`;
- пользовательский canonical: новый URL с `sayta`;
- выбранный Google canonical: старый URL с `sajta`;
- старый URL был индексирован как самостоятельная страница;
- оба адреса до исправления отвечали `200` и ставили self-canonical;
- sitemap содержал только новый URL, но одна внутренняя ссылка ещё вела на старый alias.

## Исправление

- Старый русский URL теперь постоянно перенаправляется `308` на новый canonical.
- Внутренняя ссылка заменена на canonical с `sayta`.
- Те же правила применены к остальным известным alias страниц услуг, чтобы они не создавали самостоятельные дубли:
  - `/en/services/get-a-website` → `/en/services/website-development`
  - `/en/services/modernize-wordpress-website` → `/en/services/wordpress-website-modernization`
  - `/ru/uslugi/zakazat-sajt` → `/ru/uslugi/razrabotka-saytov`
  - `/ru/uslugi/veb-dizajn-halle` → `/ru/uslugi/webdesign-halle`
  - `/ru/uslugi/modernizaciya-wordpress-sajta` → `/ru/uslugi/modernizaciya-wordpress-sayta`
  - `/ru/uslugi/podderzhka-sajta` → `/ru/uslugi/podderzhka-saytov`

## Проверка после деплоя

Коммит `217377b` опубликован в обоих репозиториях. На production проверено:

- все шесть alias возвращают `308` на соответствующий canonical;
- DE/EN/RU WordPress-страницы возвращают `200` и self-canonical;
- каждая страница содержит четыре HTML alternate: `de`, `en`, `ru`, `x-default`;
- конфликтующий HTTP `Link` на динамических страницах отсутствует;
- sitemap содержит canonical `sayta` и `wordpress-website-modernization`, а старые alias `sajta` и `modernize-wordpress-website` отсутствуют.

Sitemap повторно отправлен через Search Console API `2026-10-07T17:57:56.969Z`: HTTP `204`. Сразу после отправки: `isPending=true`, `errors=0`, `warnings=0`.

## Действия в интерфейсе GSC

1. Проверить URL `https://saaleweb.de/ru/uslugi/modernizaciya-wordpress-sayta`.
2. Запросить индексирование canonical URL.
3. В отчёте по несовпадающему canonical нажать «Проверить исправление».

Google может сохранять старое состояние до повторного обхода обоих адресов.
