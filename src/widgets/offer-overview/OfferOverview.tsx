import { getLocale, getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Bot,
  Database,
  Globe2,
  MailCheck,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { getContactHref } from "@/shared/lib/contactHref";
import { getLocalizedHref } from "@/shared/lib/localizedPath";
import {
  getPhase4IndustryLinks,
  getPhase4LocationLinks,
  getPhase4ServiceLinks,
} from "@/widgets/seo-landing/phase4Content";
import { resolveIndustrySlug } from "@/widgets/seo-landing/industryMerges";

/**
 * One compact "what we do, for whom" block. It replaces the former Services
 * (6 cards + tech note + link hub) and Industries (8 cards + link hub)
 * sections on the homepage while keeping every internal link those hubs
 * provided: the Phase 4 service, location and industry landing pages still
 * receive their homepage links from the "direct entry points" row below.
 */
type Solution = { title: string; desc: string; chips: string[]; cta: string };
type IndustryItem = { name: string; desc: string };

const serviceIcons: LucideIcon[] = [Globe2, Search, Bot, Database, ShieldCheck, MailCheck];
const solutionSlugs: Record<AppLocale, (string | null)[]> = {
  de: ["website-erstellen-lassen", "seo-halle", "automatisierung", "api-integrationen", "website-sicherheit", null],
  en: ["website-development", "seo-halle", "automation", "api-integrations", "website-security", null],
  ru: ["razrabotka-saytov", "seo-halle", "avtomatizaciya", "api-integracii", "bezopasnost-sayta", null],
};
const industryEmojis = ["🏨", "🍽️", "💇", "🏗️", "🔧", "🩺", "🏠", "⚖️"];
const industrySlugs: Record<AppLocale, string[]> = {
  de: ["hotels", "restaurants", "beauty-salons", "bau", "handwerk", "arztpraxen", "immobilien", "kanzleien"],
  en: ["hotels", "restaurants", "beauty-salons", "construction", "craftsmen", "medical-practices", "real-estate", "law-firms"],
  ru: ["oteli", "restorany", "beauty-salony", "stroitelstvo", "remeslenniki", "medcentry", "nedvizhimost", "yuristy"],
};

export async function OfferOverview() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations({ locale, namespace: "OfferOverview" });
  const ts = await getTranslations({ locale, namespace: "Services" });
  const ti = await getTranslations({ locale, namespace: "Industries" });
  const contactHref = getContactHref(locale);

  const services = (ts.raw("solutions") as Solution[]).map((item, i) => ({
    ...item,
    slug: solutionSlugs[locale][i],
    icon: serviceIcons[i % serviceIcons.length],
  }));
  const industries = Array.from(
    new Map(
      (ti.raw("items") as IndustryItem[]).map((item, i) => {
        const slug = resolveIndustrySlug(locale, industrySlugs[locale][i]);
        return [slug, { ...item, slug, emoji: industryEmojis[i % industryEmojis.length] }] as const;
      }),
    ).values(),
  );
  const directLinks = [
    ...getPhase4ServiceLinks(locale).slice(0, 6),
    ...getPhase4LocationLinks(locale).slice(0, 2),
    ...getPhase4IndustryLinks(locale),
  ];

  return (
    <section id="services" className="scroll-mt-24 bg-surface py-16 md:py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Services */}
          <Reveal className="rounded-[24px] border border-line bg-white p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.45)] md:p-7">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-lg font-extrabold tracking-tight text-dark">{t("servicesTitle")}</h3>
              <Link
                href="/leistungen"
                prefetch={false}
                className="inline-flex items-center gap-1 text-[13px] font-bold text-[#6D28D9] hover:underline"
              >
                {t("allServices")} <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
            <ul className="divide-y divide-line">
              {services.map((item) => {
                const Icon = item.icon;
                const inner = (
                  <>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-purple transition-colors group-hover:bg-brand group-hover:text-white">
                      <Icon size={19} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15.5px] font-extrabold leading-tight text-dark transition-colors group-hover:text-brand-purple">
                        {item.title}
                      </span>
                      <span className="mt-1 line-clamp-2 text-[13.5px] leading-snug text-muted">
                        {item.desc}
                      </span>
                    </span>
                    <ArrowRight
                      size={16}
                      aria-hidden
                      className="mt-1 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-brand-purple"
                    />
                  </>
                );
                const className =
                  "group flex items-start gap-4 py-3.5 outline-hidden focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 first:pt-0 last:pb-0";
                return (
                  <li key={item.title}>
                    {item.slug ? (
                      <Link
                        href={{ pathname: "/leistungen/[slug]", params: { slug: item.slug } }}
                        prefetch={false}
                        className={className}
                      >
                        {inner}
                      </Link>
                    ) : (
                      <a href={contactHref} className={className}>
                        {inner}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* Industries */}
          <Reveal delay={90} className="rounded-[24px] border border-line bg-white p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.45)] md:p-7">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-lg font-extrabold tracking-tight text-dark">{t("industriesTitle")}</h3>
              <Link
                href="/branchen"
                prefetch={false}
                className="inline-flex items-center gap-1 text-[13px] font-bold text-[#6D28D9] hover:underline"
              >
                {t("allIndustries")} <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-2">
              {industries.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={{ pathname: "/branchen/[slug]", params: { slug: item.slug } }}
                    prefetch={false}
                    className="group flex h-full items-center gap-3 rounded-2xl border border-line bg-surface px-3.5 py-3 transition-all hover:-translate-y-0.5 hover:border-brand-purple/30 hover:bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-purple"
                  >
                    <span aria-hidden className="text-xl leading-none">{item.emoji}</span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-bold leading-tight text-dark group-hover:text-brand-purple">
                        {item.name}
                      </span>
                      <span className="mt-0.5 hidden truncate text-[11.5px] text-muted sm:block">{item.desc}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Direct entry points keep every homepage link to the Phase 4 landing pages. */}
        <Reveal delay={140} className="mt-6">
          <nav
            aria-label={t("linksTitle")}
            className="rounded-[24px] border border-brand-purple/15 bg-white/80 p-5 md:flex md:items-start md:gap-8 md:p-6"
          >
            <div className="mb-3 shrink-0 md:mb-0 md:w-[240px]">
              <p className="text-[15px] font-extrabold text-dark">{t("linksTitle")}</p>
              <p className="mt-1 text-[13px] leading-snug text-muted">{t("linksLead")}</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {directLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    title={link.description}
                    className="inline-flex items-center rounded-full border border-line bg-white px-3 py-1.5 text-[12.5px] font-semibold text-ink transition-colors hover:border-brand-purple/40 hover:text-brand-purple"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        <p className="mt-6 text-center text-[14px] text-muted">
          <a href={getLocalizedHref(locale, "pricing")} className="font-bold text-[#6D28D9] underline-offset-4 hover:underline">
            {ts("trustLine")}
          </a>
        </p>
      </Container>
    </section>
  );
}
