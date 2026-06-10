import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function unique(values: string[]) {
  return [...new Set(values)];
}

async function main() {
  await prisma.user.upsert({
    where: { email: "konstantin@saaleweb.de" },
    update: {},
    create: {
      email: "konstantin@saaleweb.de",
      name: "Konstantin Mykhailov",
      role: "ADMIN",
    },
  });

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
    where: { question: { in: ["Was kostet eine Website?", "What does a website cost?"] } },
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

  await prisma.service.create({
    data: {
      icon: "code",
      order: 1,
      translations: {
        create: [
          { locale: "de", name: "Website Entwicklung", slug: "website-entwicklung", excerpt: "Schnelle, moderne Websites mit Next.js." },
          { locale: "en", name: "Web Development", slug: "web-development", excerpt: "Fast, modern websites with Next.js." },
          { locale: "ru", name: "Р Р°Р·СЂР°Р±РѕС‚РєР° СЃР°Р№С‚РѕРІ", slug: "razrabotka-sajtov", excerpt: "Р‘С‹СЃС‚СЂС‹Рµ СЃРѕРІСЂРµРјРµРЅРЅС‹Рµ СЃР°Р№С‚С‹ РЅР° Next.js." },
        ],
      },
    },
  });

  await prisma.testimonial.create({
    data: {
      rating: 5,
      order: 1,
      translations: {
        create: [
          { locale: "de", quote: "Unsere Buchungen haben sich verdreifacht.", clientName: "Elena L.", company: "Salon Elen" },
          { locale: "en", quote: "Our bookings tripled.", clientName: "Elena L.", company: "Salon Elen" },
          { locale: "ru", quote: "РќР°С€Рё Р·Р°РїРёСЃРё РІС‹СЂРѕСЃР»Рё РІС‚СЂРѕРµ.", clientName: "Р•Р»РµРЅР° Р›.", company: "Salon Elen" },
        ],
      },
    },
  });

  await prisma.faq.create({
    data: {
      order: 1,
      category: "pricing",
      translations: {
        create: [
          { locale: "de", question: "Was kostet eine Website?", answer: "Eine Landingpage startet bei 990 в‚¬." },
          { locale: "en", question: "What does a website cost?", answer: "A landing page starts at в‚¬990." },
          { locale: "ru", question: "РЎРєРѕР»СЊРєРѕ СЃС‚РѕРёС‚ СЃР°Р№С‚?", answer: "Р›РµРЅРґРёРЅРі вЂ” РѕС‚ 990 в‚¬." },
        ],
      },
    },
  });

  // --- Blog ---
  const existingAuthor = await prisma.author.findFirst({
    where: { name: { in: ["Konstantin Mykhailov", "Konstantin Michailow"] } },
    select: { id: true },
  });
  const author = existingAuthor
    ? await prisma.author.update({
        where: { id: existingAuthor.id },
        data: { name: "Konstantin Mykhailov" },
      })
    : await prisma.author.create({
        data: {
          name: "Konstantin Mykhailov",
          translations: {
            create: [
              { locale: "de", role: "Gruender", bio: "Webentwickler & Gruender von SaaleWeb." },
              { locale: "en", role: "Founder", bio: "Web developer & founder of SaaleWeb." },
              { locale: "ru", role: "Osnovatel", bio: "Web developer and founder of SaaleWeb." },
            ],
          },
        },
      });

  const seoCategory = await prisma.blogCategory.upsert({
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

  await prisma.blogPost.create({
    data: {
      authorId: author.id,
      categoryId: seoCategory.id,
      published: true,
      publishedAt: new Date(),
      readingTime: 4,
      translations: {
        create: [
          {
            locale: "de",
            title: "Lokales SEO fГјr Unternehmen in Halle",
            slug: "lokales-seo-halle",
            excerpt: "So werden lokale Unternehmen bei Google und in KI-Suchen gefunden.",
            content:
              "## Warum lokales SEO?\n\nKunden suchen heute zuerst online. Wer lokal sichtbar ist, gewinnt Anfragen.\n\n## Die wichtigsten Hebel\n\n- Google Unternehmensprofil\n- Bewertungen\n- Lokale Inhalte\n\n## Fazit\n\nLokales SEO ist die Grundlage fГјr planbares Wachstum.",
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
            title: "Р›РѕРєР°Р»СЊРЅРѕРµ SEO РґР»СЏ Р±РёР·РЅРµСЃР° РІ Р“Р°Р»Р»Рµ",
            slug: "lokalnoe-seo-halle",
            excerpt: "РљР°Рє Р»РѕРєР°Р»СЊРЅРѕРјСѓ Р±РёР·РЅРµСЃСѓ РЅР°С…РѕРґРёС‚СЊСЃСЏ РІ Google Рё РІ РР-РїРѕРёСЃРєРµ.",
            content:
              "## Р—Р°С‡РµРј Р»РѕРєР°Р»СЊРЅРѕРµ SEO?\n\nРљР»РёРµРЅС‚С‹ СЃРЅР°С‡Р°Р»Р° РёС‰СѓС‚ РѕРЅР»Р°Р№РЅ. Р’РёРґРёРјРѕСЃС‚СЊ = Р·Р°СЏРІРєРё.\n\n## Р“Р»Р°РІРЅС‹Рµ СЂС‹С‡Р°РіРё\n\n- РџСЂРѕС„РёР»СЊ РІ Google\n- РћС‚Р·С‹РІС‹\n- Р›РѕРєР°Р»СЊРЅС‹Р№ РєРѕРЅС‚РµРЅС‚\n\n## РС‚РѕРі\n\nР›РѕРєР°Р»СЊРЅРѕРµ SEO вЂ” РѕСЃРЅРѕРІР° РїСЂРµРґСЃРєР°Р·СѓРµРјРѕРіРѕ СЂРѕСЃС‚Р°.",
          },
        ],
      },
    },
  });

  await prisma.blogPost.create({
    data: {
      authorId: author.id,
      categoryId: seoCategory.id,
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
              "## Performance\n\nNext.js liefert Inhalte blitzschnell aus.\n\n## Sicherheit\n\nKeine veralteten Plugins, kleinere AngriffsflГ¤che.\n\n## SEO\n\nSauberes HTML und Schema-Daten von Anfang an.",
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
            title: "РџРѕС‡РµРјСѓ Next.js вЂ” Р»СѓС‡С€Р°СЏ РѕСЃРЅРѕРІР°, С‡РµРј WordPress",
            slug: "nextjs-vs-wordpress",
            excerpt: "РџСЂРѕРёР·РІРѕРґРёС‚РµР»СЊРЅРѕСЃС‚СЊ, Р±РµР·РѕРїР°СЃРЅРѕСЃС‚СЊ Рё SEO РІ СЃСЂР°РІРЅРµРЅРёРё.",
            content:
              "## РџСЂРѕРёР·РІРѕРґРёС‚РµР»СЊРЅРѕСЃС‚СЊ\n\nNext.js РѕС‚РґР°С‘С‚ РєРѕРЅС‚РµРЅС‚ РјРѕР»РЅРёРµРЅРѕСЃРЅРѕ.\n\n## Р‘РµР·РѕРїР°СЃРЅРѕСЃС‚СЊ\n\nРќРµС‚ СѓСЃС‚Р°СЂРµРІС€РёС… РїР»Р°РіРёРЅРѕРІ, РјРµРЅСЊС€Рµ СѓСЏР·РІРёРјРѕСЃС‚РµР№.\n\n## SEO\n\nР§РёСЃС‚С‹Р№ HTML Рё schema-РґР°РЅРЅС‹Рµ СЃ СЃР°РјРѕРіРѕ РЅР°С‡Р°Р»Р°.",
          },
        ],
      },
    },
  });

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
