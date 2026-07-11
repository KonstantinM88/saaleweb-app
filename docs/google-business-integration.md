# Google Business Profile — интеграция с saaleweb.de

## Где живёт конфигурация

Все значения централизованы в `src/shared/config/site.ts`:

- `siteConfig.address` — почтовый адрес (единый источник NAP; совпадает с
  Impressum/`LEGAL_PROVIDER` и подтверждённым Google Business Profile).
- `siteConfig.googleBusiness` — все Google-ссылки и координаты.

Эти значения используются: страницей `/kontakt` (секция «Ihr Webdesigner in
Halle (Saale)»), футером (NAP-блок) и Schema.org
(`localBusinessSchema`/`organizationSchema` в `src/shared/seo/schema.ts`).
Ничего не задано в компонентах напрямую.

## Что уже заполнено реальными значениями

| Поле | Значение | Источник |
|---|---|---|
| `profileUrl` | https://g.page/r/CQgPij2bE5yLEBM | ссылка отзыва без суффикса `/review` |
| `reviewUrl` | https://g.page/r/CQgPij2bE5yLEBM/review | предоставлена владельцем |
| `placeUrl` | https://maps.google.com/?cid=10059937225112162056 | CID `0x8b9c139b3d8a0f08` из Maps-ссылки, переведён в десятичный |
| `directionsUrl` | Maps URLs API `dir/?api=1&destination=…` | официальный формат, без ключа |
| `latitude` / `longitude` | 51.4738593 / 11.9106955 | параметры `!2d`/`!1d` из Maps-ссылки |
| `openingHours` | Пн–Чт 08–16, Пт 08–15 | данные профиля |

## Что осталось заполнить вручную (TODO)

**`googleBusiness.placeId`** — сейчас пустая строка (в production ничего
placeholder-ного не выводится). Получить настоящий Place ID (`ChIJ…`):
https://developers.google.com/maps/documentation/places/web-service/place-id
→ Place ID Finder → искать «SaaleWeb Hettstedter Str. 64 Halle». Вставить в
`site.ts`. Понадобится только если позже перейдём на официальный Maps Embed
API с ключом; текущий keyless-embed работает по координатам.

## Что настроить в самом Google Business Profile (вручную)

**Поле «Website»** — рекомендуемое значение:

```text
https://saaleweb.de/kontakt?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile
```

Почему `/kontakt`: пользователь из профиля уже «тёплый» — ему нужны телефон,
маршрут и форма; UTM-метка попадёт в заявку (поле `utm` формы обрабатывается
с Delta 28) и в аналитику. Альтернативы:

- `/kostenlose-website-analyse?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile`
  — если цель — лидогенерация через бесплатный аудит (подходит для кнопки
  или ссылки в постах профиля);
- `/` — общее знакомство с брендом (менее конверсионно для профиля).

Рекомендация: Website = `/kontakt` с UTM, а ссылку на аудит использовать в
Google Posts и кнопках профиля.

## Аналитика кликов

События пишутся в существующую cookieless-аналитику (без новых библиотек и
без согласий — persistent-идентификаторов нет) как синтетические пути:

```text
/e/click_phone  /e/click_email  /e/click_directions  /e/click_google_maps
/e/click_google_business_profile  /e/click_google_review  /e/load_google_maps
```

Смотреть в админ-аналитике по префиксу `/e/`. Хелпер:
`src/features/analytics/trackEvent.ts`.

## Карта

Privacy-first: до клика — статичный плейсхолдер с адресом и кнопкой
«Google Maps laden» (запросов к Google нет), после клика — keyless-embed
`google.com/maps?q=<lat>,<lng>&output=embed` c `loading="lazy"` и `title`.
Под картой — текстовая ссылка на маршрут (доступность без iframe).
