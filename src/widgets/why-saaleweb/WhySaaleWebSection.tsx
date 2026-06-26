import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Gauge,
  Handshake,
  Lock,
  MessageCircle,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { BrandText } from "@/shared/ui/BrandText";
import { cn } from "@/shared/lib/cn";
import { getContactHref } from "@/shared/lib/contactHref";

type PillarKey = "design" | "seo" | "ai" | "results";
type AdvantageKey = "visibility" | "inquiries" | "performance" | "security" | "support" | "contact";

type Pillar = {
  key: PillarKey;
  title: string;
  text: string;
  metric: string;
};

type Advantage = {
  key: AdvantageKey;
  title: string;
  text: string;
};

const pillarIcons: Record<PillarKey, LucideIcon> = {
  design: Palette,
  seo: Search,
  ai: Bot,
  results: TrendingUp,
};

const advantageIcons: Record<AdvantageKey, LucideIcon> = {
  visibility: Search,
  inquiries: MessageCircle,
  performance: Gauge,
  security: ShieldCheck,
  support: Lock,
  contact: Handshake,
};

const quickLinkClass =
  "inline-flex items-center rounded-full border border-line bg-white/80 px-3 py-1.5 text-[13px] font-semibold text-muted transition-colors hover:border-brand-purple/30 hover:text-brand-purple";

export async function WhySaaleWebSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "WhySaaleWeb" });
  const pillars = t.raw("pillars") as Pillar[];
  const advantages = t.raw("advantages") as Advantage[];

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
          </Reveal>
        </div>

        <div className="mt-12">
          <Reveal>
            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">{t("pillarsTitle")}</p>
                <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-dark md:text-3xl">
                  {t("pillarsHeading")}
                </h3>
              </div>
              <p className="max-w-xl text-[15px] leading-relaxed text-muted">{t("pillarsLead")}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((item, index) => {
              const Icon = pillarIcons[item.key] ?? Sparkles;

              return (
                <Reveal key={item.key} delay={(index % 4) * 70} className="h-full">
                  <article className="card-border-glow group relative h-full overflow-hidden rounded-[24px] border border-line bg-white/92 p-6 shadow-[0_24px_70px_-44px_rgba(15,23,42,0.48)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-purple/25 hover:shadow-[0_32px_84px_-46px_rgba(139,92,246,0.55)]">
                    <span
                      aria-hidden
                      className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-brand-pink/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <div className="grid h-[52px] w-[52px] place-items-center rounded-2xl border border-brand-purple/10 bg-brand-soft text-brand-purple transition-all duration-300 group-hover:border-transparent group-hover:bg-brand group-hover:text-white group-hover:shadow-[0_18px_34px_-16px_rgba(139,92,246,0.78)]">
                        <Icon className="h-6 w-6" aria-hidden />
                      </div>
                      <span className="rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-bold uppercase text-muted">
                        {item.metric}
                      </span>
                    </div>
                    <h4 className="text-xl font-extrabold tracking-tight text-dark">{item.title}</h4>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>

        <div className="mt-12 rounded-[30px] border border-line bg-white/82 p-5 shadow-[0_28px_80px_-58px_rgba(15,23,42,0.52)] backdrop-blur md:p-8">
          <Reveal>
            <div className="mb-7 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="eyebrow">{t("advantagesTitle")}</p>
                <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-dark md:text-3xl">
                  {t("advantagesHeading")}
                </h3>
              </div>
              <p className="text-[15.5px] leading-relaxed text-muted">{t("advantagesLead")}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {advantages.map((item, index) => {
              const Icon = advantageIcons[item.key] ?? CheckCircle2;

              return (
                <Reveal key={item.key} delay={(index % 3) * 70} className="h-full">
                  <article className="group flex h-full gap-4 rounded-[20px] border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/25 hover:shadow-[0_24px_64px_-42px_rgba(139,92,246,0.48)]">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand-purple transition-all duration-300 group-hover:bg-brand group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-dark">{item.title}</h4>
                      <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{item.text}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal delay={180} className="mx-auto mt-8 max-w-5xl">
          <div className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-[0_26px_80px_-52px_rgba(139,92,246,0.72)] backdrop-blur md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-2xl font-extrabold leading-tight tracking-tight text-dark md:text-3xl">
                  {t("cta.text")}
                </p>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{t("cta.note")}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href="/projekte" className={quickLinkClass}>
                    {t("links.projects")}
                  </Link>
                  <a href={getContactHref(locale)} className={quickLinkClass}>
                    {t("links.contact")}
                  </a>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <a
                  href={getContactHref(locale)}
                  className={cn(
                    "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 text-center text-sm font-bold text-white shadow-[0_18px_38px_-18px_rgba(139,92,246,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-20px_rgba(139,92,246,0.95)]",
                  )}
                >
                  {t("cta.button")}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <Link
                  href="/projekte"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-line bg-white px-5 py-3 text-center text-sm font-bold text-dark transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-purple/[0.35] hover:text-brand-purple"
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
