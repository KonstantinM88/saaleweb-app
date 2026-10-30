import type { AppLocale } from "@/i18n/routing";
import { getLocalizedSlugHref } from "@/shared/lib/localizedPath";
import type { Phase4HubCopy } from "./Phase4LinkCluster";
import type { Phase4Link } from "./phase4Content";

type RetainedPage = Record<AppLocale, { slug: string; label: string; description: string }>;

const services: Record<string, RetainedPage> = {
  "seo-optimierung": {
    de: { slug: "seo-optimierung", label: "SEO für bestehende Unternehmenswebsites", description: "Technik, Inhalte und Suchanfragen gemeinsam prüfen und Verbesserungen nach Priorität umsetzen." },
    en: { slug: "seo-optimization", label: "SEO for existing business websites", description: "Review technical foundations, content and search queries together, then prioritise improvements." },
    ru: { slug: "seo-optimizaciya", label: "SEO существующих сайтов компаний", description: "Совместный анализ технической основы, содержания и поисковых запросов с планом улучшений по приоритетам." },
  },
  hosting: {
    de: { slug: "hosting", label: "Hosting & technischer Betrieb", description: "Hosting, SSL, Sicherungen und Monitoring passend zum bestehenden System planen." },
    en: { slug: "hosting", label: "Hosting & technical operations", description: "Plan hosting, SSL, backups and monitoring around your existing system." },
    ru: { slug: "hosting", label: "Хостинг и техническая эксплуатация", description: "Подбор хостинга, SSL, резервного копирования и мониторинга для вашей системы." },
  },
  digitalberatung: {
    de: { slug: "digitalberatung", label: "Digitalberatung", description: "Ziele, vorhandene Werkzeuge und Budget klären, bevor Technik oder Umsetzung festgelegt werden." },
    en: { slug: "digital-consulting", label: "Digital consulting", description: "Clarify goals, existing tools and budget before choosing technology or implementation." },
    ru: { slug: "cifrovoj-konsalting", label: "Цифровой консалтинг", description: "Разбор целей, текущих инструментов и бюджета до выбора технологии и реализации." },
  },
  "ki-integration": {
    de: { slug: "ki-integration", label: "KI-Integration in bestehende Abläufe", description: "KI-Funktionen mit Website, Datenquellen und betrieblichen Prozessen verbinden; Umfang und Datenschutz vorher klären." },
    en: { slug: "ai-integration", label: "AI integration into existing workflows", description: "Connect AI features with your website, data sources and workflows, with scope and privacy agreed first." },
    ru: { slug: "integraciya-ii", label: "Интеграция ИИ в рабочие процессы", description: "Связь ИИ-функций с сайтом, источниками данных и процессами с предварительным согласованием объёма и работы с данными." },
  },
};

const industries: Record<string, RetainedPage> = {
  arztpraxen: {
    de: { slug: "arztpraxen", label: "Websites für Arztpraxen", description: "Leistungen, Praxisteam, Sprechzeiten und Kontaktwege für Patienten verständlich darstellen." },
    en: { slug: "medical-practices", label: "Websites for medical practices", description: "Present services, the practice team, opening hours and patient contact options clearly." },
    ru: { slug: "medcentry", label: "Сайты медицинских практик", description: "Понятная информация об услугах, специалистах, часах приёма и способах связи для пациентов." },
  },
  immobilien: {
    de: { slug: "immobilien", label: "Websites für Immobilienunternehmen", description: "Objekte, Leistungen, Ansprechpartner und Anfragewege nachvollziehbar präsentieren." },
    en: { slug: "real-estate", label: "Websites for real estate businesses", description: "Present properties, services, contacts and enquiry options in a clear structure." },
    ru: { slug: "nedvizhimost", label: "Сайты компаний недвижимости", description: "Структура объектов, услуг, контактов и обращений для клиентов компании." },
  },
  kanzleien: {
    de: { slug: "kanzleien", label: "Websites für Kanzleien", description: "Rechtsgebiete, Ansprechpartner und den Weg zur ersten Kontaktaufnahme übersichtlich erklären." },
    en: { slug: "law-firms", label: "Websites for law firms", description: "Explain practice areas, contacts and how to make an initial enquiry." },
    ru: { slug: "yuristy", label: "Сайты юридических компаний", description: "Понятное описание направлений работы, специалистов и первого обращения." },
  },
};

function link(page: RetainedPage, locale: AppLocale, section: "services" | "industries"): Phase4Link {
  const { slug, ...copy } = page[locale];
  return { ...copy, href: getLocalizedSlugHref(locale, section, slug) };
}

export function getRetainedServiceLink(canonical: string, locale: AppLocale): Phase4Link | null {
  return services[canonical] ? link(services[canonical], locale, "services") : null;
}

export function getRetainedServiceLinks(locale: AppLocale): Phase4Link[] {
  return Object.values(services).map((page) => link(page, locale, "services"));
}

export function getRetainedIndustryLinks(locale: AppLocale): Phase4Link[] {
  return Object.values(industries).map((page) => link(page, locale, "industries"));
}

export const retainedIndustryHubCopy: Record<AppLocale, Phase4HubCopy> = {
  de: { eyebrow: "Weitere Branchen", title: "Praxis, Immobilien und Kanzlei", lead: "Diese Unternehmen brauchen eigene Inhalte und Kontaktwege. Entdecken Sie die passenden Branchenleistungen." },
  en: { eyebrow: "More industries", title: "Practices, real estate and law firms", lead: "These businesses need their own content and contact paths. Explore the relevant industry services." },
  ru: { eyebrow: "Другие отрасли", title: "Медицина, недвижимость и юридические услуги", lead: "Этим компаниям нужны собственная структура информации и понятные способы обращения. Посмотрите подходящие отраслевые решения." },
};
