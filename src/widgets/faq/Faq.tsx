import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { AppLocale } from "@/i18n/routing";
import { Container } from "@/shared/ui/Container";
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
    <section id="faq" className="bg-surface py-24">
      <Container>
        <div className="mx-auto mb-14 max-w-[680px] text-center">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2 className="mt-4 text-[clamp(28px,4vw,46px)] font-bold tracking-tight text-dark">
            {t("title")}
          </h2>
        </div>
        <FaqAccordion items={items} />
      </Container>
    </section>
  );
}
