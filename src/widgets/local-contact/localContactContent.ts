/** Delta 31 — copy for the local Google Business contact section (3 locales). */
import type { AppLocale } from "@/i18n/routing";

export type LocalContactCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  addressLabel: string;
  hoursLabel: string;
  hours: { label: string; value: string }[];
  byAppointment: string;
  actions: {
    call: string;
    email: string;
    directions: string;
    openMaps: string;
    profile: string;
    review: string;
  };
  aria: {
    call: string;
    email: string;
    directions: string;
    openMaps: string;
    profile: string;
    review: string;
  };
  map: { loadLabel: string; privacyNote: string; mapTitle: string; textLink: string };
  localLink: { before: string; label: string; after: string };
};

const COPY: Record<AppLocale, LocalContactCopy> = {
  de: {
    eyebrow: "Vor Ort in Halle",
    title: "Ihr Webdesigner in Halle (Saale)",
    intro:
      "SaaleWeb entwickelt moderne Websites, Onlineshops und individuelle Webanwendungen für Unternehmen in Halle (Saale), Leipzig und ganz Deutschland. Persönliche Beratung ist nach vorheriger Terminvereinbarung möglich.",
    addressLabel: "Adresse",
    hoursLabel: "Öffnungszeiten",
    hours: [
      { label: "Montag – Donnerstag", value: "08:00–16:00" },
      { label: "Freitag", value: "08:00–15:00" },
      { label: "Samstag & Sonntag", value: "geschlossen" },
    ],
    byAppointment: "Persönliche Beratung nach Terminvereinbarung",
    actions: {
      call: "Jetzt anrufen",
      email: "E-Mail schreiben",
      directions: "Route planen",
      openMaps: "In Google Maps öffnen",
      profile: "SaaleWeb bei Google ansehen",
      review: "Bewertung abgeben",
    },
    aria: {
      call: "SaaleWeb jetzt anrufen",
      email: "E-Mail an SaaleWeb schreiben",
      directions: "Route zu SaaleWeb in Google Maps planen (öffnet in neuem Tab)",
      openMaps: "SaaleWeb-Standort in Google Maps öffnen (öffnet in neuem Tab)",
      profile: "Google Business Profil von SaaleWeb ansehen (öffnet in neuem Tab)",
      review: "Bewertung für SaaleWeb bei Google abgeben (öffnet in neuem Tab)",
    },
    map: {
      loadLabel: "Google Maps laden",
      privacyNote:
        "Die Karte wird erst nach Klick geladen. Dabei werden Daten an Google übertragen.",
      mapTitle: "Google Maps: Standort von SaaleWeb, Hettstedter Str. 64, 06124 Halle (Saale)",
      textLink: "Route zu SaaleWeb in Google Maps öffnen",
    },
    localLink: {
      before: "Mehr über unsere Arbeit vor Ort: ",
      label: "Webdesign & SEO für Halle (Saale)",
      after: ".",
    },
  },
  en: {
    eyebrow: "On site in Halle",
    title: "Your web designer in Halle (Saale)",
    intro:
      "SaaleWeb builds modern websites, online shops and custom web applications for businesses in Halle (Saale), Leipzig and across Germany. Personal consultations are available by appointment.",
    addressLabel: "Address",
    hoursLabel: "Opening hours",
    hours: [
      { label: "Monday – Thursday", value: "08:00–16:00" },
      { label: "Friday", value: "08:00–15:00" },
      { label: "Saturday & Sunday", value: "closed" },
    ],
    byAppointment: "Personal consultations by appointment",
    actions: {
      call: "Call now",
      email: "Send an email",
      directions: "Get directions",
      openMaps: "Open in Google Maps",
      profile: "View SaaleWeb on Google",
      review: "Leave a review",
    },
    aria: {
      call: "Call SaaleWeb now",
      email: "Send an email to SaaleWeb",
      directions: "Get directions to SaaleWeb in Google Maps (opens in a new tab)",
      openMaps: "Open the SaaleWeb location in Google Maps (opens in a new tab)",
      profile: "View the SaaleWeb Google Business Profile (opens in a new tab)",
      review: "Leave a Google review for SaaleWeb (opens in a new tab)",
    },
    map: {
      loadLabel: "Load Google Maps",
      privacyNote: "The map loads only after you click. Data is then transferred to Google.",
      mapTitle: "Google Maps: SaaleWeb location, Hettstedter Str. 64, 06124 Halle (Saale)",
      textLink: "Open directions to SaaleWeb in Google Maps",
    },
    localLink: {
      before: "More about our local work: ",
      label: "web design & SEO for Halle (Saale)",
      after: ".",
    },
  },
  ru: {
    eyebrow: "Локально в Галле",
    title: "Ваш веб-дизайнер в Галле (Заале)",
    intro:
      "SaaleWeb создаёт современные сайты, интернет-магазины и индивидуальные веб-приложения для бизнеса в Галле (Заале), Лейпциге и по всей Германии. Личные консультации — по предварительной записи.",
    addressLabel: "Адрес",
    hoursLabel: "Часы работы",
    hours: [
      { label: "Понедельник – четверг", value: "08:00–16:00" },
      { label: "Пятница", value: "08:00–15:00" },
      { label: "Суббота и воскресенье", value: "выходной" },
    ],
    byAppointment: "Личные консультации по предварительной записи",
    actions: {
      call: "Позвонить",
      email: "Написать на email",
      directions: "Построить маршрут",
      openMaps: "Открыть в Google Картах",
      profile: "Посмотреть SaaleWeb в Google",
      review: "Оставить отзыв",
    },
    aria: {
      call: "Позвонить в SaaleWeb",
      email: "Написать email в SaaleWeb",
      directions: "Построить маршрут к SaaleWeb в Google Картах (откроется в новой вкладке)",
      openMaps: "Открыть локацию SaaleWeb в Google Картах (откроется в новой вкладке)",
      profile: "Посмотреть профиль SaaleWeb в Google (откроется в новой вкладке)",
      review: "Оставить отзыв о SaaleWeb в Google (откроется в новой вкладке)",
    },
    map: {
      loadLabel: "Загрузить Google Карты",
      privacyNote: "Карта загружается только после клика. При этом данные передаются Google.",
      mapTitle: "Google Карты: локация SaaleWeb, Hettstedter Str. 64, 06124 Halle (Saale)",
      textLink: "Открыть маршрут к SaaleWeb в Google Картах",
    },
    localLink: {
      before: "Подробнее о нашей локальной работе: ",
      label: "веб-дизайн и SEO для Галле (Заале)",
      after: ".",
    },
  },
};

export function getLocalContactCopy(locale: AppLocale): LocalContactCopy {
  return COPY[locale];
}
