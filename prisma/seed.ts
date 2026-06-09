import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.upsert({
    where: { email: "konstantin@saaleweb.de" },
    update: {},
    create: {
      email: "konstantin@saaleweb.de",
      name: "Konstantin Michailow",
      role: "ADMIN",
    },
  });

  await prisma.service.create({
    data: {
      icon: "code",
      order: 1,
      translations: {
        create: [
          { locale: "de", name: "Website Entwicklung", slug: "website-entwicklung", excerpt: "Schnelle, moderne Websites mit Next.js." },
          { locale: "en", name: "Web Development", slug: "web-development", excerpt: "Fast, modern websites with Next.js." },
          { locale: "ru", name: "Разработка сайтов", slug: "razrabotka-sajtov", excerpt: "Быстрые современные сайты на Next.js." },
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
          { locale: "ru", quote: "Наши записи выросли втрое.", clientName: "Елена Л.", company: "Salon Elen" },
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
          { locale: "de", question: "Was kostet eine Website?", answer: "Eine Landingpage startet bei 990 €." },
          { locale: "en", question: "What does a website cost?", answer: "A landing page starts at €990." },
          { locale: "ru", question: "Сколько стоит сайт?", answer: "Лендинг — от 990 €." },
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
