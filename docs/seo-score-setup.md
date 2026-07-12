# SEO Score — настройка

Telegram-отчёт `/seo` объединяет доступность сайта, sitemap, PageSpeed,
Core Web Vitals, Search Console и уникальные переходы из AI-ассистентов.
Недоступные внешние компоненты исключаются из знаменателя и помечаются `⚙️`.

## Переменные окружения

| Переменная | Назначение |
|---|---|
| `PAGESPEED_API_KEY` | Lighthouse mobile и полевые CrUX Core Web Vitals |
| `GSC_CLIENT_EMAIL` | Email сервисного аккаунта Google Cloud |
| `GSC_PRIVATE_KEY` | Приватный PKCS8-ключ сервисного аккаунта; поддерживаются `\n` |
| `GSC_SITE_URL` | Точное имя свойства GSC: `https://saaleweb.de/` или `sc-domain:saaleweb.de` |

Без GSC отчёт продолжает работать, но индексирование, CTR и топ-запросы не
учитываются. Без CrUX полевой компонент Core Web Vitals исключается, чтобы не
дублировать лабораторный Lighthouse Score.

## Подключение Google Search Console

1. В Google Cloud Console создайте или выберите проект.
2. В **APIs & Services → Library** включите **Google Search Console API**.
3. В **APIs & Services → Credentials** создайте Service Account. Роли Google
   Cloud ему не требуются.
4. В сервисном аккаунте откройте **Keys → Add key → JSON** и скачайте ключ.
5. Из JSON перенесите `client_email` в `GSC_CLIENT_EMAIL`, а `private_key` — в
   `GSC_PRIVATE_KEY` в переменных Hostinger. Не добавляйте JSON или ключ в Git.
6. В Google Search Console откройте используемое свойство → **Настройки →
   Пользователи и разрешения** и добавьте `client_email` с уровнем **Полный**.
7. Установите `GSC_SITE_URL` в точности как свойство GSC. Для URL-prefix это
   `https://saaleweb.de/`; для Domain property — `sc-domain:saaleweb.de`.
8. После деплоя отправьте боту `/seo new`.

## PageSpeed Insights

В Google Cloud включите **PageSpeed Insights API**, создайте API key и добавьте
его в Hostinger как `PAGESPEED_API_KEY`. На один расчёт выполняется один mobile
запрос. Полевые CrUX данные появятся только когда Google накопит достаточный
объём реальных посещений.

## Таблица снапшотов

Модель `SeoDailySnapshot` хранит один отчёт в день, SEO Score и количество URL
в sitemap. Она нужна для дневной дельты и мгновенной команды `/seo` из кэша.

```bash
npm run db:push
```

## Ежедневный cron

Добавьте отдельное задание в cron-job.org на 07:00 по `Europe/Berlin`:

```text
GET https://saaleweb.de/api/telegram/seo-score?secret=<TELEGRAM_REPORT_SECRET>
```

Безопаснее передавать тот же секрет заголовком, если планировщик это позволяет:

```text
Authorization: Bearer <TELEGRAM_REPORT_SECRET>
```

Расчёт может занимать до минуты. Не запускайте его чаще одного раза в день,
кроме ручной проверки `/seo new` после настройки.
