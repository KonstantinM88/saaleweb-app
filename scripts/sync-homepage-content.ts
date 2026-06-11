import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const locales = ["de", "en", "ru"] as const;
type Locale = (typeof locales)[number];

type ServiceItem = { title: string; desc: string };
type IndustryItem = { name: string; desc: string };
type CaseItem = { name: string; tag: string; title: string; desc: string; result: string };
type FaqItem = { q: string; a: string };
type HomeMessages = {
  Services: { items: ServiceItem[] };
  Industries: { items: IndustryItem[] };
  CaseStudies: { items: CaseItem[] };
  Faq: { items: FaqItem[] };
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function loadMessages(): Promise<Record<Locale, HomeMessages>> {
  const entries = await Promise.all(
    locales.map(async (locale) => {
      const file = path.join(root, "messages", `${locale}.json`);
      const json = JSON.parse(await readFile(file, "utf8")) as HomeMessages;
      return [locale, json] as const;
    }),
  );

  return Object.fromEntries(entries) as Record<Locale, HomeMessages>;
}

function itemAt<T>(items: T[], index: number, label: string, locale: Locale): T {
  const item = items[index];
  if (!item) throw new Error(`Missing ${label}[${index}] for locale ${locale}`);
  return item;
}

async function findServiceId(slugs: Record<Locale, string>) {
  const row = await prisma.serviceTranslation.findFirst({
    where: { OR: locales.map((locale) => ({ locale, slug: slugs[locale] })) },
    select: { serviceId: true },
  });
  return row?.serviceId ?? null;
}

async function findIndustryId(slugs: Record<Locale, string>) {
  const row = await prisma.industryTranslation.findFirst({
    where: { OR: locales.map((locale) => ({ locale, slug: slugs[locale] })) },
    select: { industryId: true },
  });
  return row?.industryId ?? null;
}

async function findProjectId(slugs: Record<Locale, string>) {
  const row = await prisma.projectTranslation.findFirst({
    where: { OR: locales.map((locale) => ({ locale, slug: slugs[locale] })) },
    select: { projectId: true },
  });
  return row?.projectId ?? null;
}

async function syncServices(messages: Record<Locale, HomeMessages>) {
  const items = [
    {
      icon: "code",
      slugs: { de: "website-entwicklung", en: "web-development", ru: "razrabotka-sajtov" },
    },
    {
      icon: "seo",
      slugs: { de: "seo-optimierung", en: "seo-optimization", ru: "seo-optimizaciya" },
    },
    {
      icon: "local",
      slugs: { de: "local-seo", en: "local-seo", ru: "lokalnoe-seo" },
    },
    {
      icon: "ai",
      slugs: { de: "ki-integration", en: "ai-integration", ru: "integraciya-ii" },
    },
    {
      icon: "relaunch",
      slugs: { de: "website-relaunch", en: "website-relaunch", ru: "relonch-sajta" },
    },
    {
      icon: "speed",
      slugs: { de: "performance", en: "performance", ru: "proizvoditelnost" },
    },
    {
      icon: "cloud",
      slugs: { de: "hosting", en: "hosting", ru: "hosting" },
    },
    {
      icon: "care",
      slugs: { de: "wartung", en: "maintenance", ru: "podderzhka" },
    },
    {
      icon: "strategy",
      slugs: { de: "digitalberatung", en: "digital-consulting", ru: "cifrovoj-konsalting" },
    },
  ] satisfies Array<{ icon: string; slugs: Record<Locale, string> }>;

  for (const [index, item] of items.entries()) {
    const translations = locales.map((locale) => {
      const message = itemAt(messages[locale].Services.items, index, "Services.items", locale);
      return {
        locale,
        name: message.title,
        slug: item.slugs[locale],
        excerpt: message.desc,
        content: message.desc,
      };
    });
    const topLevel = {
      icon: item.icon,
      order: index + 1,
      published: true,
    };

    const id = await findServiceId(item.slugs);
    if (id) {
      await prisma.service.update({
        where: { id },
        data: { ...topLevel, translations: { deleteMany: {}, create: translations } },
      });
    } else {
      await prisma.service.create({
        data: { ...topLevel, translations: { create: translations } },
      });
    }
  }
}

async function syncIndustries(messages: Record<Locale, HomeMessages>) {
  const items = [
    {
      emoji: "\u{1F3E8}",
      slugs: { de: "hotels", en: "hotels", ru: "oteli" },
    },
    {
      emoji: "\u{1F37D}\uFE0F",
      slugs: { de: "restaurants", en: "restaurants", ru: "restorany" },
    },
    {
      emoji: "\u{1F487}",
      slugs: { de: "beauty-salons", en: "beauty-salons", ru: "beauty-salony" },
    },
    {
      emoji: "\u{1F3D7}\uFE0F",
      slugs: { de: "bau", en: "construction", ru: "stroitelstvo" },
    },
    {
      emoji: "\u{1F527}",
      slugs: { de: "handwerk", en: "craftsmen", ru: "remeslenniki" },
    },
    {
      emoji: "\u{1FA7A}",
      slugs: { de: "arztpraxen", en: "medical-practices", ru: "medcentry" },
    },
    {
      emoji: "\u{1F3E0}",
      slugs: { de: "immobilien", en: "real-estate", ru: "nedvizhimost" },
    },
    {
      emoji: "\u2696\uFE0F",
      slugs: { de: "kanzleien", en: "law-firms", ru: "yuristy" },
    },
  ] satisfies Array<{ emoji: string; slugs: Record<Locale, string> }>;

  for (const [index, item] of items.entries()) {
    const translations = locales.map((locale) => {
      const message = itemAt(messages[locale].Industries.items, index, "Industries.items", locale);
      return {
        locale,
        name: message.name,
        slug: item.slugs[locale],
        excerpt: message.desc,
        content: message.desc,
      };
    });
    const topLevel = {
      emoji: item.emoji,
      order: index + 1,
      published: true,
    };

    const id = await findIndustryId(item.slugs);
    if (id) {
      await prisma.industry.update({
        where: { id },
        data: { ...topLevel, translations: { deleteMany: {}, create: translations } },
      });
    } else {
      await prisma.industry.create({
        data: { ...topLevel, translations: { create: translations } },
      });
    }
  }
}

async function syncFaq(messages: Record<Locale, HomeMessages>) {
  const oldSeedQuestions = [
    "Was kostet eine Website?",
    "What does a website cost?",
    "Сколько стоит сайт?",
  ];

  for (let index = 0; index < messages.de.Faq.items.length; index += 1) {
    const desiredQuestions = locales.map((locale) =>
      itemAt(messages[locale].Faq.items, index, "Faq.items", locale).q,
    );

    const existingByQuestion = await prisma.faqTranslation.findFirst({
      where: {
        OR: [
          ...locales.map((locale, localeIndex) => ({
            locale,
            question: desiredQuestions[localeIndex],
          })),
          ...(index === 0 ? oldSeedQuestions.map((question) => ({ question })) : []),
        ],
      },
      select: { faqId: true },
    });
    const existingByOrder = existingByQuestion
      ? null
      : await prisma.faq.findFirst({
          where: { category: "homepage", order: index + 1 },
          select: { id: true },
        });

    const translations = locales.map((locale) => {
      const message = itemAt(messages[locale].Faq.items, index, "Faq.items", locale);
      return { locale, question: message.q, answer: message.a };
    });
    const topLevel = {
      category: "homepage",
      order: index + 1,
      published: true,
    };

    const id = existingByQuestion?.faqId ?? existingByOrder?.id ?? null;
    if (id) {
      await prisma.faq.update({
        where: { id },
        data: { ...topLevel, translations: { deleteMany: {}, create: translations } },
      });
    } else {
      await prisma.faq.create({
        data: { ...topLevel, translations: { create: translations } },
      });
    }
  }
}

async function syncProjectCategories(messages: Record<Locale, HomeMessages>) {
  const keys = ["beauty-nextjs", "hotel-seo", "construction-local-seo"];
  const ids: string[] = [];

  for (const [index, key] of keys.entries()) {
    const category = await prisma.projectCategory.upsert({
      where: { key },
      update: {
        translations: {
          deleteMany: {},
          create: locales.map((locale) => {
            const message = itemAt(messages[locale].CaseStudies.items, index, "CaseStudies.items", locale);
            return { locale, name: message.tag };
          }),
        },
      },
      create: {
        key,
        translations: {
          create: locales.map((locale) => {
            const message = itemAt(messages[locale].CaseStudies.items, index, "CaseStudies.items", locale);
            return { locale, name: message.tag };
          }),
        },
      },
      select: { id: true },
    });
    ids.push(category.id);
  }

  return ids;
}

async function syncProjects(messages: Record<Locale, HomeMessages>, categoryIds: string[]) {
  const items = [
    {
      slugs: {
        de: "online-buchungen-verdreifacht",
        en: "online-bookings-tripled",
        ru: "onlajn-zapisi-vyrosli-vtroe",
      },
      coverColor: "bg-brand",
      technologies: ["Next.js", "Local SEO"],
    },
    {
      slugs: {
        de: "direktbuchungen-ohne-portale",
        en: "direct-bookings-without-portals",
        ru: "pryamye-broni-bez-agregatorov",
      },
      coverColor: "bg-gradient-to-br from-sky-500 to-brand-purple",
      technologies: ["SEO", "Performance"],
    },
    {
      slugs: {
        de: "qualifizierte-bauanfragen",
        en: "qualified-construction-leads",
        ru: "kvalificirovannye-zayavki",
      },
      coverColor: "bg-gradient-to-br from-amber-500 to-brand-pink",
      technologies: ["Local SEO", "Content"],
    },
  ] satisfies Array<{
    slugs: Record<Locale, string>;
    coverColor: string;
    technologies: string[];
  }>;

  for (const [index, item] of items.entries()) {
    const translations = locales.map((locale) => {
      const message = itemAt(messages[locale].CaseStudies.items, index, "CaseStudies.items", locale);
      return {
        locale,
        title: message.title,
        slug: item.slugs[locale],
        challenge: message.desc,
        solution: "",
        results: message.result,
      };
    });
    const topLevel = {
      categoryId: categoryIds[index],
      coverColor: item.coverColor,
      technologies: item.technologies,
      resultValue: itemAt(messages.de.CaseStudies.items, index, "CaseStudies.items", "de").result,
      year: null,
      featured: true,
      published: true,
      order: index + 1,
    };

    const id = await findProjectId(item.slugs);
    if (id) {
      await prisma.project.update({
        where: { id },
        data: { ...topLevel, translations: { deleteMany: {}, create: translations } },
      });
    } else {
      await prisma.project.create({
        data: { ...topLevel, translations: { create: translations } },
      });
    }
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  const messages = await loadMessages();
  await syncServices(messages);
  await syncIndustries(messages);
  await syncFaq(messages);
  const categoryIds = await syncProjectCategories(messages);
  await syncProjects(messages, categoryIds);

  const [services, industries, faq, projects] = await Promise.all([
    prisma.service.count({ where: { published: true } }),
    prisma.industry.count({ where: { published: true } }),
    prisma.faq.count({ where: { published: true } }),
    prisma.project.count({ where: { published: true } }),
  ]);

  console.log("Homepage content synced.", { services, industries, faq, projects });
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
