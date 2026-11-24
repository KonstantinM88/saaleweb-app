import { getLocale, getTranslations } from "next-intl/server";
import { ArrowDown, ArrowRight, ArrowUpRight, Bot, CalendarCheck, Check, Inbox, Workflow } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { getContactHref } from "@/shared/lib/contactHref";
import { getSeoServiceSlugMap, serviceHref } from "@/widgets/seo-landing/phase4Content";

type UseCase = { title: string; text: string };
const icons = [Inbox, CalendarCheck, Bot];
const automationSlugs: Record<AppLocale, string> = { de: "automatisierung", en: "automation", ru: "avtomatizaciya" };

export async function Automation() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations({ locale, namespace: "Automation" });
  const cases = t.raw("cases") as UseCase[];
  const steps = t.raw("steps") as string[];
  const assistantSlug = getSeoServiceSlugMap("ki-assistent")?.[locale] ?? "ki-assistent";

  return (
    <section id="automation" aria-labelledby="automation-title" className="scroll-mt-24 bg-surface py-16 md:py-24">
      <Container>
        <div className="grid min-w-0 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <Reveal>
            <span className="eyebrow">{t("eyebrow")}</span>
            <h2 id="automation-title" className="mt-4 max-w-2xl text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.1] tracking-tight text-dark">{t("title")}</h2>
            <p className="mt-5 text-[17px] leading-relaxed text-ink">{t("lead")}</p>
            <ul className="mt-7 grid gap-5">
              {cases.map((item, index) => {
                const Icon = icons[index] ?? Workflow;
                return (
                  <li key={item.title} className="flex gap-4">
                    <Icon size={21} className="mt-1 shrink-0 text-[#6D28D9]" aria-hidden />
                    <div><h3 className="text-base font-bold text-dark">{item.title}</h3><p className="mt-1 text-[15px] leading-relaxed text-muted">{item.text}</p></div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
          <Reveal className="min-w-0">
            <div className="relative overflow-hidden rounded-[28px] bg-dark p-5 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.6)] sm:p-8">
              <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-purple/20 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-5"><span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/80">{t("example")}</span><Workflow size={23} className="shrink-0 text-brand-pink" aria-hidden /></div>
                <p className="mb-6 mt-5 text-sm leading-relaxed text-slate-300">{t("before")}</p>
                <ol className="grid gap-2">
                  {steps.map((step, index) => (
                    <li key={step}>
                      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 font-mono text-xs font-bold text-brand-pink">0{index + 1}</span><span className="text-[15px] font-semibold leading-snug text-white">{step}</span>{index === steps.length - 1 && <Check size={18} className="ml-auto shrink-0 text-emerald-300" aria-hidden />}</div>
                      {index < steps.length - 1 && <ArrowDown size={16} className="mx-auto my-2 text-white/40" aria-hidden />}
                    </li>
                  ))}
                </ol>
                <p className="mt-6 text-xs leading-relaxed text-slate-300">{t("scope")}</p>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <a href={getContactHref(locale)} className="inline-flex min-h-11 items-center gap-2 text-[15px] font-bold text-[#6D28D9] hover:underline">{t("cta")} <ArrowUpRight size={17} aria-hidden /></a>
          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-ink">
            <a href={serviceHref(locale, automationSlugs[locale])} className="inline-flex items-center gap-2 hover:text-[#6D28D9]">{t("automationLink")}<ArrowRight size={14} aria-hidden /></a>
            <a href={serviceHref(locale, assistantSlug)} className="inline-flex items-center gap-2 hover:text-[#6D28D9]">{t("assistantLink")}<ArrowRight size={14} aria-hidden /></a>
          </div>
        </div>
      </Container>
    </section>
  );
}
