import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const locales = ["de", "en", "ru"] as const;
type Locale = (typeof locales)[number];

const categoryTranslations: Record<Locale, string> = {
  de: "Restaurant · SEO",
  en: "Restaurant · SEO",
  ru: "Ресторан · SEO",
};

const translations: Record<
  Locale,
  {
    title: string;
    slug: string;
    challenge: string;
    solution: string;
    results: string;
  }
> = {
  de: {
    title: "Neue Liebe Nebra: Restaurant-Website mit Reservierungen",
    slug: "neue-liebe-nebra",
    challenge:
      "Neue Liebe brauchte für Restaurant, Terrasse, Tanz und Events einen digitalen Auftritt, der Atmosphäre vermittelt, Reservierungen einfacher macht und Gäste aus der Region direkt erreicht.",
    solution:
      "SaaleWeb entwickelte eine schnelle, responsive Website für https://www.neueliebe-nebra.de/ mit klarer Navigation, Speisekarte, Reservierungsfokus, hochwertiger Bildsprache und technischer SEO-Basis für lokale Suchanfragen rund um Nebra und die Region.",
    results:
      "Mehr Direktbuchungen, eine professionellere mobile Nutzerführung und ein Auftritt, der Restaurant, Speisekarte, Events und Kontaktwege deutlich vertrauensvoller präsentiert.",
  },
  en: {
    title: "Neue Liebe Nebra: restaurant website with reservations",
    slug: "neue-liebe-nebra",
    challenge:
      "Neue Liebe needed a digital presence for restaurant, terrace, dance and events that communicates atmosphere, makes reservations easier and reaches regional guests directly.",
    solution:
      "SaaleWeb built a fast, responsive website for https://www.neueliebe-nebra.de/ with clear navigation, menu presentation, reservation focus, premium imagery and a technical SEO foundation for local searches around Nebra and the region.",
    results:
      "More direct reservations, a stronger mobile user journey and a website that presents restaurant, menu, events and contact paths with more trust and clarity.",
  },
  ru: {
    title: "Neue Liebe Nebra: сайт ресторана с бронированиями",
    slug: "neue-liebe-nebra",
    challenge:
      "Neue Liebe нужен был цифровой сайт для ресторана, террасы, танцев и событий: передать атмосферу, упростить бронирование и напрямую привлекать гостей из региона.",
    solution:
      "SaaleWeb разработал быстрый адаптивный сайт для https://www.neueliebe-nebra.de/ с понятной навигацией, меню, акцентом на бронирование, премиальной визуальной подачей и технической SEO-базой для локального поиска вокруг Nebra и региона.",
    results:
      "Больше прямых бронирований, сильнее мобильный путь пользователя и сайт, который уверенно показывает ресторан, меню, события и контактные действия.",
  },
};

async function main() {
  const category = await prisma.projectCategory.upsert({
    where: { key: "restaurant-seo" },
    update: {},
    create: { key: "restaurant-seo" },
  });

  for (const locale of locales) {
    await prisma.projectCategoryTranslation.upsert({
      where: { categoryId_locale: { categoryId: category.id, locale } },
      update: { name: categoryTranslations[locale] },
      create: { categoryId: category.id, locale, name: categoryTranslations[locale] },
    });
  }

  const existingTranslation = await prisma.projectTranslation.findUnique({
    where: { locale_slug: { locale: "de", slug: translations.de.slug } },
    select: { projectId: true },
  });

  const data = {
    categoryId: category.id,
    coverColor: "#F8F1E4",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Local SEO", "Performance"],
    resultValue: "+176%",
    year: 2026,
    featured: true,
    published: true,
    order: 0,
  };

  const project = existingTranslation
    ? await prisma.project.update({
        where: { id: existingTranslation.projectId },
        data,
      })
    : await prisma.project.create({ data });

  for (const locale of locales) {
    await prisma.projectTranslation.upsert({
      where: { projectId_locale: { projectId: project.id, locale } },
      update: translations[locale],
      create: { projectId: project.id, locale, ...translations[locale] },
    });
  }

  await prisma.media.deleteMany({
    where: {
      projectId: project.id,
      url: "/images/cases/neue-liebe-nebra.webp",
    },
  });

  await prisma.media.create({
    data: {
      projectId: project.id,
      url: "/images/cases/neue-liebe-nebra.webp",
      alt: "Neue Liebe Nebra restaurant website responsive mockup",
      width: 1536,
      height: 1024,
      order: 0,
    },
  });

  console.log(`Upserted Neue Liebe project: ${project.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
