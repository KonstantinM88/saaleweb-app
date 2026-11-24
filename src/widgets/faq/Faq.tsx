import { getTranslations, getLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { getHomepageFaqItems } from "@/features/homepage/faq";
import { Container } from "@/shared/ui/Container";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { FaqAccordion } from "./FaqAccordion";

const VISIBLE_FAQ_ITEMS = 6;

/**
 * One FAQ section: the six most common questions are visible by default, the rest
 * behind "show more". Search-intent direct answers render earlier on the
 * homepage. All question text stays in the server HTML, so the
 * homepage FAQPage JSON-LD uses the same content loader, including CMS edits.
 */
export async function Faq() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations({ locale, namespace: "Faq" });
  const items = await getHomepageFaqItems(locale);

  return (
    <section id="faq" className="scroll-mt-24 bg-surface py-16 md:py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />
        <FaqAccordion
          items={items}
          initialVisible={VISIBLE_FAQ_ITEMS}
          moreLabel={t("more")}
          lessLabel={t("less")}
        />
      </Container>
    </section>
  );
}
