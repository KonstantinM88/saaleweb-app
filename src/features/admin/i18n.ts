export const ADMIN_LOCALE_COOKIE = "saaleweb_admin_locale";

export const ADMIN_LOCALES = ["de", "ru"] as const;

export type AdminLocale = (typeof ADMIN_LOCALES)[number];

export function isAdminLocale(value: unknown): value is AdminLocale {
  return typeof value === "string" && ADMIN_LOCALES.includes(value as AdminLocale);
}

export function normalizeAdminLocale(value: unknown): AdminLocale {
  return isAdminLocale(value) ? value : "de";
}

export function adminCopy(locale: AdminLocale, de: string, ru: string): string {
  return locale === "ru" ? ru : de;
}

const commonRussianTranslations: Record<string, string> = {
  Übersicht: "Обзор",
  Uebersicht: "Обзор",
  Anfragen: "Заявки",
  Newsletter: "Рассылка",
  "AI-Dialoge": "AI-диалоги",
  "AI-Sichtbarkeit": "AI-видимость",
  Leistungen: "Услуги",
  Branchen: "Отрасли",
  Projekte: "Проекты",
  "Projekt-Kat.": "Категории проектов",
  Preise: "Цены",
  Blog: "Блог",
  Kategorien: "Категории",
  Autoren: "Авторы",
  Testimonials: "Отзывы",
  FAQ: "FAQ",
  "SEO-Seiten": "SEO-страницы",
  "Blog-Kategorien": "Категории блога",
  "Projekt-Kategorien": "Категории проектов",
  "Projekte / Cases": "Проекты / кейсы",
  "Neue Branche": "Новая отрасль",
  "Branche bearbeiten": "Редактировать отрасль",
  "Neue Leistung": "Новая услуга",
  "Leistung bearbeiten": "Редактировать услугу",
  "Neues Projekt": "Новый проект",
  "Projekt bearbeiten": "Редактировать проект",
  "Neue Projekt-Kategorie": "Новая категория проекта",
  "Projekt-Kategorie bearbeiten": "Редактировать категорию проекта",
  "Neues Preispaket": "Новый тариф",
  "Preispaket bearbeiten": "Редактировать тариф",
  "Neuer Artikel": "Новая статья",
  "Artikel bearbeiten": "Редактировать статью",
  "Neue Kategorie": "Новая категория",
  "Kategorie bearbeiten": "Редактировать категорию",
  "Neuer Autor": "Новый автор",
  "Autor bearbeiten": "Редактировать автора",
  "Neues Testimonial": "Новый отзыв",
  "Testimonial bearbeiten": "Редактировать отзыв",
  "Neue FAQ": "Новый FAQ",
  "FAQ bearbeiten": "Редактировать FAQ",
  "Neue SEO-Seite": "Новая SEO-страница",
  "SEO-Seite bearbeiten": "Редактировать SEO-страницу",
  "Eingegangene Leads aus Formularen und dem AI-Assistenten.": "Заявки из форм и AI-ассистента.",
  "Title / Description / OG-Bild pro Pfad (DE/EN/RU).": "Title, Description и OG-изображение для каждого пути (DE/EN/RU).",
  "Referenzen & Fallstudien (DE/EN/RU).": "Проекты и кейсы (DE/EN/RU).",
  "Häufige Fragen (DE/EN/RU).": "Частые вопросы (DE/EN/RU).",
  "Kategorien für Projekte/Cases (DE/EN/RU).": "Категории проектов и кейсов (DE/EN/RU).",
  "Preispakete (DE/EN/RU).": "Тарифные пакеты (DE/EN/RU).",
  "Kundenstimmen (DE/EN/RU).": "Отзывы клиентов (DE/EN/RU).",
  "Blog-Autoren (DE/EN/RU).": "Авторы блога (DE/EN/RU).",
  "Kategorien für Artikel (DE/EN/RU).": "Категории статей (DE/EN/RU).",
  Abmelden: "Выйти",
  Admin: "Админ",
  Neu: "Создать",
  Erstellen: "Создать",
  Speichern: "Сохранить",
  Bearbeiten: "Редактировать",
  Löschen: "Удалить",
  Zurück: "Назад",
  Titel: "Заголовок",
  Beschreibung: "Описание",
  Name: "Название",
  Reihenfolge: "Порядок",
  Veröffentlicht: "Опубликовано",
  Aktiv: "Активно",
  Bild: "Изображение",
  Slug: "Slug",
};

export function translateAdminText(locale: AdminLocale, value: string): string {
  if (locale === "de") return value;
  return commonRussianTranslations[value] ?? value;
}
