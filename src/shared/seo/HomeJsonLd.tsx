import { getTranslations } from "next-intl/server";
import { JsonLd } from "./JsonLd";
import { localBusinessSchema, faqPageSchema } from "./schema";

export async function HomeJsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Faq" });
  const faqItems = t.raw("items") as { q: string; a: string }[];

  return <JsonLd data={[localBusinessSchema(), faqPageSchema(faqItems)]} />;
}
