import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, CheckCircle2, Gauge, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { getContactHref } from "@/shared/lib/contactHref";

type Metric = {
  label: string;
  value: string;
  note: string;
};

const metricIcons = [Gauge, Gauge, LineChart, ShieldCheck, Sparkles, CheckCircle2];

export async function PerformanceProof() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "PerformanceProof" });
  const metrics = t.raw("metrics") as Metric[];
  const flow = t.raw("flow.items") as string[];

  return (
    <section
      id="performance-proof"
      aria-labelledby="performance-proof-title"
      className="overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7f8fb_45%,#ffffff_100%)] py-16 md:py-24"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="eyebrow">{t("eyebrow")}</span>
          </Reveal>
          <Reveal delay={80}>
            <h2
              id="performance-proof-title"
              className="mt-4 text-[clamp(30px,4.5vw,52px)] font-extrabold leading-tight tracking-tight text-dark"
            >
              {t("title")}
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-5 max-w-2xl text-[clamp(16px,1.7vw,19px)] leading-relaxed text-muted">
              {t("lead")}
            </p>
          </Reveal>
          <Reveal delay={170}>
            <p className="mx-auto mt-4 max-w-xl text-[14px] font-semibold text-ink">
              {t("trustLine")}
            </p>
          </Reveal>
        </div>

        <Reveal delay={180} className="mt-10 md:mt-14">
          <div className="relative mx-auto max-w-6xl">
            <div
              aria-hidden
              className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-brand-pink/[0.18] via-brand-purple/[0.14] to-transparent blur-2xl"
            />
            <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white p-3 shadow-[0_36px_100px_-58px_rgba(15,23,42,0.65)] md:p-4">
              <Image
                src="/images/sections/saaleweb-performance-proof.webp"
                alt={t("imageAlt")}
                width={1536}
                height={1024}
                sizes="(min-width: 1280px) 1120px, 96vw"
                className="h-auto w-full rounded-[22px] object-cover"
                priority={false}
              />
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, index) => {
            const Icon = metricIcons[index] ?? Gauge;

            return (
              <Reveal key={metric.label} delay={(index % 3) * 70} className="h-full">
                <article className="card-border-glow group h-full rounded-[20px] border border-line bg-white p-5 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_78px_-44px_rgba(139,92,246,0.52)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand-purple transition-all duration-300 group-hover:bg-brand group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase text-emerald-700">
                      {metric.note}
                    </span>
                  </div>
                  <p className="mt-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
                    {metric.label}
                  </p>
                  <strong className="mt-1 block text-[clamp(30px,4vw,44px)] font-extrabold leading-none tracking-tight text-dark">
                    {metric.value}
                  </strong>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120} className="mt-8">
          <div className="rounded-[28px] border border-line bg-white/[0.88] p-6 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.5)] backdrop-blur md:p-8">
            <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p className="eyebrow">{t("flow.title")}</p>
                <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-dark md:text-3xl">
                  {t("flow.heading")}
                </h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{t("disclaimer")}</p>
              </div>

              <ol className="grid gap-3 sm:grid-cols-5">
                {flow.map((item, index) => (
                  <li
                    key={item}
                    className="relative rounded-2xl border border-line bg-surface px-4 py-3 text-sm font-bold text-dark"
                  >
                    <span className="mb-2 block font-mono text-[11px] text-brand-purple">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item}
                    {index < flow.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-brand-purple sm:block"
                      >
                        →
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-7 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-center">
              <a
                href={getContactHref(locale)}
                className="btn-shine inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 text-center text-sm font-bold text-white shadow-[0_18px_38px_-18px_rgba(139,92,246,0.85)] transition-all hover:-translate-y-0.5"
              >
                {t("cta.primary")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <Link
                href="/projekte"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-line bg-white px-5 py-3 text-center text-sm font-bold text-dark transition-all hover:-translate-y-0.5 hover:border-brand-purple/[0.35] hover:text-brand-purple"
              >
                {t("cta.secondary")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
