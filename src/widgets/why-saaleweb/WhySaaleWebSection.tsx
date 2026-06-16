import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Handshake,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { BrandText } from "@/shared/ui/BrandText";
import { cn } from "@/shared/lib/cn";

type BenefitKey = "visibility" | "inquiries" | "ai" | "speed" | "safe" | "partner";

type Benefit = {
  key: BenefitKey;
  title: string;
  text: string;
  metric: string;
};

const benefitIcons: Record<BenefitKey, LucideIcon> = {
  visibility: Search,
  inquiries: MessageCircle,
  ai: Bot,
  speed: Zap,
  safe: ShieldCheck,
  partner: Handshake,
};

const aiServiceSlugs: Record<AppLocale, string> = {
  de: "ki-integration",
  en: "ai-integration",
  ru: "integraciya-ii",
};

const quickLinkClass =
  "inline-flex items-center rounded-full border border-line bg-white/80 px-3 py-1.5 text-[13px] font-semibold text-muted transition-colors hover:border-brand-purple/30 hover:text-brand-purple";

function contactHref(locale: AppLocale) {
  return locale === routing.defaultLocale ? "/#contact" : `/${locale}#contact`;
}

function ListItem({
  children,
  accent = false,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <li className="flex items-start gap-3 text-[14.5px] leading-relaxed text-ink">
      {accent ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden />
      ) : (
        <span
          className="mt-2.5 h-2 w-2 shrink-0 rounded-full border border-gray-300 bg-white"
          aria-hidden
        />
      )}
      <span>{children}</span>
    </li>
  );
}

export async function WhySaaleWebSection() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations({ locale, namespace: "WhySaaleWeb" });
  const benefits = t.raw("benefits") as Benefit[];
  const standardItems = t.raw("standard") as string[];
  const systemItems = t.raw("system") as string[];

  return (
    <section
      id="why-saaleweb"
      aria-labelledby="why-saaleweb-title"
      className="overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7f8fb_48%,#ffffff_100%)] py-16 md:py-24"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="eyebrow inline-flex items-center justify-center gap-2 rounded-full border border-brand-purple/15 bg-white/80 px-4 py-2 shadow-[0_12px_34px_-26px_rgba(139,92,246,0.85)] backdrop-blur">
              <Sparkles className="h-4 w-4" aria-hidden />
              {t("eyebrow")}
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2
              id="why-saaleweb-title"
              className="mt-5 text-[clamp(34px,5vw,58px)] font-extrabold leading-[1.05] tracking-tight text-dark"
            >
              <BrandText text={t("title")} />
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink md:text-xl">
              {t("lead")}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-[15.5px] leading-relaxed text-muted md:text-base">
              {t("intro")}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item, index) => {
            const Icon = benefitIcons[item.key] ?? Search;

            return (
              <Reveal key={item.key} delay={(index % 3) * 80} className="h-full">
                <article className="card-border-glow group relative h-full overflow-hidden rounded-2xl border border-line bg-white/90 p-6 shadow-[0_22px_55px_-38px_rgba(15,23,42,0.45)] backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-purple/25 hover:shadow-[0_28px_70px_-36px_rgba(139,92,246,0.48)]">
                  <span
                    aria-hidden
                    className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-brand-pink/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-brand-purple/10 bg-brand-soft text-brand-purple transition-all duration-300 group-hover:border-transparent group-hover:bg-brand group-hover:text-white group-hover:shadow-[0_18px_34px_-16px_rgba(139,92,246,0.78)]">
                      <Icon className="h-6 w-6" aria-hidden />
                    </div>
                    <span className="rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-semibold uppercase text-muted">
                      {item.metric}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-dark">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    <BrandText text={item.text} />
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120} className="mt-10 md:mt-14">
          <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_28px_80px_-52px_rgba(15,23,42,0.65)]">
            <div className="border-b border-line bg-white/80 px-6 py-5 text-center backdrop-blur md:px-8">
              <h3 className="text-2xl font-extrabold tracking-tight text-dark md:text-3xl">
                {t("comparisonTitle")}
              </h3>
            </div>
            <div className="grid gap-0 md:grid-cols-2">
              <div className="border-b border-line p-6 md:border-b-0 md:border-r md:p-8">
                <p className="text-sm font-bold uppercase text-muted">{t("standardTitle")}</p>
                <ul className="mt-5 space-y-3">
                  {standardItems.map((item) => (
                    <ListItem key={item}>{item}</ListItem>
                  ))}
                </ul>
              </div>
              <div className="relative overflow-hidden bg-brand-pink/[0.035] p-6 md:p-8">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-pink to-brand-purple"
                />
                <p className="text-sm font-bold uppercase text-brand-purple">
                  <BrandText text={t("systemTitle")} />
                </p>
                <ul className="mt-5 space-y-3">
                  {systemItems.map((item) => (
                    <ListItem key={item} accent>
                      {item}
                    </ListItem>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={180} className="mx-auto mt-8 max-w-5xl">
          <div className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-[0_26px_80px_-52px_rgba(139,92,246,0.72)] backdrop-blur md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-2xl font-extrabold leading-tight tracking-tight text-dark md:text-3xl">
                  {t("cta.text")}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href="/projekte" className={quickLinkClass}>
                    {t("links.projects")}
                  </Link>
                  <a href={contactHref(locale)} className={quickLinkClass}>
                    {t("links.contact")}
                  </a>
                  <Link
                    href={{ pathname: "/standorte/[slug]", params: { slug: "halle" } }}
                    className={quickLinkClass}
                  >
                    {t("links.seoHalle")}
                  </Link>
                  <Link
                    href={{
                      pathname: "/leistungen/[slug]",
                      params: { slug: aiServiceSlugs[locale] },
                    }}
                    className={quickLinkClass}
                  >
                    {t("links.aiHalle")}
                  </Link>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <a
                  href={contactHref(locale)}
                  className={cn(
                    "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 text-center text-sm font-bold text-white shadow-[0_18px_38px_-18px_rgba(139,92,246,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-20px_rgba(139,92,246,0.95)]",
                  )}
                >
                  {t("cta.button")}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <Link
                  href="/projekte"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-line bg-white px-5 py-3 text-center text-sm font-bold text-dark transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-purple/35 hover:text-brand-purple"
                >
                  {t("cta.secondary")}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
