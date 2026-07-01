import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const locales = ["de", "en", "ru"] as const;
type Locale = (typeof locales)[number];

type PlanTranslation = {
  name: string;
  sub: string;
  price: string;
  features: string[];
};

type PlanSeed = {
  order: number;
  featured: boolean;
  translations: Record<Locale, Omit<PlanTranslation, "price"> & { price: (prices: SavedPrices) => string }>;
};

type SavedPrices = Record<Locale, { starter: string; business: string }>;

const fallbackPrices: SavedPrices = {
  de: { starter: "ab 990 €", business: "ab 1.990 €" },
  en: { starter: "from €990", business: "from €1,990" },
  ru: { starter: "от 990 €", business: "от 1 990 €" },
};

const pricingSeo = {
  de: {
    title: "Preise für Websites, SEO & digitale Lösungen | SaaleWeb",
    description:
      "Transparente Einstiegspreise für WordPress-Onepager, React/Next.js Landingpages, Business Websites, SEO, Betreuung und digitale Lösungen von SaaleWeb.",
  },
  en: {
    title: "Pricing for Websites, SEO & Digital Solutions | SaaleWeb",
    description:
      "Transparent starting prices for WordPress one-page websites, React/Next.js landing pages, business websites, SEO, maintenance and digital solutions by SaaleWeb.",
  },
  ru: {
    title: "Цены на сайты, SEO и digital-решения | SaaleWeb",
    description:
      "Прозрачные стартовые цены на WordPress-onepager, React/Next.js лендинги, бизнес-сайты, SEO, поддержку и digital-решения от SaaleWeb.",
  },
} satisfies Record<Locale, { title: string; description: string }>;

const plans: PlanSeed[] = [
  {
    order: 1,
    featured: false,
    translations: {
      de: {
        name: "Leichter Start",
        sub: "WordPress Onepager für den schnellen professionellen Einstieg.",
        price: () => "ab 600 €",
        features: [
          "1 professionelle Onepage-Website",
          "WordPress-Basis",
          "Responsive Design",
          "Kontaktformular",
          "Basis-SEO",
          "Grundlegende GEO / AIO-Struktur",
          "Kurze Einweisung",
        ],
      },
      en: {
        name: "Easy Start",
        sub: "WordPress one-pager for a fast professional start.",
        price: () => "from €600",
        features: [
          "1 professional one-page website",
          "WordPress foundation",
          "Responsive design",
          "Contact form",
          "Basic SEO",
          "Basic GEO / AIO structure",
          "Short handover",
        ],
      },
      ru: {
        name: "Лёгкий старт",
        sub: "WordPress-onepager для быстрого профессионального старта.",
        price: () => "от 600 €",
        features: [
          "1 профессиональная onepage-страница",
          "База WordPress",
          "Адаптивный дизайн",
          "Контактная форма",
          "Базовое SEO",
          "Базовая GEO / AIO-структура",
          "Короткая передача проекта",
        ],
      },
    },
  },
  {
    order: 2,
    featured: true,
    translations: {
      de: {
        name: "Starter Landingpage",
        sub: "React / Next.js Landingpage mit 6–9 Inhaltsbereichen.",
        price: (prices) => prices.de.starter,
        features: [
          "1 hochwertige Landingpage",
          "6–9 professionelle Inhaltsbereiche",
          "Individuelles Layout",
          "Conversion-orientierte CTA-Struktur",
          "Basis-SEO",
          "Grundlegende GEO / AIO-Struktur",
          "Performance-Optimierung",
          "FAQ-Bereich",
        ],
      },
      en: {
        name: "Starter Landing Page",
        sub: "React / Next.js landing page with 6–9 content sections.",
        price: (prices) => prices.en.starter,
        features: [
          "1 premium landing page",
          "6–9 professional content sections",
          "Custom layout",
          "Conversion-oriented CTA structure",
          "Basic SEO",
          "Basic GEO / AIO structure",
          "Performance optimization",
          "FAQ section",
        ],
      },
      ru: {
        name: "Starter Landingpage",
        sub: "React / Next.js лендинг с 6–9 смысловыми блоками.",
        price: (prices) => prices.ru.starter,
        features: [
          "1 премиальный лендинг",
          "6–9 профессиональных контент-блоков",
          "Индивидуальный layout",
          "CTA-структура для конверсии",
          "Базовое SEO",
          "Базовая GEO / AIO-структура",
          "Оптимизация производительности",
          "FAQ-блок",
        ],
      },
    },
  },
  {
    order: 3,
    featured: false,
    translations: {
      de: {
        name: "Business Website",
        sub: "Mehrseitige Website für Sichtbarkeit, Vertrauen und Wachstum.",
        price: (prices) => prices.de.business,
        features: [
          "Mehrseitige Website",
          "Individuelle Seitenstruktur",
          "Leistungsseiten",
          "Kontakt- und Anfrageprozesse",
          "Basis-SEO",
          "GEO / AIO-Grundstruktur",
          "Local SEO Grundlagen",
          "Skalierbare Inhaltsstruktur",
        ],
      },
      en: {
        name: "Business Website",
        sub: "Multi-page website for visibility, trust and growth.",
        price: (prices) => prices.en.business,
        features: [
          "Multi-page website",
          "Custom page structure",
          "Service pages",
          "Contact and inquiry flows",
          "Basic SEO",
          "GEO / AIO foundation",
          "Local SEO basics",
          "Scalable content structure",
        ],
      },
      ru: {
        name: "Business Website",
        sub: "Многостраничный сайт для видимости, доверия и роста.",
        price: (prices) => prices.ru.business,
        features: [
          "Многостраничный сайт",
          "Индивидуальная структура страниц",
          "Страницы услуг",
          "Контактные и заявочные сценарии",
          "Базовое SEO",
          "GEO / AIO-основа",
          "Основы Local SEO",
          "Масштабируемая структура контента",
        ],
      },
    },
  },
  {
    order: 4,
    featured: false,
    translations: {
      de: {
        name: "Individuelles System",
        sub: "Für Shops, Portale, Buchung, Automatisierung und Spezialfunktionen.",
        price: () => "Individuelles Angebot",
        features: [
          "Konzept und technische Planung",
          "Individuelle UX- und Funktionsstruktur",
          "Skalierbare technische Basis",
          "Schnittstellenplanung",
          "SEO- und Performance-Grundlagen",
          "Launch- und Übergabeunterstützung",
        ],
      },
      en: {
        name: "Custom System",
        sub: "For shops, portals, booking, automation and special functions.",
        price: () => "Individual proposal",
        features: [
          "Concept and technical planning",
          "Custom UX and feature structure",
          "Scalable technical foundation",
          "Interface planning",
          "SEO and performance foundations",
          "Launch and handover support",
        ],
      },
      ru: {
        name: "Индивидуальная система",
        sub: "Для магазинов, порталов, записи, автоматизации и специальных функций.",
        price: () => "Индивидуальное предложение",
        features: [
          "Концепция и техническое планирование",
          "Индивидуальная UX- и функциональная структура",
          "Масштабируемая техническая база",
          "Планирование интеграций",
          "SEO- и performance-основа",
          "Поддержка запуска и передачи",
        ],
      },
    },
  },
];

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function findPlanByNameOrOrder(
  rows: Awaited<ReturnType<typeof readExistingPlanRows>>,
  terms: string[],
  fallbackOrder: number,
) {
  return (
    rows.find((row) =>
      row.translations.some((translation) => {
        const name = normalize(translation.name);
        return terms.some((term) => name.includes(term));
      }),
    ) ?? rows.find((row) => row.order === fallbackOrder)
  );
}

function priceFromPlan(
  row: Awaited<ReturnType<typeof readExistingPlanRows>>[number] | undefined,
  locale: Locale,
  fallback: string,
) {
  return row?.translations.find((translation) => translation.locale === locale)?.price || fallback;
}

async function readExistingPlanRows() {
  return prisma.pricingPlan.findMany({
    orderBy: { order: "asc" },
    include: { translations: true },
  });
}

async function readSavedPrices(): Promise<SavedPrices> {
  const rows = await readExistingPlanRows();
  const starter = findPlanByNameOrOrder(rows, ["starter"], 1);
  const business = findPlanByNameOrOrder(rows, ["business"], 2);

  return Object.fromEntries(
    locales.map((locale) => [
      locale,
      {
        starter: priceFromPlan(starter, locale, fallbackPrices[locale].starter),
        business: priceFromPlan(business, locale, fallbackPrices[locale].business),
      },
    ]),
  ) as SavedPrices;
}

async function findPlanId(order: number, deName: string) {
  const byOrder = await prisma.pricingPlan.findFirst({
    where: { order },
    select: { id: true },
  });
  if (byOrder) return byOrder.id;

  const byName = await prisma.pricingPlanTranslation.findFirst({
    where: { locale: "de", name: deName },
    select: { planId: true },
  });
  return byName?.planId ?? null;
}

async function syncPlans(savedPrices: SavedPrices) {
  const syncedIds: string[] = [];

  for (const plan of plans) {
    const translations = locales.map((locale) => {
      const translation = plan.translations[locale];
      return {
        locale,
        name: translation.name,
        sub: translation.sub,
        price: translation.price(savedPrices),
        features: translation.features,
      };
    });

    const id = await findPlanId(plan.order, plan.translations.de.name);
    const updateData = {
      featured: plan.featured,
      published: true,
      order: plan.order,
      translations: { deleteMany: {}, create: translations },
    };
    const createData = {
      featured: plan.featured,
      published: true,
      order: plan.order,
      translations: { create: translations },
    };

    const row = id
      ? await prisma.pricingPlan.update({ where: { id }, data: updateData, select: { id: true } })
      : await prisma.pricingPlan.create({ data: createData, select: { id: true } });
    syncedIds.push(row.id);
  }

  await prisma.pricingPlan.updateMany({
    where: { id: { notIn: syncedIds }, order: { gt: 4 } },
    data: { published: false },
  });
}

async function syncSeo() {
  const translations = locales.map((locale) => ({
    locale,
    title: pricingSeo[locale].title,
    description: pricingSeo[locale].description,
    ogImage: null,
  }));

  await prisma.sEOPage.upsert({
    where: { path: "/preise" },
    create: { path: "/preise", translations: { create: translations } },
    update: { translations: { deleteMany: {}, create: translations } },
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  const savedPrices = await readSavedPrices();
  await syncPlans(savedPrices);
  await syncSeo();

  const activePlans = await prisma.pricingPlan.count({ where: { published: true } });
  console.log("Phase 8 pricing content synced.", { activePlans, savedPrices });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
