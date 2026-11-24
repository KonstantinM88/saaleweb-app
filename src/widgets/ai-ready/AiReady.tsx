import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowUpRight, Braces, MapPin, Quote, Search } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { getAuditHref } from "@/shared/lib/localizedPath";
import { getSeoServiceSlugMap, serviceHref, type Phase4Locale } from "@/widgets/seo-landing/phase4Content";
import { AiVisibilityScene, type AiVisibilityCopy } from "./AiVisibilityScene";
import "./ai-visibility.css";

type Feature = { title: string; desc: string };
const icons = [Search, MapPin, Braces, Quote];

/** Server-rendered sales content with a separately labelled conceptual visual. */
export function AiReady() {
  const t = useTranslations("AiReady");
  const locale = useLocale() as Phase4Locale;
  const features = t.raw("features") as Feature[];
  const slug = getSeoServiceSlugMap("ki-optimierung")?.[locale] ?? "ki-optimierung";

  return <section id="search-visibility" aria-labelledby="search-visibility-title" className="scroll-mt-24 overflow-hidden py-16 md:py-24">
    <Container>
      <div className="mb-9 grid min-w-0 gap-5 lg:grid-cols-2 lg:items-end lg:gap-14">
        <Reveal><span className="eyebrow">{t("eyebrow")}</span><h2 id="search-visibility-title" className="mt-4 max-w-xl text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.1] tracking-tight text-dark">{t("title")}</h2></Reveal>
        <Reveal><p className="text-[16px] leading-relaxed text-muted">{t("lead")}</p><div className="mt-5 flex flex-wrap items-center gap-3"><a href={getAuditHref(locale)} className="btn-shine inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white outline-hidden focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-4">{t("auditCta")}<ArrowUpRight size={16} aria-hidden /></a><a href={serviceHref(locale, slug)} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#6D28D9] underline-offset-4 outline-hidden hover:underline focus-visible:ring-2 focus-visible:ring-[#6D28D9]">{t("cta")}<ArrowRight size={15} aria-hidden /></a></div></Reveal>
      </div>
      <AiVisibilityScene copy={t.raw("visual") as AiVisibilityCopy} />
      <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => { const Icon = icons[index] ?? Search; return <article key={feature.title} className="min-w-0 border-t border-line pt-5"><Icon size={21} className="text-[#6D28D9]" aria-hidden /><h3 className="mt-3 text-[15px] font-bold text-dark">{feature.title}</h3><p className="mt-2 text-[13px] leading-relaxed text-muted">{feature.desc}</p></article>; })}
      </div>
      <div className="mt-8 grid gap-4 rounded-2xl border border-line bg-surface p-5 md:grid-cols-2 md:gap-8"><p className="text-xs leading-relaxed text-muted"><strong className="font-bold text-ink">{t("measurementTitle")}</strong> {t("measurement")}</p><p className="text-xs leading-relaxed text-muted">{t("scope")}</p></div>
    </Container>
  </section>;
}
