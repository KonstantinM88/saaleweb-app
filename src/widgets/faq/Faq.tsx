import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { AppLocale } from "@/i18n/routing";
import { Container } from "@/shared/ui/Container";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { FaqAccordion, type QA } from "./FaqAccordion";

async function getDbFaq(locale: AppLocale): Promise<QA[]> {
  try {
    const rows = await prisma.faq.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: { translations: { where: { locale }, take: 1 } },
    });
    return rows.flatMap((row) => {
      const tr = row.translations[0];
      if (!tr) return [];
      return { q: tr.question, a: tr.answer };
    });
  } catch {
    return [];
  }
}

export async function Faq() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations({ locale, namespace: "Faq" });
  const fallback = t.raw("items") as QA[];
  const dbItems = await getDbFaq(locale);
  const items = dbItems.length >= fallback.length ? dbItems : fallback;

  return (
    <section id="faq" className="bg-surface py-16 md:py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />
        <FaqAccordion items={items} />
      </Container>
    </section>
  );
}
