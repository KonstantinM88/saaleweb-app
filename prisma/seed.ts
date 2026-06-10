import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function unique(values: string[]) {
  return [...new Set(values)];
}

async function resetSeededContent() {
  const seededServiceIds = await prisma.serviceTranslation.findMany({
    where: { slug: { in: ["website-entwicklung", "web-development", "razrabotka-sajtov"] } },
    select: { serviceId: true },
  });
  await prisma.service.deleteMany({
    where: { id: { in: unique(seededServiceIds.map((item) => item.serviceId)) } },
  });

  const seededTestimonialIds = await prisma.testimonialTranslation.findMany({
    where: { company: "Salon Elen" },
    select: { testimonialId: true },
  });
  await prisma.testimonial.deleteMany({
    where: { id: { in: unique(seededTestimonialIds.map((item) => item.testimonialId)) } },
  });

  const seededFaqIds = await prisma.faqTranslation.findMany({
    where: {
      question: {
        in: [
          "Was kostet eine Website?",
          "What does a website cost?",
          "Сколько стоит сайт?",
        ],
      },
    },
    select: { faqId: true },
  });
  await prisma.faq.deleteMany({
    where: { id: { in: unique(seededFaqIds.map((item) => item.faqId)) } },
  });

  const seededBlogPostIds = await prisma.blogPostTranslation.findMany({
    where: {
      slug: {
        in: [
          "lokales-seo-halle",
          "local-seo-halle",
          "lokalnoe-seo-halle",
          "nextjs-vs-wordpress",
        ],
      },
    },
    select: { postId: true },
  });
  await prisma.blogPost.deleteMany({
    where: { id: { in: unique(seededBlogPostIds.map((item) => item.postId)) } },
  });
}

async function seedUser() {
  await prisma.user.upsert({
    where: { email: "konstantin@saaleweb.de" },
    update: { name: "Konstantin Mykhailov", role: "ADMIN" },
    create: {
      email: "konstantin@saaleweb.de",
      name: "Konstantin Mykhailov",
      role: "ADMIN",
    },
  });
}

async function seedService() {
  await prisma.service.create({
    data: {
      icon: "code",
      order: 1,
      translations: {
        create: [
          {
            locale: "de",
            name: "Website Entwicklung",
            slug: "website-entwicklung",
            excerpt: "Schnelle, moderne Websites mit Next.js.",
          },
          {
            locale: "en",
            name: "Web Development",
            slug: "web-development",
            excerpt: "Fast, modern websites with Next.js.",
          },
          {
            locale: "ru",
            name: "Разработка сайтов",
            slug: "razrabotka-sajtov",
            excerpt: "Быстрые современные сайты на Next.js.",
          },
        ],
      },
    },
  });
}

async function seedTestimonial() {
  await prisma.testimonial.create({
    data: {
      rating: 5,
      order: 1,
      translations: {
        create: [
          {
            locale: "de",
            quote: "Unsere Buchungen haben sich verdreifacht.",
            clientName: "Elena L.",
            company: "Salon Elen",
          },
          {
            locale: "en",
            quote: "Our bookings tripled.",
            clientName: "Elena L.",
            company: "Salon Elen",
          },
          {
            locale: "ru",
            quote: "Наши записи выросли втрое.",
            clientName: "Елена Л.",
            company: "Salon Elen",
          },
        ],
      },
    },
  });
}

async function seedFaq() {
  await prisma.faq.create({
    data: {
      order: 1,
      category: "pricing",
      translations: {
        create: [
          {
            locale: "de",
            question: "Was kostet eine Website?",
            answer: "Eine Landingpage startet bei 990 EUR.",
          },
          {
            locale: "en",
            question: "What does a website cost?",
            answer: "A landing page starts at EUR 990.",
          },
          {
            locale: "ru",
            question: "Сколько стоит сайт?",
            answer: "Лендинг стоит от 990 EUR.",
          },
        ],
      },
    },
  });
}

async function seedBlogAuthor() {
  const existingAuthor = await prisma.author.findFirst({
    where: { name: { in: ["Konstantin Mykhailov", "Konstantin Michailow"] } },
    select: { id: true },
  });

  if (existingAuthor) {
    return prisma.author.update({
      where: { id: existingAuthor.id },
      data: {
        name: "Konstantin Mykhailov",
        translations: {
          deleteMany: {},
          create: [
            { locale: "de", role: "Gründer", bio: "Webentwickler und Gründer von SaaleWeb." },
            { locale: "en", role: "Founder", bio: "Web developer and founder of SaaleWeb." },
            { locale: "ru", role: "Основатель", bio: "Веб-разработчик и основатель SaaleWeb." },
          ],
        },
      },
    });
  }

  return prisma.author.create({
    data: {
      name: "Konstantin Mykhailov",
      translations: {
        create: [
          { locale: "de", role: "Gründer", bio: "Webentwickler und Gründer von SaaleWeb." },
          { locale: "en", role: "Founder", bio: "Web developer and founder of SaaleWeb." },
          { locale: "ru", role: "Основатель", bio: "Веб-разработчик и основатель SaaleWeb." },
        ],
      },
    },
  });
}

async function seedBlogCategory() {
  return prisma.blogCategory.upsert({
    where: { key: "seo" },
    update: {
      translations: {
        deleteMany: {},
        create: [
          { locale: "de", name: "SEO", slug: "seo" },
          { locale: "en", name: "SEO", slug: "seo" },
          { locale: "ru", name: "SEO", slug: "seo" },
        ],
      },
    },
    create: {
      key: "seo",
      translations: {
        create: [
          { locale: "de", name: "SEO", slug: "seo" },
          { locale: "en", name: "SEO", slug: "seo" },
          { locale: "ru", name: "SEO", slug: "seo" },
        ],
      },
    },
  });
}

async function seedBlogPosts(authorId: string, categoryId: string) {
  await prisma.blogPost.create({
    data: {
      authorId,
      categoryId,
      published: true,
      publishedAt: new Date(),
      readingTime: 4,
      translations: {
        create: [
          {
            locale: "de",
            title: "Lokales SEO für Unternehmen in Halle",
            slug: "lokales-seo-halle",
            excerpt: "So werden lokale Unternehmen bei Google und in KI-Suchen gefunden.",
            content:
              "## Warum lokales SEO?\n\nKunden suchen heute zuerst online. Wer lokal sichtbar ist, gewinnt Anfragen.\n\n## Die wichtigsten Hebel\n\n- Google Unternehmensprofil\n- Bewertungen\n- Lokale Inhalte\n\n## Fazit\n\nLokales SEO ist die Grundlage für planbares Wachstum.",
          },
          {
            locale: "en",
            title: "Local SEO for businesses in Halle",
            slug: "local-seo-halle",
            excerpt: "How local businesses get found on Google and in AI search.",
            content:
              "## Why local SEO?\n\nCustomers search online first. Visibility means inquiries.\n\n## Key levers\n\n- Google Business Profile\n- Reviews\n- Local content\n\n## Conclusion\n\nLocal SEO is the foundation for predictable growth.",
          },
          {
            locale: "ru",
            title: "Локальное SEO для бизнеса в Галле",
            slug: "lokalnoe-seo-halle",
            excerpt: "Как локальному бизнесу находиться в Google и AI-поиске.",
            content:
              "## Зачем локальное SEO?\n\nКлиенты сначала ищут онлайн. Видимость означает заявки.\n\n## Главные рычаги\n\n- Профиль в Google\n- Отзывы\n- Локальный контент\n\n## Итог\n\nЛокальное SEO - основа предсказуемого роста.",
          },
        ],
      },
    },
  });

  await prisma.blogPost.create({
    data: {
      authorId,
      categoryId,
      published: true,
      publishedAt: new Date(Date.now() - 86400000),
      readingTime: 5,
      translations: {
        create: [
          {
            locale: "de",
            title: "Warum Next.js die bessere Basis als WordPress ist",
            slug: "nextjs-vs-wordpress",
            excerpt: "Performance, Sicherheit und SEO im direkten Vergleich.",
            content:
              "## Performance\n\nNext.js liefert Inhalte blitzschnell aus.\n\n## Sicherheit\n\nKeine veralteten Plugins, kleinere Angriffsfläche.\n\n## SEO\n\nSauberes HTML und Schema-Daten von Anfang an.",
          },
          {
            locale: "en",
            title: "Why Next.js is a better base than WordPress",
            slug: "nextjs-vs-wordpress",
            excerpt: "Performance, security and SEO compared directly.",
            content:
              "## Performance\n\nNext.js serves content lightning-fast.\n\n## Security\n\nNo outdated plugins, smaller attack surface.\n\n## SEO\n\nClean HTML and schema data from the start.",
          },
          {
            locale: "ru",
            title: "Почему Next.js лучше как основа, чем WordPress",
            slug: "nextjs-vs-wordpress",
            excerpt: "Производительность, безопасность и SEO в прямом сравнении.",
            content:
              "## Производительность\n\nNext.js отдает контент очень быстро.\n\n## Безопасность\n\nНет устаревших плагинов, меньше поверхность атаки.\n\n## SEO\n\nЧистый HTML и schema-данные с самого начала.",
          },
        ],
      },
    },
  });
}

async function main() {
  await seedUser();
  await resetSeededContent();
  await seedService();
  await seedTestimonial();
  await seedFaq();

  const author = await seedBlogAuthor();
  const seoCategory = await seedBlogCategory();
  await seedBlogPosts(author.id, seoCategory.id);

  console.log("Seed complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
