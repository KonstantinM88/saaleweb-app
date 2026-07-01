import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const locales = ["de", "en", "ru"] as const;
type Locale = (typeof locales)[number];

type ProjectConfig = {
  categoryKey: string;
  categoryTranslations: Record<Locale, string>;
  coverColor: string;
  technologies: string[];
  resultValue: string;
  year: number;
  order: number;
  media?: Array<{
    url: string;
    alt: string;
    width: number;
    height: number;
    order: number;
  }>;
  translations: Record<
    Locale,
    {
      title: string;
      slug: string;
      challenge: string;
      solution: string;
      results: string;
    }
  >;
};

const projects: ProjectConfig[] = [
  {
    categoryKey: "beauty-booking-local-seo",
    categoryTranslations: {
      de: "Beauty · Booking · Local SEO",
      en: "Beauty · Booking · Local SEO",
      ru: "Beauty · Booking · Local SEO",
    },
    coverColor: "bg-brand",
    technologies: ["Next.js", "Booking UX", "Local SEO", "Mehrsprachigkeit", "Performance"],
    resultValue: "+212%",
    year: 2026,
    order: 0,
    translations: {
      de: {
        title: "Salon Elen / Permanent Halle – digitale Lösung für Beauty Studio",
        slug: "online-buchungen-verdreifacht",
        challenge:
          "Viele Unternehmen haben bereits eine Website, aber sie unterstützt den Geschäftsalltag nicht aktiv genug. Bei Salon Elen / Permanent Halle ging es darum, Leistungen besser zu erklären, Vertrauen aufzubauen und mehr Online-Termine sowie lokale Sichtbarkeit in Halle zu ermöglichen.",
        solution:
          "Für https://permanent-halle.de/ wurde eine moderne Website-Struktur entwickelt, die Inhalte klar präsentiert, mobil sehr gut funktioniert und auf Suchmaschinen sowie Nutzererfahrung ausgerichtet ist. Die Nutzerführung legt den Fokus auf Leistungen, Terminlogik und verständliche Kontaktwege.",
        results:
          "Ein professioneller Beauty-Auftritt mit digitaler Terminlogik, klarer Leistungsstruktur und mehrsprachiger Nutzerführung.",
      },
      en: {
        title: "Salon Elen / Permanent Halle – digital solution for a beauty studio",
        slug: "online-bookings-tripled",
        challenge:
          "Many businesses already have a website, but it does not actively support daily operations enough. For Salon Elen / Permanent Halle, the goal was to explain services more clearly, build trust and enable more online appointments and local visibility in Halle.",
        solution:
          "For https://permanent-halle.de/, a modern website structure was developed to present content clearly, work very well on mobile and support both search visibility and user experience. The user journey focuses on services, appointment logic and clear contact paths.",
        results:
          "A professional beauty presence with digital appointment logic, clear service structure and multilingual user guidance.",
      },
      ru: {
        title: "Salon Elen / Permanent Halle – цифровое решение для Beauty Studio",
        slug: "onlajn-zapisi-vyrosli-vtroe",
        challenge:
          "У многих компаний уже есть сайт, но он недостаточно активно помогает в повседневной работе. Для Salon Elen / Permanent Halle целью было понятнее показать услуги, усилить доверие и получить больше онлайн-записей и локальной видимости в Галле.",
        solution:
          "Для https://permanent-halle.de/ была разработана современная структура сайта, которая ясно представляет контент, хорошо работает на мобильных устройствах и учитывает поисковую видимость и пользовательский опыт. Пользовательский путь сфокусирован на услугах, логике записи и понятных контактных действиях.",
        results:
          "Профессиональное beauty-присутствие с цифровой логикой записи, понятной структурой услуг и многоязычным пользовательским путём.",
      },
    },
  },
  {
    categoryKey: "restaurant-seo-mobile",
    categoryTranslations: {
      de: "Restaurant · SEO · Mobile First",
      en: "Restaurant · SEO · Mobile First",
      ru: "Restaurant · SEO · Mobile First",
    },
    coverColor: "#F8F1E4",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Local SEO", "Performance"],
    resultValue: "+176%",
    year: 2026,
    order: 1,
    translations: {
      de: {
        title: "Neue Liebe – digitale Lösung für Gastronomie",
        slug: "neue-liebe-nebra",
        challenge:
          "Viele Unternehmen haben bereits eine Website, aber sie unterstützt den Geschäftsalltag nicht aktiv genug. Bei Neue Liebe ging es darum, Atmosphäre, Restaurant, Terrasse, Speisekarte und Events professionell zu präsentieren und Reservierungen zu erleichtern.",
        solution:
          "Für dieses Projekt wurde eine moderne Website-Struktur für https://www.neueliebe-nebra.de/ entwickelt, die Inhalte klar präsentiert, mobil sehr gut funktioniert und auf Suchmaschinen sowie Nutzererfahrung ausgerichtet ist.",
        results:
          "Ein moderner Restaurantauftritt, der Atmosphäre, aktuelle Inhalte und mobile Nutzerführung verbindet.",
      },
      en: {
        title: "Neue Liebe – digital solution for gastronomy",
        slug: "neue-liebe-nebra",
        challenge:
          "Many businesses already have a website, but it does not actively support daily operations enough. For Neue Liebe, the goal was to present atmosphere, restaurant, terrace, menu and events professionally and make reservations easier.",
        solution:
          "A modern website structure was developed for https://www.neueliebe-nebra.de/ to present content clearly, work very well on mobile and support both search visibility and user experience.",
        results:
          "A modern restaurant presence that connects atmosphere, current content and mobile user guidance.",
      },
      ru: {
        title: "Neue Liebe – цифровое решение для гастрономии",
        slug: "neue-liebe-nebra",
        challenge:
          "У многих компаний уже есть сайт, но он недостаточно активно помогает в повседневной работе. Для Neue Liebe целью было профессионально представить атмосферу, ресторан, террасу, меню и события, а также упростить бронирование.",
        solution:
          "Для проекта была разработана современная структура сайта https://www.neueliebe-nebra.de/, которая ясно представляет контент, хорошо работает на мобильных устройствах и учитывает поисковую видимость и пользовательский опыт.",
        results:
          "Современная презентация ресторана, которая соединяет атмосферу, актуальный контент и удобный мобильный путь.",
      },
    },
  },
  {
    categoryKey: "hotel-restaurant-bookings",
    categoryTranslations: {
      de: "Hotel · Restaurant · Buchungen",
      en: "Hotel · Restaurant · Bookings",
      ru: "Hotel · Restaurant · Booking",
    },
    coverColor: "bg-gradient-to-br from-sky-500 to-brand-purple",
    technologies: ["SEO", "Performance", "Content-Struktur", "Mobile UX"],
    resultValue: "+148%",
    year: 2026,
    order: 2,
    translations: {
      de: {
        title: "Waldschlösschen – digitale Lösung für Hotel & Restaurant",
        slug: "direktbuchungen-ohne-portale",
        challenge:
          "Viele Unternehmen haben bereits eine Website, aber sie unterstützt den Geschäftsalltag nicht aktiv genug. Beim Waldschlösschen ging es darum, Hotel, Restaurant und Angebote hochwertiger zu präsentieren und mehr Direktbuchungen zu unterstützen.",
        solution:
          "Für dieses Projekt wurde eine moderne Website-Struktur entwickelt, die Inhalte klar präsentiert, mobil sehr gut funktioniert und auf Suchmaschinen sowie Nutzererfahrung ausgerichtet ist.",
        results:
          "Ein hochwertiger Hotel- und Restaurantauftritt mit Fokus auf Angebote, Buchungen und regionale Sichtbarkeit.",
      },
      en: {
        title: "Waldschlösschen – digital solution for hotel & restaurant",
        slug: "direct-bookings-without-portals",
        challenge:
          "Many businesses already have a website, but it does not actively support daily operations enough. For Waldschlösschen, the goal was to present hotel, restaurant and offers at a higher quality and support more direct bookings.",
        solution:
          "A modern website structure was developed to present content clearly, work very well on mobile and support both search visibility and user experience.",
        results:
          "A premium hotel and restaurant presence focused on offers, bookings and regional visibility.",
      },
      ru: {
        title: "Waldschlösschen – цифровое решение для отеля и ресторана",
        slug: "pryamye-broni-bez-agregatorov",
        challenge:
          "У многих компаний уже есть сайт, но он недостаточно активно помогает в повседневной работе. Для Waldschlösschen целью было качественнее представить отель, ресторан и предложения, а также поддержать больше прямых бронирований.",
        solution:
          "Для проекта была разработана современная структура сайта, которая ясно представляет контент, хорошо работает на мобильных устройствах и учитывает поисковую видимость и пользовательский опыт.",
        results:
          "Качественное присутствие отеля и ресторана с фокусом на предложения, бронирования и региональную видимость.",
      },
    },
  },
  {
    categoryKey: "construction-trust-inquiries",
    categoryTranslations: {
      de: "Bau · Vertrauen · Anfragen",
      en: "Construction · Trust · Inquiries",
      ru: "Bau · Vertrauen · Anfragen",
    },
    coverColor: "bg-gradient-to-br from-amber-500 to-brand-pink",
    technologies: ["Local SEO", "Content-Struktur", "Performance", "Conversion UX"],
    resultValue: "Platz 1",
    year: 2026,
    order: 3,
    translations: {
      de: {
        title: "SorgfaltBau – digitale Lösung für Bauunternehmen",
        slug: "qualifizierte-bauanfragen",
        challenge:
          "Viele Unternehmen haben bereits eine Website, aber sie unterstützt den Geschäftsalltag nicht aktiv genug. Bei SorgfaltBau ging es darum, Leistungen verständlich zu präsentieren, Vertrauen aufzubauen und qualifizierte Anfragen zu erleichtern.",
        solution:
          "Für https://www.sorgfaltbau.de/de wurde eine moderne Website-Struktur entwickelt, die Inhalte klar präsentiert, mobil sehr gut funktioniert und auf Suchmaschinen sowie Nutzererfahrung ausgerichtet ist.",
        results:
          "Ein professioneller Bauunternehmer-Auftritt, der Leistungen verständlich präsentiert und Vertrauen aufbaut.",
      },
      en: {
        title: "SorgfaltBau – digital solution for a construction company",
        slug: "qualified-construction-leads",
        challenge:
          "Many businesses already have a website, but it does not actively support daily operations enough. For SorgfaltBau, the goal was to present services clearly, build trust and make qualified inquiries easier.",
        solution:
          "For https://www.sorgfaltbau.de/de, a modern website structure was developed to present content clearly, work very well on mobile and support both search visibility and user experience.",
        results:
          "A professional construction company presence that explains services clearly and builds trust.",
      },
      ru: {
        title: "SorgfaltBau – цифровое решение для строительной компании",
        slug: "kvalificirovannye-zayavki",
        challenge:
          "У многих компаний уже есть сайт, но он недостаточно активно помогает в повседневной работе. Для SorgfaltBau целью было понятно представить услуги, сформировать доверие и облегчить получение качественных заявок.",
        solution:
          "Для https://www.sorgfaltbau.de/de была разработана современная структура сайта, которая ясно представляет контент, хорошо работает на мобильных устройствах и учитывает поисковую видимость и пользовательский опыт.",
        results:
          "Профессиональное присутствие строительной компании, которое понятно представляет услуги и формирует доверие.",
      },
    },
  },
  {
    categoryKey: "craft-services-local-seo",
    categoryTranslations: {
      de: "Handwerk · Leistungen · Local SEO",
      en: "Trades · Services · Local SEO",
      ru: "Handwerk · Leistungen · Local SEO",
    },
    coverColor: "bg-gradient-to-br from-slate-700 to-brand-purple",
    technologies: ["WordPress", "Local SEO", "Content-Struktur", "Mobile UX"],
    resultValue: "Local SEO",
    year: 2026,
    order: 4,
    media: [
      {
        url: "/images/cases/glaserei-schubert.webp",
        alt: "Glaserei Schubert website project preview by SaaleWeb",
        width: 1448,
        height: 1086,
        order: 0,
      },
    ],
    translations: {
      de: {
        title: "Glaserei Schubert – digitale Lösung für Handwerk / Glaserei",
        slug: "glaserei-schubert",
        challenge:
          "Viele Unternehmen haben bereits eine Website, aber sie unterstützt den Geschäftsalltag nicht aktiv genug. Bei Glaserei Schubert stand eine hochwertige Präsentation von Leistungen und Referenzen im Mittelpunkt.",
        solution:
          "Für Glaserei Schubert wurde unter https://glaserei-schubert-01.vercel.app/de eine interaktive Projektvorschau erstellt: eine moderne Website-Struktur, die Leistungen, Referenzen und Kontaktwege klar präsentiert, mobil sehr gut funktioniert und auf lokale Sichtbarkeit ausgerichtet ist.",
        results:
          "Ein moderner Handwerksauftritt mit klarer Leistungsdarstellung und professioneller Außenwirkung.",
      },
      en: {
        title: "Glaserei Schubert – digital solution for trades / glazing",
        slug: "glaserei-schubert",
        challenge:
          "Many businesses already have a website, but it does not actively support daily operations enough. For Glaserei Schubert, the focus was a high-quality presentation of services and references.",
        solution:
          "For Glaserei Schubert, an interactive project preview was created at https://glaserei-schubert-01.vercel.app/de: a modern website structure that presents services, references and contact paths clearly, works very well on mobile and supports local visibility.",
        results:
          "A modern trade-business presence with clear service presentation and professional external impact.",
      },
      ru: {
        title: "Glaserei Schubert – цифровое решение для ремесла / стекольных работ",
        slug: "glaserei-schubert",
        challenge:
          "У многих компаний уже есть сайт, но он недостаточно активно помогает в повседневной работе. Для Glaserei Schubert в центре была качественная презентация услуг и референсов.",
        solution:
          "Для Glaserei Schubert подготовлена интерактивная проектная превью-страница https://glaserei-schubert-01.vercel.app/de: современная структура сайта, которая ясно показывает услуги, референсы и контактные пути, хорошо работает на мобильных устройствах и поддерживает локальную видимость.",
        results:
          "Современное присутствие ремесленной компании с понятной структурой услуг и профессиональным внешним образом.",
      },
    },
  },
];

async function upsertCategory(config: ProjectConfig) {
  const category = await prisma.projectCategory.upsert({
    where: { key: config.categoryKey },
    update: {},
    create: { key: config.categoryKey },
  });

  for (const locale of locales) {
    await prisma.projectCategoryTranslation.upsert({
      where: { categoryId_locale: { categoryId: category.id, locale } },
      update: { name: config.categoryTranslations[locale] },
      create: { categoryId: category.id, locale, name: config.categoryTranslations[locale] },
    });
  }

  return category.id;
}

async function upsertProject(config: ProjectConfig) {
  const categoryId = await upsertCategory(config);
  const existingTranslation = await prisma.projectTranslation.findFirst({
    where: {
      OR: locales.map((locale) => ({
        locale,
        slug: config.translations[locale].slug,
      })),
    },
    select: { projectId: true },
  });

  const data = {
    categoryId,
    coverColor: config.coverColor,
    technologies: config.technologies,
    resultValue: config.resultValue,
    year: config.year,
    featured: true,
    published: true,
    order: config.order,
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
      update: config.translations[locale],
      create: { projectId: project.id, locale, ...config.translations[locale] },
    });
  }

  if (config.media?.length) {
    const mediaUrls = config.media.map((media) => media.url);

    await prisma.media.updateMany({
      where: {
        projectId: project.id,
        url: { notIn: mediaUrls },
      },
      data: { order: 20 },
    });

    for (const media of config.media) {
      const existingMedia = await prisma.media.findFirst({
        where: { projectId: project.id, url: media.url },
        select: { id: true },
      });

      if (existingMedia) {
        await prisma.media.update({
          where: { id: existingMedia.id },
          data: media,
        });
      } else {
        await prisma.media.create({
          data: { projectId: project.id, ...media },
        });
      }
    }
  }

  return project.id;
}

async function main() {
  for (const project of projects) {
    const id = await upsertProject(project);
    console.log(`Upserted ${project.translations.de.slug}: ${id}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
