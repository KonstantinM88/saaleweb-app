import { getTranslations, getLocale } from "next-intl/server";
import { Bot, Database, Globe2, MailCheck, Search, ShieldCheck, type LucideIcon } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { getContactHref } from "@/shared/lib/contactHref";
import { Phase4LinkCluster, type Phase4HubCopy } from "@/widgets/seo-landing/Phase4LinkCluster";
import { getPhase4LocationLinks, getPhase4ServiceLinks } from "@/widgets/seo-landing/phase4Content";

type Solution = { title: string; desc: string; chips: string[]; cta: string };
type TechNote = { title: string; text: string; chips: string[] };

const icons: LucideIcon[] = [Globe2, Search, Bot, Database, ShieldCheck, MailCheck];
const solutionSlugs: Record<AppLocale, (string | null)[]> = {
  de: ["website-erstellen-lassen", "seo-halle", "automatisierung", "api-integrationen", "website-sicherheit", null],
  en: ["website-development", "seo-halle", "automation", "api-integrations", "website-security", null],
  ru: ["razrabotka-saytov", "seo-halle", "avtomatizaciya", "api-integracii", "bezopasnost-sayta", null],
};

export async function Services() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations({ locale, namespace: "Services" });
  const techNote = t.raw("techNote") as TechNote;
  const seoHub = t.raw("seoHub") as Phase4HubCopy;
  const seoLinks = [...getPhase4ServiceLinks(locale).slice(0, 6), ...getPhase4LocationLinks(locale).slice(0, 2)];
  const contactHref = getContactHref(locale);
  const items = (t.raw("solutions") as Solution[]).map((item, i) => ({
    ...item,
    slug: solutionSlugs[locale][i],
    icon: icons[i % icons.length],
  }));

  return (
    <section id="services" className="bg-surface py-16 md:py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
        <p className="mx-auto -mt-3 mb-8 max-w-2xl text-center text-[14px] font-semibold text-muted">
          {t("trustLine")}
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 90} className="h-full">
              <ServiceClusterCard item={item} fallbackHref={contactHref} fallbackCta={t("more")} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-8">
          <div className="rounded-[22px] border border-brand-purple/[0.15] bg-white p-5 shadow-[0_22px_70px_-52px_rgba(139,92,246,0.58)] md:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl">
                <h3 className="text-xl font-extrabold tracking-tight text-dark">{techNote.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{techNote.text}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {techNote.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] font-bold text-ink"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Phase4LinkCluster copy={seoHub} links={seoLinks} compact />
      </Container>
    </section>
  );
}

function ServiceClusterCard({
  item,
  fallbackHref,
  fallbackCta,
}: {
  item: Solution & { slug: string | null; icon: LucideIcon };
  fallbackHref: string;
  fallbackCta: string;
}) {
  const Icon = item.icon;
  const content = (
    <article className="card-border-glow flex h-full flex-col rounded-[20px] border border-line bg-white p-6 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-card md:p-7">
      <div className="mb-5 grid h-[48px] w-[48px] place-items-center rounded-[15px] bg-brand-soft text-brand-purple transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
        <Icon size={23} aria-hidden />
      </div>
      <h3 className="text-[19px] font-extrabold tracking-tight text-dark transition-colors group-hover:text-brand-purple">
        {item.title}
      </h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{item.desc}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {item.chips.slice(0, 6).map((chip) => (
          <span key={chip} className="rounded-full border border-line bg-surface px-2.5 py-1 text-[12px] font-bold text-ink">
            {chip}
          </span>
        ))}
      </div>
      <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-purple">
        {item.cta || fallbackCta}
        <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </article>
  );

  if (!item.slug) {
    return (
      <a
        href={fallbackHref}
        aria-label={item.cta || fallbackCta}
        className="group block h-full rounded-[20px] outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-4"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={{ pathname: "/leistungen/[slug]", params: { slug: item.slug } }}
      aria-label={item.cta || fallbackCta}
      className="group block h-full rounded-[20px] outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-4"
    >
      {content}
    </Link>
  );
}
