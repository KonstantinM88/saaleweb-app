import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";

const imageSrc = "/images/sections/premium-saas-technology.webp";

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
              <div className="relative min-h-[440px] overflow-hidden rounded-[28px] border border-line bg-dark shadow-[0_46px_120px_-62px_rgba(17,24,39,0.9)] sm:min-h-[520px] md:min-h-[680px] md:rounded-[36px]">
                <div
                  className="absolute inset-0 hidden bg-[url('/images/sections/premium-saas-technology.webp')] bg-cover bg-center md:block md:bg-fixed"
                  aria-hidden="true"
                />
                <Image
                  src={imageSrc}
                  alt={t("imageAlt")}
                  fill
                  sizes="(max-width: 767px) calc(100vw - 48px), 1px"
                  className="object-cover object-center md:hidden"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_30%,rgba(255,79,163,0.10),transparent_34%),linear-gradient(180deg,rgba(17,24,39,0.10)_0%,rgba(17,24,39,0.03)_42%,rgba(17,24,39,0.42)_100%)]" />

                <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3 rounded-full border border-white/20 bg-dark/40 px-4 py-3 text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl md:left-6 md:right-6 md:top-6">
                  <div className="flex items-center gap-2" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-pink" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-purple" />
                  </div>
                  <span className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-white/60 sm:inline">
                    SaaleWeb Growth OS
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                    {t("metric")}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 md:bottom-6 md:left-6 md:right-6">
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-white/20 bg-dark/50 px-3 py-2 text-xs font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl md:px-4 md:text-sm"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                  <div className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-[0_18px_45px_-22px_rgba(255,79,163,0.9)]">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    {t("status")}
                  </div>
                </div>
              </div>

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
