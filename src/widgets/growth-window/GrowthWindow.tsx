import { getLocale, getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { GrowthMediaWindow } from "./GrowthMediaWindow";

export async function GrowthWindow() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations({ locale, namespace: "GrowthWindow" });
  const badges = [t("badges.seo"), t("badges.ai"), t("badges.performance")];

  return (
    <section className="overflow-hidden bg-white py-16 md:py-24" aria-labelledby="growth-window-title">
      <Container>
        <Reveal className="mx-auto mb-8 max-w-[820px] text-center md:mb-12">
          <span className="mb-4 inline-flex rounded-full border border-brand-purple/20 bg-brand-soft px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-purple">
            {t("eyebrow")}
          </span>
          <h2
            id="growth-window-title"
            className="text-4xl font-black leading-tight tracking-normal text-dark md:text-6xl"
          >
            {t("title")}
          </h2>
          <p className="mx-auto mt-5 max-w-[720px] text-base leading-8 text-muted md:text-xl">{t("lead")}</p>
        </Reveal>

        <div className="md:min-h-[128vh]">
          <Reveal className="md:sticky md:top-24" direction="zoom">
            <div className="relative">
              <GrowthMediaWindow
                imageAlt={t("imageAlt")}
                metric={t("metric")}
                status={t("status")}
                badges={badges}
              />

              <div className="mx-auto mt-5 flex max-w-4xl flex-col gap-3 rounded-3xl border border-line bg-white/90 p-5 text-center shadow-card backdrop-blur md:flex-row md:items-center md:justify-between md:text-left">
                <p className="text-sm leading-6 text-muted md:text-base">{t("caption")}</p>
                <span className="mx-auto inline-flex shrink-0 rounded-full bg-brand-soft px-4 py-2 text-sm font-bold text-brand-purple md:mx-0">
                  {t("metric")}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
