import { getTranslations } from "next-intl/server";
import { JsonLd } from "./JsonLd";
import { localBusinessSchema, faqPageSchema } from "./schema";

export async function HomeJsonLd({ locale }: { locale: string }) {
  const faq = await getTranslations({ locale, namespace: "Faq" });
  const directAnswers = await getTranslations({ locale, namespace: "DirectAnswers" });
  const combinedItems = [
    ...(faq.raw("items") as { q: string; a: string }[]),
    ...(directAnswers.raw("items") as { q: string; a: string }[]),
  ];
  const faqItems = Array.from(
    new Map(combinedItems.map((item) => [item.q.trim().toLocaleLowerCase(locale), item])).values(),
  );

  return <JsonLd data={[localBusinessSchema(), faqPageSchema(faqItems)]} />;
}
