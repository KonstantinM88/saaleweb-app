import { routing, type AppLocale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

// These cases ship with the application, including their screenshots. They do
// not require a CMS import. Existing CMS-only projects keep their own lifecycle.
export function isCodeProjectSlug(slug: string) {
  return slug === "onebbau";
}

export function getCodeProjectParams() {
  return routing.locales.map((locale) => ({ locale, slug: "onebbau" }));
}

const translations = {
  de: {
    title: "Onebbau – Website für Bau und Handwerk in Halle",
    challenge: "Bau-, Renovierungs- und Gartenleistungen verständlich präsentieren und Interessenten aus Halle (Saale) einen klaren Weg zur Beratung bieten.",
    solution: "SaaleWeb realisierte https://www.onebbau.de/ mit einer responsiven Oberfläche, eigenen Leistungsseiten, einer Projektgalerie, häufigen Fragen und direkten Kontaktwegen per Formular, Telefon und WhatsApp. Die Website ist auf Deutsch und Russisch verfügbar.",
    results: "Ein veröffentlichter Unternehmensauftritt mit klar gegliederten Leistungen, Referenzbildern und erreichbaren Kontaktmöglichkeiten auf Smartphone und Desktop. Leistungsseiten mit Halle-Bezug und verständliche Antworten bilden die inhaltliche Grundlage für lokale Suche; gemessene Ranking- oder Anfragezuwächse werden nicht behauptet.",
    tag: "Bau · Vertrauen · Anfragen",
    result: "Leistungen & Kontaktwege",
    desktopAlt: "Onebbau: veröffentlichte Desktop-Website für Bau und Handwerk in Halle",
    coverAlt: "Onebbau-Website auf Monitor und Smartphone – Projektvisualisierung",
    mobileAlt: "Onebbau: mobile Website mit direktem Beratungsweg",
  },
  en: {
    title: "Onebbau – construction and trade website in Halle",
    challenge: "Present construction, renovation and garden services clearly and give prospective customers in Halle (Saale) a straightforward path to a consultation.",
    solution: "SaaleWeb built https://www.onebbau.de/ with a responsive interface, dedicated service pages, a project gallery, frequently asked questions and direct contact by form, phone and WhatsApp. The website is available in German and Russian.",
    results: "A published business website with organised services, reference images and accessible contact options on mobile and desktop. Service pages referring to Halle and clear answers provide a content foundation for local search; no measured ranking or inquiry gains are claimed.",
    tag: "Construction · Trust · Inquiries",
    result: "Services & contact paths",
    desktopAlt: "Onebbau: published desktop website for construction and trades in Halle",
    coverAlt: "Onebbau website on a monitor and smartphone – project visualisation",
    mobileAlt: "Onebbau: mobile website with a direct consultation path",
  },
  ru: {
    title: "Onebbau — сайт строительной компании в Галле",
    challenge: "Понятно представить строительные, ремонтные и садовые работы и дать потенциальным клиентам из Halle (Saale) простой путь к консультации.",
    solution: "SaaleWeb разработал https://www.onebbau.de/ с адаптивным интерфейсом, отдельными страницами услуг, галереей работ, ответами на частые вопросы и связью через форму, телефон и WhatsApp. Сайт доступен на немецком и русском языках.",
    results: "Опубликованный сайт компании с понятной структурой услуг, фотографиями работ и доступными способами связи на телефоне и компьютере. Страницы услуг с привязкой к Галле и понятные ответы создают контентную основу для локального поиска; измеренный рост позиций или заявок не заявляется.",
    tag: "Строительство · Доверие · Заявки",
    result: "Услуги и способы связи",
    desktopAlt: "Onebbau: опубликованный сайт строительной компании в Галле на компьютере",
    coverAlt: "Сайт Onebbau на мониторе и смартфоне — визуализация проекта",
    mobileAlt: "Onebbau: мобильный сайт с прямым обращением за консультацией",
  },
};

export function getCodeProject(locale: AppLocale, slug: string) {
  if (!isCodeProjectSlug(slug)) return null;
  const copy = translations[locale];
  const languages = Object.fromEntries(routing.locales.map((targetLocale) => [
    targetLocale,
    getPathname({ locale: targetLocale, href: { pathname: "/projekte/[slug]", params: { slug } } }),
  ]));
  return {
    title: copy.title,
    challenge: copy.challenge,
    solution: copy.solution,
    results: copy.results,
    externalUrl: "https://www.onebbau.de/",
    tag: copy.tag,
    result: copy.result,
    year: 2026,
    technologies: ["Responsive Webdesign", "DE / RU", "FAQ"],
    coverColor: "#FFF4E8",
    cover: { url: "/images/cases/onebbau-monitor-phone-v1.webp", alt: copy.coverAlt, width: 1536, height: 1024 },
    gallery: [
      { url: "/images/project-captures/2026-11-25/onebbau.webp", alt: copy.desktopAlt, width: 1432, height: 943 },
      { url: "/images/project-captures/2026-11-25/onebbau-mobile.webp", alt: copy.mobileAlt, width: 382, height: 827 },
    ],
    languages,
    slugs: { de: slug, en: slug, ru: slug } as Record<string, string>,
  };
}

export function getCodeProjectCards(locale: AppLocale) {
  return getCodeProjectParams().filter((item) => item.locale === locale).map(({ slug }) => {
    const project = getCodeProject(locale, slug)!;
    return { slug, title: project.title, tag: project.tag, result: project.result, cover: { image: project.cover.url, color: project.coverColor } };
  });
}
