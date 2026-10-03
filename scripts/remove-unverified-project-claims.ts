import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const replacements = [
  { slug: "online-buchungen-verdreifacht", expected: "+212%", value: "Online-Terminbuchung" },
  { slug: "neue-liebe-nebra", expected: "+176%", value: "Reservierungsfokus" },
  { slug: "direktbuchungen-ohne-portale", expected: "+148%", value: "Projektvorschau" },
  { slug: "qualifizierte-bauanfragen", expected: "Platz 1", value: "Klare Leistungen" },
] as const;

async function main() {
  for (const { slug, expected, value } of replacements) {
    const translation = await prisma.projectTranslation.findUnique({
      where: { locale_slug: { locale: "de", slug } },
      select: { projectId: true, project: { select: { resultValue: true } } },
    });
    if (!translation) throw new Error(`Project not found: ${slug}`);
    if (translation.project.resultValue === value) {
      console.log(`Already corrected: ${slug}`);
      continue;
    }
    if (translation.project.resultValue !== expected) {
      throw new Error(`Unexpected claim for ${slug}: ${translation.project.resultValue}`);
    }
    await prisma.project.update({
      where: { id: translation.projectId },
      data: { resultValue: value },
    });
    console.log(`Corrected: ${slug}`);
  }

  const unverifiedReview = await prisma.testimonial.findMany({
    where: {
      translations: { some: { locale: "de", company: "Salon Elen", quote: "Unsere Buchungen haben sich verdreifacht." } },
    },
    select: { id: true, published: true },
  });
  for (const review of unverifiedReview) {
    if (!review.published) continue;
    await prisma.testimonial.update({ where: { id: review.id }, data: { published: false } });
    console.log("Unpublished unverified Salon Elen review");
  }

  const neueLiebe = await prisma.projectTranslation.findUnique({
    where: { locale_slug: { locale: "de", slug: "neue-liebe-nebra" } },
    select: { projectId: true },
  });
  if (!neueLiebe) throw new Error("Neue Liebe project not found");
  const resultCopies = [
    {
      locale: "de",
      old: "Mehr Direktbuchungen, eine professionellere mobile Nutzerführung und ein Auftritt, der Restaurant, Speisekarte, Events und Kontaktwege deutlich vertrauensvoller präsentiert.",
      safe: "Ein moderner Restaurantauftritt, der Atmosphäre, aktuelle Inhalte und mobile Nutzerführung verbindet.",
      value: "Ein professioneller mobiler Restaurantauftritt, der Speisekarte, Events, Reservierung und Kontaktwege klar präsentiert.",
    },
    {
      locale: "en",
      old: "More direct reservations, a stronger mobile user journey and a website that presents restaurant, menu, events and contact paths with more trust and clarity.",
      safe: "A modern restaurant presence that connects atmosphere, current content and mobile user guidance.",
      value: "A mobile-friendly restaurant website that presents the menu, events, reservations and contact paths clearly.",
    },
    {
      locale: "ru",
      old: "Больше прямых бронирований, сильнее мобильный путь пользователя и сайт, который уверенно показывает ресторан, меню, события и контактные действия.",
      safe: "Современная презентация ресторана, которая соединяет атмосферу, актуальный контент и удобный мобильный путь.",
      value: "Удобный для мобильных устройств сайт ресторана с понятной подачей меню, событий, бронирования и способов связи.",
    },
  ] as const;
  for (const copy of resultCopies) {
    const translation = await prisma.projectTranslation.findUnique({
      where: { projectId_locale: { projectId: neueLiebe.projectId, locale: copy.locale } },
      select: { results: true },
    });
    if (translation?.results === copy.value || translation?.results === copy.safe) continue;
    if (translation?.results !== copy.old) throw new Error(`Unexpected Neue Liebe results (${copy.locale})`);
    await prisma.projectTranslation.update({
      where: { projectId_locale: { projectId: neueLiebe.projectId, locale: copy.locale } },
      data: { results: copy.value },
    });
    console.log(`Corrected Neue Liebe results: ${copy.locale}`);
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
