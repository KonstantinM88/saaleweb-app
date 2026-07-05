/**
 * Delta 24 — FAQ sync.
 *
 * Upserts the homepage FAQ (category "homepage") from messages/{de,en,ru}.json
 * into the database without touching services, industries, cases or blog data.
 *
 * Matching strategy:
 *   1. by any current question text in any locale,
 *   2. otherwise by { category: "homepage", order: index + 1 },
 *   3. otherwise create a new row.
 *
 * Items that exist in the DB beyond the current messages list (same category)
 * are unpublished, not deleted, so nothing is lost.
 *
 * Run: npm run db:sync-faq
 */
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

type FaqItem = { q: string; a: string };
type FaqMessages = { Faq: { items: FaqItem[] } };

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function loadMessages(): Promise<Record<Locale, FaqMessages>> {
  const entries = await Promise.all(
    locales.map(async (locale) => {
      const file = path.join(root, "messages", `${locale}.json`);
      const parsed = JSON.parse(await readFile(file, "utf8")) as FaqMessages;
      return [locale, parsed] as const;
    }),
  );

  return Object.fromEntries(entries) as Record<Locale, FaqMessages>;
}

function itemAt(items: FaqItem[], index: number, locale: Locale): FaqItem {
  const item = items[index];
  if (!item) {
    throw new Error(`Missing Faq.items[${index}] in messages/${locale}.json`);
  }
  return item;
}

async function syncFaq(messages: Record<Locale, FaqMessages>) {
  const total = messages.de.Faq.items.length;

  for (const locale of locales) {
    if (messages[locale].Faq.items.length !== total) {
      throw new Error(
        `Faq.items length mismatch: de=${total}, ${locale}=${messages[locale].Faq.items.length}`,
      );
    }
  }

  for (let index = 0; index < total; index += 1) {
    const desiredQuestions = locales.map((locale) => itemAt(messages[locale].Faq.items, index, locale).q);

    const existingByQuestion = await prisma.faqTranslation.findFirst({
      where: {
        OR: locales.map((locale, localeIndex) => ({
          locale,
          question: desiredQuestions[localeIndex],
        })),
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
      const message = itemAt(messages[locale].Faq.items, index, locale);
      return { locale, question: message.q, answer: message.a };
    });
    const topLevel = { category: "homepage", order: index + 1, published: true };

    const id = existingByQuestion?.faqId ?? existingByOrder?.id ?? null;
    if (id) {
      await prisma.faq.update({
        where: { id },
        data: { ...topLevel, translations: { deleteMany: {}, create: translations } },
      });
      console.log(`~ updated FAQ #${index + 1}: ${desiredQuestions[0]}`);
    } else {
      await prisma.faq.create({
        data: { ...topLevel, translations: { create: translations } },
      });
      console.log(`+ created FAQ #${index + 1}: ${desiredQuestions[0]}`);
    }
  }

  const stale = await prisma.faq.updateMany({
    where: { category: "homepage", order: { gt: total }, published: true },
    data: { published: false },
  });
  if (stale.count > 0) {
    console.log(`- unpublished ${stale.count} stale homepage FAQ item(s) beyond #${total}`);
  }
}

async function main() {
  const messages = await loadMessages();
  await syncFaq(messages);
  console.log(`Done. Homepage FAQ synced: ${messages.de.Faq.items.length} items x 3 locales.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
