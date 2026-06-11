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

type PricingPackage = {
  name: string;
  sub: string;
  price: string;
  features: string[];
};

type PricingMessages = {
  Pricing: {
    packages: PricingPackage[];
  };
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function loadMessages(): Promise<Record<Locale, PricingMessages>> {
  const entries = await Promise.all(
    locales.map(async (locale) => {
      const file = path.join(root, "messages", `${locale}.json`);
      const json = JSON.parse(await readFile(file, "utf8")) as PricingMessages;
      return [locale, json] as const;
    }),
  );

  return Object.fromEntries(entries) as Record<Locale, PricingMessages>;
}

function itemAt<T>(items: T[], index: number, locale: Locale): T {
  const item = items[index];
  if (!item) throw new Error(`Missing Pricing.packages[${index}] for locale ${locale}`);
  return item;
}

async function findPlanId(index: number, deName: string) {
  const byName = await prisma.pricingPlanTranslation.findFirst({
    where: { locale: "de", name: deName },
    select: { planId: true },
  });
  if (byName) return byName.planId;

  const byOrder = await prisma.pricingPlan.findFirst({
    where: { order: index + 1 },
    select: { id: true },
  });
  return byOrder?.id ?? null;
}

async function syncPricing(messages: Record<Locale, PricingMessages>) {
  const packageCount = messages.de.Pricing.packages.length;

  for (let index = 0; index < packageCount; index += 1) {
    const dePackage = itemAt(messages.de.Pricing.packages, index, "de");
    const translations = locales.map((locale) => {
      const item = itemAt(messages[locale].Pricing.packages, index, locale);
      return {
        locale,
        name: item.name,
        sub: item.sub || null,
        price: item.price,
        features: item.features,
      };
    });
    const topLevel = {
      featured: index === 1,
      published: true,
      order: index + 1,
    };

    const id = await findPlanId(index, dePackage.name);
    if (id) {
      await prisma.pricingPlan.update({
        where: { id },
        data: { ...topLevel, translations: { deleteMany: {}, create: translations } },
      });
    } else {
      await prisma.pricingPlan.create({
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
  await syncPricing(messages);

  const plans = await prisma.pricingPlan.count({ where: { published: true } });
  console.log("Pricing content synced.", { plans });
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
