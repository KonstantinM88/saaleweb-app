import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { ArrowRight, Check, Layers3, MapPin, Search, Sparkles } from "lucide-react";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { Reveal } from "@/shared/ui/Reveal";
import { Magnetic } from "@/shared/ui/Magnetic";
import { TrustMetrics } from "@/shared/ui/TrustMetrics";
import { BrandText } from "@/shared/ui/BrandText";
import { JsonLd } from "@/shared/seo/JsonLd";
import { breadcrumbSchema, collectionPageSchema, faqPageSchema, itemListSchema } from "@/shared/seo/schema";
import { buildMetadata } from "@/shared/seo/metadata";
import { getContactHref } from "@/shared/lib/contactHref";
import { getAuditHref, getHomeHref, getLocalizedSlugHref } from "@/shared/lib/localizedPath";

export const revalidate = 300;

type Params = { locale: string };
type IndustryKey =
  | "restaurant"
  | "hotel"
  | "beauty"
  | "construction"
  | "craftsmen"
  | "glazier"
  | "serviceProvider";

const industrySlugs: Record<IndustryKey, Record<AppLocale, string>> = {
  restaurant: { de: "restaurant-website", en: "restaurant-website", ru: "sayt-dlya-restorana" },
  hotel: { de: "hotel-website", en: "hotel-website", ru: "sayt-dlya-otelya" },
  beauty: { de: "beauty-studio-website", en: "beauty-studio-website", ru: "sayt-dlya-salona-krasoty" },
  construction: {
    de: "bauunternehmen-website",
    en: "construction-company-website",
    ru: "sayt-dlya-stroitelnoy-kompanii",
  },
  craftsmen: { de: "handwerker-website", en: "craftsmen-website", ru: "sayt-dlya-masterov" },
  glazier: { de: "glaserei-website", en: "glazier-website", ru: "sayt-dlya-stekolnoy-masterskoy" },
  serviceProvider: { de: "dienstleister-website", en: "service-provider-website", ru: "sayt-dlya-sfery-uslug" },
};

const projectSlugs = {
  neueLiebe: { de: "neue-liebe-nebra", en: "neue-liebe-nebra", ru: "neue-liebe-nebra" },
  wald: {
    de: "direktbuchungen-ohne-portale",
    en: "direct-bookings-without-portals",
    ru: "pryamye-broni-bez-agregatorov",
  },
  salon: {
    de: "online-buchungen-verdreifacht",
    en: "online-bookings-tripled",
    ru: "onlajn-zapisi-vyrosli-vtroe",
  },
  sorgfalt: {
    de: "qualifizierte-bauanfragen",
    en: "qualified-construction-leads",
    ru: "kvalificirovannye-zayavki",
  },
  glaserei: { de: "glaserei-schubert", en: "glaserei-schubert", ru: "glaserei-schubert" },
} satisfies Record<string, Record<AppLocale, string>>;

type IndustryCard = {
  key: IndustryKey;
  icon: string;
  name: string;
  problem: string;
  solution: string;
  benefits: string[];
  cta: string;
};

type OverviewCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string[];
  primaryCta: string;
  secondaryCta: string;
  trust: { value: string; label: string }[];
  cards: IndustryCard[];
  whyTitle: string;
  whyText: string;
  optimizeTitle: string;
  optimizations: { title: string; text: string }[];
  projectsTitle: string;
  projects: { key: keyof typeof projectSlugs; label: string; text: string }[];
  auditTitle: string;
  auditText: string;
  auditCta: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
};

const overviewCopy: Record<AppLocale, OverviewCopy> = {
  de: {
    metaTitle: "Websites für Branchen | Digitale Lösungen für Restaurants, Hotels, Handwerk & mehr",
    metaDescription:
      "SaaleWeb entwickelt branchenspezifische Websites, SEO-Strukturen und digitale Systeme für Restaurants, Hotels, Beauty Studios, Bauunternehmen, Handwerker und lokale Dienstleister.",
    eyebrow: "Branchen",
    title: "Websites, die zu Ihrer Branche passen.",
    lead: [
      "Jede Branche hat andere Kunden, andere Entscheidungen und andere digitale Anforderungen.",
      "Ein Restaurant braucht andere Inhalte als ein Bauunternehmen. Ein Hotel benötigt andere Funktionen als ein Beauty Studio. Deshalb entwickelt SaaleWeb keine Standard-Websites, sondern digitale Lösungen, die zu Ihrem Geschäftsmodell passen.",
    ],
    primaryCta: "Kostenloses Erstgespräch",
    secondaryCta: "Website analysieren lassen",
    trust: [
      { value: "7", label: "Branchenlösungen" },
      { value: "Local", label: "SEO & Region" },
      { value: "AI", label: "Ready Content" },
      { value: "DE+", label: "Mehrsprachig" },
    ],
    cards: [
      {
        key: "restaurant",
        icon: "🍽️",
        name: "Restaurants",
        problem: "Gäste suchen Speisekarte, Öffnungszeiten, Fotos und Reservierung direkt am Smartphone.",
        solution: "Wir verbinden Atmosphäre, Menü, Reservierung und Local SEO zu einem klaren digitalen Weg.",
        benefits: ["Reservierungen", "Speisekarte", "Local SEO"],
        cta: "Restaurant-Lösung ansehen",
      },
      {
        key: "hotel",
        icon: "🏨",
        name: "Hotels",
        problem: "Portale dominieren oft den Kontakt, während Direktbuchungen und eigene Angebote zu wenig sichtbar sind.",
        solution: "Zimmer, Angebote, Umgebung und Buchungswege werden vertrauenswürdig und mobil klar präsentiert.",
        benefits: ["Direktbuchungen", "Zimmer", "Angebote"],
        cta: "Hotel-Lösung ansehen",
      },
      {
        key: "beauty",
        icon: "✨",
        name: "Beauty Studios",
        problem: "Kunden entscheiden nach Bildern, Vertrauen, Leistungen, Preisen und einfacher Terminbuchung.",
        solution: "Leistungen, Galerie, FAQ und Online-Terminlogik werden zu einer hochwertigen Studio-Präsenz.",
        benefits: ["Online-Termine", "Vertrauen", "Leistungen"],
        cta: "Beauty-Lösung ansehen",
      },
      {
        key: "construction",
        icon: "🏗️",
        name: "Bauunternehmen",
        problem: "Hohe Investitionen brauchen Referenzen, klare Leistungsstruktur und einen seriösen Anfrageweg.",
        solution: "Wir zeigen Leistungen, Projekte, Einzugsgebiet und Vertrauen so, dass bessere Anfragen entstehen.",
        benefits: ["Referenzen", "Anfragen", "SEO Halle"],
        cta: "Bau-Lösung ansehen",
      },
      {
        key: "craftsmen",
        icon: "🛠️",
        name: "Handwerker",
        problem: "Viele Betriebe wirken online älter als ihre tatsächliche Qualität und werden lokal zu wenig gefunden.",
        solution: "Leistungen, Servicegebiete, Referenzen und Kontaktwege werden klar und regional sichtbar.",
        benefits: ["Einzugsgebiet", "Referenzen", "Kontakt"],
        cta: "Handwerker-Lösung ansehen",
      },
      {
        key: "glazier",
        icon: "🪟",
        name: "Glasereien",
        problem: "Spezielle Leistungen, Notdienste, Referenzen und regionale Fachkompetenz sind oft nicht klar getrennt.",
        solution: "Wir strukturieren Glaserei-Leistungen, Referenzen und Anfragewege für Kunden und Suchsysteme.",
        benefits: ["Leistungsseiten", "Referenzen", "Anfragen"],
        cta: "Glaserei-Lösung ansehen",
      },
      {
        key: "serviceProvider",
        icon: "📍",
        name: "Lokale Dienstleister",
        problem: "Unklare Positionierung und schwache lokale Signale kosten Vertrauen und qualifizierte Anfragen.",
        solution: "Wir schaffen eine klare digitale Positionierung mit Leistungsseiten, Local SEO und Anfragefokus.",
        benefits: ["Positionierung", "Local SEO", "Vertrauen"],
        cta: "Dienstleister-Lösung ansehen",
      },
    ],
    whyTitle: "Warum branchenspezifische Websites besser funktionieren",
    whyText:
      "Eine Website funktioniert dann besser, wenn Inhalte, Struktur und Nutzerführung zur Branche passen. Kunden suchen nicht nach Technik – sie suchen Vertrauen, klare Informationen und einen einfachen nächsten Schritt.",
    optimizeTitle: "Was SaaleWeb für verschiedene Branchen optimiert",
    optimizations: [
      { title: "Local SEO", text: "Stadt, Einzugsgebiet, Leistungen und lokale Suchintentionen werden sauber verbunden." },
      { title: "Mobile Nutzerführung", text: "Besucher finden auf dem Smartphone schnell Angebot, Vertrauen und Kontakt." },
      { title: "Kontakt- und Anfrageprozesse", text: "Formulare, CTAs und Kontaktwege werden passend zur Branche geplant." },
      { title: "Buchung oder Reservierung", text: "Termine, Reservierungen oder Anfragen werden dort sichtbar, wo Nutzer entscheiden." },
      { title: "Leistungsstruktur", text: "Komplexe Angebote werden in klare Seiten, FAQ und Entscheidungshilfen übersetzt." },
      { title: "AI-Readiness", text: "Semantische Überschriften, FAQ und strukturierte Daten helfen Suchsystemen beim Verständnis." },
    ],
    projectsTitle: "Passende Beispiele aus der Praxis",
    projects: [
      { key: "neueLiebe", label: "Neue Liebe Nebra", text: "Restaurant-Website mit Menü, Reservierungsfokus und Local SEO." },
      { key: "wald", label: "Waldschlösschen", text: "Hotel- und Gastronomie-Fokus mit Direktbuchungen ohne Portalabhängigkeit." },
      { key: "salon", label: "Salon Elen / Permanent Halle", text: "Beauty- und Terminlogik mit klaren Leistungen und lokaler Sichtbarkeit." },
      { key: "sorgfalt", label: "SorgfaltBau", text: "Bau- und Handwerksstruktur für qualifizierte regionale Anfragen." },
      { key: "glaserei", label: "Glaserei Schubert", text: "Fachleistungen, Referenzen und digitale Vertrauensbildung für Glaserei-Kunden." },
    ],
    auditTitle: "Nicht sicher, ob Ihre Website zu Ihrer Branche passt?",
    auditText:
      "Wir prüfen Struktur, Inhalte, SEO, Performance und Nutzerführung – und zeigen, wo Ihre Website mehr Anfragen ermöglichen kann.",
    auditCta: "Kostenlose Website-Analyse anfragen",
    faqTitle: "Häufige Fragen zu Branchen-Websites",
    faq: [
      {
        q: "Warum sollte eine Website branchenspezifisch aufgebaut sein?",
        a: "Weil Kunden je nach Branche andere Fragen stellen. Eine Restaurant-Website braucht andere Inhalte, Funktionen und Vertrauenssignale als eine Website für Bauunternehmen oder Dienstleister.",
      },
      {
        q: "Erstellt SaaleWeb auch Websites für Branchen, die hier nicht genannt sind?",
        a: "Ja. Die genannten Branchen zeigen typische Beispiele. Wenn Ihr Geschäftsmodell andere Anforderungen hat, planen wir die Struktur passend zu Zielgruppe, Leistungen und Region.",
      },
      {
        q: "Ist Local SEO bei Branchen-Websites enthalten?",
        a: "Die lokale SEO-Struktur wird von Anfang an mitgedacht. Dazu gehören Standortbezug, Leistungsseiten, interne Links, FAQ, strukturierte Daten und eine klare regionale Einordnung.",
      },
      {
        q: "Kann eine bestehende Website branchenspezifisch verbessert werden?",
        a: "Ja. Oft reicht ein gezielter Relaunch oder eine strukturelle Modernisierung, wenn Inhalte, Nutzerführung, SEO und Kontaktwege sinnvoll überarbeitet werden.",
      },
      {
        q: "Welche Technologie nutzt SaaleWeb für Branchen-Websites?",
        a: "Die Technologie folgt dem Ziel. Je nach Projekt können Next.js, React, WordPress, Headless CMS, Java-Integrationen oder individuelle Lösungen sinnvoll sein.",
      },
      {
        q: "Wie startet ein Branchenprojekt?",
        a: "Wir beginnen mit einem kostenlosen Erstgespräch und prüfen Ziele, aktuelle Website, Zielgruppe, Wettbewerb und die wichtigsten digitalen Kontaktpunkte.",
      },
    ],
  },
  en: {
    metaTitle: "Industry websites | Digital solutions for restaurants, hotels, trades and service providers",
    metaDescription:
      "SaaleWeb builds industry-specific websites, SEO structures and digital systems for restaurants, hotels, beauty studios, construction companies, craftsmen, glaziers and local service providers.",
    eyebrow: "Industries",
    title: "Websites built around your industry.",
    lead: [
      "Every industry has different customers, decisions and digital requirements.",
      "A restaurant needs different content than a construction company. A hotel needs different functions than a beauty studio. SaaleWeb therefore builds digital systems that fit the business model instead of generic websites.",
    ],
    primaryCta: "Free first consultation",
    secondaryCta: "Request website audit",
    trust: [
      { value: "7", label: "Industry solutions" },
      { value: "Local", label: "SEO & region" },
      { value: "AI", label: "Ready content" },
      { value: "EN+", label: "Multilingual" },
    ],
    cards: [
      {
        key: "restaurant",
        icon: "🍽️",
        name: "Restaurants",
        problem: "Guests check menu, opening hours, photos and reservations on their phones.",
        solution: "We connect atmosphere, menu, reservations and Local SEO into one clear digital path.",
        benefits: ["Reservations", "Menu", "Local SEO"],
        cta: "View restaurant solution",
      },
      {
        key: "hotel",
        icon: "🏨",
        name: "Hotels",
        problem: "Booking portals often own the contact while direct bookings and own offers stay too hidden.",
        solution: "Rooms, offers, surroundings and booking paths are presented clearly and credibly on mobile.",
        benefits: ["Direct bookings", "Rooms", "Offers"],
        cta: "View hotel solution",
      },
      {
        key: "beauty",
        icon: "✨",
        name: "Beauty studios",
        problem: "Clients decide based on images, trust, services, pricing and easy appointment booking.",
        solution: "Services, gallery, FAQ and booking logic become a premium studio presence.",
        benefits: ["Appointments", "Trust", "Services"],
        cta: "View beauty solution",
      },
      {
        key: "construction",
        icon: "🏗️",
        name: "Construction companies",
        problem: "High-value projects need references, clear service structure and a serious inquiry path.",
        solution: "We show services, projects, service area and trust so better inquiries become easier.",
        benefits: ["References", "Inquiries", "SEO"],
        cta: "View construction solution",
      },
      {
        key: "craftsmen",
        icon: "🛠️",
        name: "Craftsmen",
        problem: "Many businesses look older online than their real quality and are not found locally enough.",
        solution: "Services, service areas, references and contact paths become clear and regionally visible.",
        benefits: ["Service area", "References", "Contact"],
        cta: "View craftsmen solution",
      },
      {
        key: "glazier",
        icon: "🪟",
        name: "Glaziers",
        problem: "Specialist services, emergency work, references and local expertise are often not separated clearly.",
        solution: "We structure glazier services, references and inquiry paths for customers and search systems.",
        benefits: ["Service pages", "References", "Inquiries"],
        cta: "View glazier solution",
      },
      {
        key: "serviceProvider",
        icon: "📍",
        name: "Local service providers",
        problem: "Unclear positioning and weak local signals reduce trust and qualified inquiries.",
        solution: "We create clear digital positioning with service pages, Local SEO and inquiry focus.",
        benefits: ["Positioning", "Local SEO", "Trust"],
        cta: "View service solution",
      },
    ],
    whyTitle: "Why industry-specific websites perform better",
    whyText:
      "A website performs better when content, structure and user guidance fit the industry. Customers are not looking for technology first. They want trust, clear information and an easy next step.",
    optimizeTitle: "What SaaleWeb optimizes for different industries",
    optimizations: [
      { title: "Local SEO", text: "City, service area, services and local search intent are connected cleanly." },
      { title: "Mobile user guidance", text: "Visitors quickly find offer, trust and contact on smartphones." },
      { title: "Contact and inquiry paths", text: "Forms, CTAs and contact flows are planned around the industry." },
      { title: "Booking or reservation", text: "Appointments, reservations or inquiries appear where users decide." },
      { title: "Service structure", text: "Complex offers become clear pages, FAQ and decision support." },
      { title: "AI-readiness", text: "Semantic headings, FAQ and structured data help search systems understand the offer." },
    ],
    projectsTitle: "Relevant project examples",
    projects: [
      { key: "neueLiebe", label: "Neue Liebe Nebra", text: "Restaurant website with menu, reservation focus and Local SEO." },
      { key: "wald", label: "Waldschlösschen", text: "Hotel and gastronomy focus with direct bookings without portal dependency." },
      { key: "salon", label: "Salon Elen / Permanent Halle", text: "Beauty and appointment logic with clear services and local visibility." },
      { key: "sorgfalt", label: "SorgfaltBau", text: "Construction and trades structure for qualified regional inquiries." },
      { key: "glaserei", label: "Glaserei Schubert", text: "Specialist services, references and digital trust for glazier customers." },
    ],
    auditTitle: "Not sure whether your website fits your industry?",
    auditText:
      "We review structure, content, SEO, performance and user guidance, then show where your website can support more inquiries.",
    auditCta: "Request a free website analysis",
    faqTitle: "Frequently asked questions about industry websites",
    faq: [
      {
        q: "Why should a website be built around an industry?",
        a: "Because customers ask different questions in every industry. A restaurant website needs different content, functions and trust signals than a construction or service provider website.",
      },
      {
        q: "Does SaaleWeb build websites for industries not listed here?",
        a: "Yes. The listed industries are typical examples. If your business model has different requirements, we plan the structure around your audience, services and region.",
      },
      {
        q: "Is Local SEO included in industry websites?",
        a: "The local SEO structure is considered from the start: location context, service pages, internal links, FAQ, structured data and clear regional relevance.",
      },
      {
        q: "Can an existing website be improved for an industry?",
        a: "Yes. Often a targeted relaunch or structural modernization is enough when content, user guidance, SEO and contact paths are improved.",
      },
      {
        q: "Which technology does SaaleWeb use?",
        a: "Technology follows the goal. Depending on the project, Next.js, React, WordPress, Headless CMS, Java integrations or custom solutions can be the right choice.",
      },
      {
        q: "How does an industry project start?",
        a: "We begin with a free first consultation and review goals, current website, audience, competition and the most important digital contact points.",
      },
    ],
  },
  ru: {
    metaTitle: "Сайты для отраслей | Digital-решения для ресторанов, отелей, мастеров и услуг",
    metaDescription:
      "SaaleWeb разрабатывает отраслевые сайты, SEO-структуры и digital-системы для ресторанов, отелей, салонов красоты, строительных компаний, мастеров, стекольных мастерских и локальных услуг.",
    eyebrow: "Отрасли",
    title: "Сайты, которые подходят вашей отрасли.",
    lead: [
      "У каждой отрасли свои клиенты, свои решения и свои digital-требования.",
      "Ресторану нужны другие материалы, чем строительной компании. Отелю нужны другие функции, чем салону красоты. Поэтому SaaleWeb создаёт не шаблонные сайты, а digital-решения под бизнес-модель.",
    ],
    primaryCta: "Бесплатная консультация",
    secondaryCta: "Проверить сайт",
    trust: [
      { value: "7", label: "Отраслевых решений" },
      { value: "Local", label: "SEO и регион" },
      { value: "AI", label: "Ready content" },
      { value: "RU+", label: "Многоязычно" },
    ],
    cards: [
      {
        key: "restaurant",
        icon: "🍽️",
        name: "Рестораны",
        problem: "Гости смотрят меню, часы работы, фото и бронирование прямо со смартфона.",
        solution: "Мы соединяем атмосферу, меню, бронирование и Local SEO в понятный digital-путь.",
        benefits: ["Брони", "Меню", "Local SEO"],
        cta: "Смотреть решение",
      },
      {
        key: "hotel",
        icon: "🏨",
        name: "Отели",
        problem: "Порталы часто забирают контакт, а прямые брони и собственные предложения остаются незаметными.",
        solution: "Номера, предложения, окружение и путь бронирования подаются понятно и убедительно.",
        benefits: ["Прямые брони", "Номера", "Предложения"],
        cta: "Смотреть решение",
      },
      {
        key: "beauty",
        icon: "✨",
        name: "Салоны красоты",
        problem: "Клиенты выбирают по фото, доверию, услугам, ценам и удобной онлайн-записи.",
        solution: "Услуги, галерея, FAQ и запись становятся премиальной digital-презентацией салона.",
        benefits: ["Онлайн-запись", "Доверие", "Услуги"],
        cta: "Смотреть решение",
      },
      {
        key: "construction",
        icon: "🏗️",
        name: "Строительные компании",
        problem: "Дорогие проекты требуют референсов, понятной структуры услуг и серьёзного пути заявки.",
        solution: "Мы показываем услуги, проекты, регион работы и доверие так, чтобы заявки были качественнее.",
        benefits: ["Референсы", "Заявки", "SEO"],
        cta: "Смотреть решение",
      },
      {
        key: "craftsmen",
        icon: "🛠️",
        name: "Мастера",
        problem: "Многие компании выглядят онлайн слабее, чем их реальное качество, и мало видны локально.",
        solution: "Услуги, зона работы, референсы и контакт становятся понятными и регионально заметными.",
        benefits: ["Зона работы", "Референсы", "Контакт"],
        cta: "Смотреть решение",
      },
      {
        key: "glazier",
        icon: "🪟",
        name: "Стекольные мастерские",
        problem: "Специальные услуги, срочные работы, референсы и локальная экспертность часто смешаны.",
        solution: "Мы структурируем услуги, референсы и путь заявки для клиентов и поисковых систем.",
        benefits: ["Страницы услуг", "Референсы", "Заявки"],
        cta: "Смотреть решение",
      },
      {
        key: "serviceProvider",
        icon: "📍",
        name: "Локальные услуги",
        problem: "Размытое позиционирование и слабые локальные сигналы снижают доверие и качество заявок.",
        solution: "Мы создаём понятное позиционирование с услугами, Local SEO и фокусом на заявки.",
        benefits: ["Позиционирование", "Local SEO", "Доверие"],
        cta: "Смотреть решение",
      },
    ],
    whyTitle: "Почему отраслевые сайты работают лучше",
    whyText:
      "Сайт работает лучше, когда контент, структура и путь пользователя соответствуют отрасли. Клиенты ищут не технологию, а доверие, понятную информацию и простой следующий шаг.",
    optimizeTitle: "Что SaaleWeb оптимизирует для разных отраслей",
    optimizations: [
      { title: "Local SEO", text: "Город, зона работы, услуги и локальный поисковый интент связываются в структуре сайта." },
      { title: "Мобильный путь", text: "Посетитель быстро находит предложение, доверие и контакт на смартфоне." },
      { title: "Контакт и заявки", text: "Формы, CTA и контактные сценарии планируются под конкретную отрасль." },
      { title: "Бронирование или запись", text: "Записи, брони или заявки появляются там, где пользователь принимает решение." },
      { title: "Структура услуг", text: "Сложные предложения превращаются в понятные страницы, FAQ и аргументы выбора." },
      { title: "AI-readiness", text: "Семантические заголовки, FAQ и структурированные данные помогают поисковым системам понимать сайт." },
    ],
    projectsTitle: "Подходящие примеры проектов",
    projects: [
      { key: "neueLiebe", label: "Neue Liebe Nebra", text: "Сайт ресторана с меню, фокусом на бронирование и Local SEO." },
      { key: "wald", label: "Waldschlösschen", text: "Отель и гастрономия с прямыми бронями без зависимости от порталов." },
      { key: "salon", label: "Salon Elen / Permanent Halle", text: "Beauty и онлайн-запись с понятными услугами и локальной видимостью." },
      { key: "sorgfalt", label: "SorgfaltBau", text: "Структура для строительства и ремесла с квалифицированными региональными заявками." },
      { key: "glaserei", label: "Glaserei Schubert", text: "Специальные услуги, референсы и digital-доверие для стекольной мастерской." },
    ],
    auditTitle: "Не уверены, подходит ли сайт вашей отрасли?",
    auditText:
      "Мы проверим структуру, контент, SEO, производительность и путь пользователя — и покажем, где сайт может приносить больше заявок.",
    auditCta: "Запросить бесплатный анализ сайта",
    faqTitle: "Частые вопросы об отраслевых сайтах",
    faq: [
      {
        q: "Почему сайт должен учитывать отрасль?",
        a: "Потому что клиенты в разных сферах задают разные вопросы. Сайт ресторана требует других материалов, функций и сигналов доверия, чем сайт строительной компании или сферы услуг.",
      },
      {
        q: "SaaleWeb делает сайты для отраслей, которых нет в списке?",
        a: "Да. Список показывает типичные примеры. Если у вашей бизнес-модели другие требования, мы планируем структуру под аудиторию, услуги и регион.",
      },
      {
        q: "Local SEO входит в отраслевые сайты?",
        a: "Локальная SEO-структура учитывается с начала: локация, страницы услуг, внутренние ссылки, FAQ, структурированные данные и региональный контекст.",
      },
      {
        q: "Можно улучшить уже существующий сайт?",
        a: "Да. Часто достаточно целевого релонча или структурной модернизации, если улучшить контент, путь пользователя, SEO и контактные сценарии.",
      },
      {
        q: "Какие технологии использует SaaleWeb?",
        a: "Технология следует цели. В зависимости от проекта подойдут Next.js, React, WordPress, Headless CMS, Java-интеграции или индивидуальные решения.",
      },
      {
        q: "Как начинается отраслевой проект?",
        a: "Мы начинаем с бесплатной консультации и проверяем цели, текущий сайт, аудиторию, конкурентов и важные digital-точки контакта.",
      },
    ],
  },
};

const labels = {
  de: { fit: "Branchenpassung", practice: "Praxis", project: "Projekt" },
  en: { fit: "Industry fit", practice: "Practice", project: "Project" },
  ru: { fit: "Под отрасль", practice: "Практика", project: "Проект" },
} satisfies Record<AppLocale, Record<"fit" | "practice" | "project", string>>;

function getOverview(locale: string): OverviewCopy {
  return overviewCopy[locale as AppLocale] ?? overviewCopy.de;
}

function industryHref(locale: AppLocale, key: IndustryKey): string {
  return getLocalizedSlugHref(locale, "industries", industrySlugs[key][locale]);
}

function projectHref(locale: AppLocale, key: keyof typeof projectSlugs): string {
  return getLocalizedSlugHref(locale, "projects", projectSlugs[key][locale]);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const copy = getOverview(locale);
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ locale: l, href: "/branchen" })]),
  );
  return buildMetadata({
    path: "/branchen",
    locale,
    title: copy.metaTitle,
    description: copy.metaDescription,
    eyebrow: copy.eyebrow,
    languages,
  });
}

export default async function IndustriesIndexPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const appLocale = locale as AppLocale;
  const copy = getOverview(appLocale);
  const tp = await getTranslations({ locale, namespace: "Pages" });
  const homePath = getHomeHref(appLocale);
  const industriesPath = getPathname({ locale: appLocale, href: "/branchen" });
  const contactHref = getContactHref(appLocale);
  const auditHref = getAuditHref(appLocale);
  const ui = labels[appLocale];

  return (
    <>
      <Navbar />
      <JsonLd
        data={[
          collectionPageSchema({
            name: copy.title,
            description: copy.metaDescription,
            path: industriesPath,
            locale: appLocale,
          }),
          itemListSchema(
            copy.cards.map((card) => ({
              name: card.name,
              description: card.solution,
              path: industryHref(appLocale, card.key),
            })),
          ),
          breadcrumbSchema([
            { name: tp("home"), path: homePath },
            { name: tp("industriesLabel"), path: industriesPath },
          ]),
          faqPageSchema(copy.faq),
        ]}
      />
      <main>
        <Breadcrumbs items={[{ name: tp("home"), href: "/" }, { name: tp("industriesLabel") }]} />

        <section className="relative overflow-hidden pb-12 pt-6 md:pb-20 md:pt-10">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_6%,rgba(255,79,163,0.10),transparent_34%),radial-gradient(circle_at_88%_0%,rgba(139,92,246,0.13),transparent_32%),linear-gradient(180deg,#fff_0%,#f7f8fb_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(17,24,39,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,24,39,0.045)_1px,transparent_1px)] bg-[size:56px_56px] opacity-60 [mask-image:radial-gradient(ellipse_82%_58%_at_50%_0%,#000_22%,transparent_76%)]" />
          </div>
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
              <div className="hero-stagger">
                <span className="eyebrow">{copy.eyebrow}</span>
                <h1 className="mt-4 max-w-4xl text-[clamp(34px,5.2vw,64px)] font-extrabold leading-[1.04] tracking-tight text-dark">
                  {copy.title}
                </h1>
                <div className="mt-6 grid max-w-2xl gap-4 text-[clamp(17px,1.8vw,20px)] leading-relaxed text-muted">
                  {copy.lead.map((paragraph) => (
                    <p key={paragraph}>
                      <BrandText text={paragraph} />
                    </p>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Magnetic>
                    <a
                      href={contactHref}
                      className="btn-shine group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(255,79,163,0.72)] transition-all hover:-translate-y-0.5"
                    >
                      {copy.primaryCta}
                      <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
                    </a>
                  </Magnetic>
                  <Magnetic>
                    <a
                      href={auditHref}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-6 py-3.5 text-[15px] font-semibold text-dark shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-purple hover:text-brand-purple"
                    >
                      {copy.secondaryCta}
                    </a>
                  </Magnetic>
                </div>
              </div>

              <Reveal direction="zoom" delay={80}>
                <div className="relative overflow-hidden rounded-[30px] border border-white bg-white/[0.86] p-5 shadow-[0_34px_100px_-62px_rgba(139,92,246,0.75)] backdrop-blur md:p-6">
                  <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(255,79,163,0.14),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(139,92,246,0.16),transparent_36%)]" />
                  <div className="relative grid gap-4">
                    <div className="rounded-[24px] border border-line bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white">
                          <Layers3 size={23} aria-hidden />
                        </span>
                        <div>
                          <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-brand-purple">
                            SEO / GEO / AIO
                          </p>
                          <p className="mt-1 text-[18px] font-extrabold text-dark">{copy.optimizeTitle}</p>
                        </div>
                      </div>
                      <div className="mt-5 grid gap-2.5">
                        {[copy.whyTitle, copy.auditTitle, copy.faqTitle].map((label, index) => (
                          <div key={label}>
                            <div className="mb-1 flex justify-between text-xs font-bold text-muted">
                              <span>{label}</span>
                              <span>{index === 0 ? "UX" : index === 1 ? "SEO" : "FAQ"}</span>
                            </div>
                            <div className="h-2 rounded-full bg-surface">
                              <div
                                className="h-full rounded-full bg-brand"
                                style={{ width: `${index === 0 ? 86 : index === 1 ? 82 : 78}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <TrustMetrics items={copy.trust} />
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="py-16 md:py-24">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <span className="eyebrow">{ui.fit}</span>
              <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight text-dark">
                {copy.whyTitle}
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-muted">
                <BrandText text={copy.whyText} />
              </p>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {copy.cards.map((card, index) => (
                <Reveal key={card.key} delay={(index % 3) * 70} className="h-full">
                  <a
                    href={industryHref(appLocale, card.key)}
                    className="group card-border-glow block h-full rounded-[24px] border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/20 hover:shadow-[0_26px_80px_-58px_rgba(139,92,246,0.78)] focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-2xl">
                        {card.icon}
                      </span>
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-purple transition-transform group-hover:translate-x-0.5">
                        <ArrowRight size={16} aria-hidden />
                      </span>
                    </div>
                    <h3 className="mt-5 text-[20px] font-extrabold text-dark">{card.name}</h3>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-muted">
                      <BrandText text={card.problem} />
                    </p>
                    <div className="mt-4 rounded-2xl bg-surface p-4 text-[14.5px] leading-relaxed text-ink">
                      <BrandText text={card.solution} />
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {card.benefits.map((benefit) => (
                        <span key={benefit} className="rounded-full border border-line bg-white px-3 py-1.5 text-[12.5px] font-bold text-dark">
                          {benefit}
                        </span>
                      ))}
                    </div>
                    <p className="mt-5 inline-flex items-center gap-2 text-[14px] font-extrabold text-brand-purple">
                      {card.cta}
                      <ArrowRight size={15} aria-hidden />
                    </p>
                  </a>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-surface py-16 md:py-24">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <Reveal>
                <div className="sticky top-24 rounded-[26px] border border-line bg-white p-6 shadow-card md:p-8">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white">
                    <Search size={22} aria-hidden />
                  </span>
                  <h2 className="mt-5 text-[clamp(26px,3.4vw,40px)] font-extrabold tracking-tight text-dark">
                    {copy.optimizeTitle}
                  </h2>
                  <p className="mt-4 text-[16px] leading-relaxed text-muted">
                    <BrandText text={copy.whyText} />
                  </p>
                </div>
              </Reveal>
              <div className="grid gap-5 md:grid-cols-2">
                {copy.optimizations.map((item, index) => (
                  <Reveal key={item.title} delay={(index % 2) * 70} className="h-full">
                    <article className="h-full rounded-[22px] border border-line bg-white p-6 shadow-sm">
                      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-purple">
                        <Check size={20} aria-hidden />
                      </div>
                      <h3 className="text-[17px] font-extrabold text-dark">{item.title}</h3>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
                        <BrandText text={item.text} />
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section className="py-16 md:py-24">
          <Container>
            <Reveal className="mb-9 max-w-3xl">
              <span className="eyebrow">{ui.practice}</span>
              <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight text-dark">
                {copy.projectsTitle}
              </h2>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {copy.projects.map((project, index) => (
                <Reveal key={project.key} delay={(index % 5) * 55} className="h-full">
                  <a
                    href={projectHref(appLocale, project.key)}
                    className="group block h-full rounded-[22px] border border-line bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/20 hover:shadow-[0_22px_70px_-54px_rgba(139,92,246,0.72)] focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
                  >
                    <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-brand-purple">
                      {ui.project}
                    </p>
                    <h3 className="mt-3 text-[17px] font-extrabold text-dark">{project.label}</h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-muted">
                      <BrandText text={project.text} />
                    </p>
                    <span className="mt-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand-purple transition-transform group-hover:translate-x-0.5">
                      <ArrowRight size={15} aria-hidden />
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-surface py-16 md:py-24">
          <Container>
            <Reveal>
              <div className="relative overflow-hidden rounded-[28px] border border-line bg-white p-6 shadow-[0_34px_100px_-68px_rgba(139,92,246,0.7)] md:p-9">
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,79,163,0.13),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(139,92,246,0.13),transparent_36%)]" />
                <div className="relative grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-purple">
                      <MapPin size={22} aria-hidden />
                    </span>
                    <h2 className="mt-5 text-[clamp(26px,3.6vw,42px)] font-extrabold tracking-tight text-dark">
                      {copy.auditTitle}
                    </h2>
                    <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted">
                      <BrandText text={copy.auditText} />
                    </p>
                  </div>
                  <Magnetic>
                    <a
                      href={auditHref}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(255,79,163,0.72)] transition-all hover:-translate-y-0.5"
                    >
                      {copy.auditCta}
                      <ArrowRight size={17} aria-hidden />
                    </a>
                  </Magnetic>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>

        <section className="py-16 md:py-24">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <span className="eyebrow">FAQ</span>
              <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight text-dark">
                {copy.faqTitle}
              </h2>
            </Reveal>
            <div className="mx-auto grid max-w-4xl gap-4">
              {copy.faq.map((item, index) => (
                <Reveal key={item.q} delay={(index % 3) * 60}>
                  <article className="rounded-[20px] border border-line bg-white p-5 shadow-sm md:p-6">
                    <h3 className="text-[17px] font-extrabold text-dark">{item.q}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">
                      <BrandText text={item.a} />
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-16 md:py-20">
          <Container>
            <Reveal>
              <div className="relative overflow-hidden rounded-[28px] bg-dark p-8 text-center md:p-14">
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,79,163,0.30),transparent_36%),radial-gradient(circle_at_90%_100%,rgba(139,92,246,0.26),transparent_36%)]" />
                <div className="relative mx-auto max-w-3xl">
                  <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.10] text-brand-pink ring-1 ring-white/[0.14]">
                    <Sparkles size={22} aria-hidden />
                  </span>
                  <h2 className="mt-5 text-[clamp(26px,3.8vw,46px)] font-extrabold tracking-tight text-white">
                    {copy.auditTitle}
                  </h2>
                  <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed text-gray-300">
                    <BrandText text={copy.auditText} />
                  </p>
                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <a
                      href={contactHref}
                      className="btn-shine inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5"
                    >
                      {copy.primaryCta}
                      <ArrowRight size={17} aria-hidden />
                    </a>
                    <a
                      href={auditHref}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.16] bg-white/[0.08] px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/[0.3] hover:bg-white/[0.12]"
                    >
                      {copy.secondaryCta}
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
