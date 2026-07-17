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
| `placeId` | `ChIJpZR1A7F9pkcRCA-KPZsTnIs` | публичный идентификатор подтверждённого профиля |
| rating / reviews | 5,0 / 2 | проверено в публичном профиле 17.07.2026 |
| `directionsUrl` | Maps URLs API `dir/?api=1&destination=…` | официальный формат, без ключа |
| `latitude` / `longitude` | 51.4738593 / 11.9106955 | параметры `!2d`/`!1d` из Maps-ссылки |
| `openingHours` | Пн–Чт 08–16, Пт 08–15 | данные профиля |

## Синхронизация реальных Google-отзывов

До подключения API главная страница сразу показывает два настоящих отзыва,
которые владелец проверил в публичном Google Business Profile 17.07.2026.
Проверенные оригиналы и локализованные переводы находятся в
`src/features/google/googleBusinessReviewFallback.ts`. Немецкие тексты
сохранены дословно, а EN/RU явно помечены как переводы и ведут к исходному
профилю Google. Это не CMS-заглушки и не вымышленные testimonials.

После подключения ключа главная страница дополнительно получает текущую
опубликованную подборку через официальный **Places API (New)** в
`src/features/google/googleBusinessReviews.ts`. Успешный live-ответ заменяет
проверенный fallback; при ошибке fallback остаётся видимым.

Порядок работы:

1. Сервер использует `GOOGLE_PLACES_API_KEY`; если отдельный ключ не задан,
   допустим fallback на уже существующий `PAGESPEED_API_KEY`.
2. По умолчанию используется проверенный Place ID из `siteConfig`; переменная
   `GOOGLE_BUSINESS_PLACE_ID` может переопределить его без изменения кода.
3. Если валидный Place ID отсутствует, профиль определяется через точный Text
   Search по названию, адресу и координатам. Результат принимается только при
   точном названии `SaaleWeb`.
4. Отзывы лениво загружаются только при приближении секции к viewport. Это не
   задерживает LCP и не добавляет Google-запрос к initial render.
5. Google-контент не сохраняется в БД и application cache. Каждый новый
   просмотр блока получает актуальную доступную подборку без ручного
   копирования в CMS.
6. При временной ошибке Google или отсутствии ключа главная страница не падает
   и продолжает показывать два вручную проверенных отзыва, реальную оценку 5,0,
   ссылку на профиль и прямую кнопку добавления нового отзыва. Старые CMS/JSON
   testimonials публично не выводятся.

В карточках показываются оригинальный текст, оценка, аватар/имя автора, дата,
ссылка на оригинал и доступная ссылка для жалобы. Рядом с отзывами
отображается атрибуция Google Maps и пояснение, что API отдаёт не более пяти
отзывов, выбранных Google по релевантности. Endpoint
`/api/google-business/reviews` работает с `Cache-Control: no-store`. Небольшие
аватары авторов временно преобразуются сервером в data URL в рамках того же
ответа, поэтому браузер посетителя не обращается к Google до явного клика по
ссылке.

### Настройка Google Cloud / Hostinger

1. В Google Cloud включить **Places API (New)**:
   https://console.cloud.google.com/apis/library/places.googleapis.com
2. Для Places API нужен включённый billing. Поле `reviews` относится к
   платному Places SKU, поэтому в Google Cloud нужно задать quota и budget
   alerts. Запрос выполняется лениво только для пользователей, которые
   приблизились к секции отзывов.
3. Рекомендуется создать отдельный server-side API key и ограничить его API
   `Places API (New)`.
4. В Hostinger добавить:

```env
GOOGLE_PLACES_API_KEY="..."
GOOGLE_BUSINESS_PLACE_ID="ChIJpZR1A7F9pkcRCA-KPZsTnIs"
```

`GOOGLE_BUSINESS_PLACE_ID` необязателен, потому что этот же публичный Place ID
уже находится в `siteConfig`. Переменная нужна только как production override.

Ключ никогда не должен быть `NEXT_PUBLIC_*`, выводиться в браузере или
попадать в Git.

Важно: Places API возвращает максимум пять отзывов и сортирует их по
релевантности. Для гарантированной выгрузки всех отзывов в строгой
хронологии потребовался бы Google Business Profile API с отдельным OAuth и
одобрением проекта; для публичного блока на сайте это избыточно.

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
