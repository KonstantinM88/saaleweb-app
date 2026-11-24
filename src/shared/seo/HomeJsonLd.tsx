import { getTranslations } from "next-intl/server";
import { JsonLd } from "./JsonLd";
import { localBusinessSchema, faqPageSchema } from "./schema";
import type { AppLocale } from "@/i18n/routing";
import { getHomepageFaqItems } from "@/features/homepage/faq";

export async function HomeJsonLd({ locale }: { locale: string }) {
  const faqItemsFromSource = await getHomepageFaqItems(locale as AppLocale);
  const directAnswers = await getTranslations({ locale, namespace: "DirectAnswers" });
  const combinedItems = [
    ...faqItemsFromSource,
    ...(directAnswers.raw("items") as { q: string; a: string }[]),
  ];
  const faqItems = Array.from(
    new Map(combinedItems.map((item) => [item.q.trim().toLocaleLowerCase(locale), item])).values(),
  );

  return <JsonLd data={[localBusinessSchema(), faqPageSchema(faqItems)]} />;
}
