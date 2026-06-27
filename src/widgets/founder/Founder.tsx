import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Handshake, RefreshCw, ShieldCheck } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { CountUp } from "@/shared/ui/CountUp";
import { BrandText } from "@/shared/ui/BrandText";
import { TrustPointCard } from "@/shared/ui/TrustPointCard";
import { getContactHref } from "@/shared/lib/contactHref";

type Stat = { value: string; label: string };
type FounderPoint = { title: string; text: string };

const pointIcons = [Handshake, RefreshCw, ShieldCheck];

export function Founder() {
  const t = useTranslations("Founder");
  const locale = useLocale();
  const stats = t.raw("stats") as Stat[];
  const points = t.raw("points") as FounderPoint[];

  return (
    <section className="bg-surface py-16 md:py-24">
      <Container>
        <Reveal>
          <div className="grid items-center gap-8 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8 md:grid-cols-[280px_1fr] md:gap-11 md:p-11">
            <div className="glow-card mx-auto w-full max-w-[260px] shadow-card">
              <div className="auto-shine relative grid aspect-square w-full place-items-center overflow-hidden rounded-[22px] bg-brand">
                <span className="text-6xl font-extrabold text-white/[0.9]">KM</span>
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 70% 20%, rgba(255,255,255,0.3), transparent 55%)",
                  }}
                />
                <div className="absolute right-3 top-3 flex animate-bob items-center gap-1 rounded-lg bg-white/[0.95] px-2 py-1 text-[11px] font-bold text-dark shadow-card">
                  5.0
                </div>
              </div>
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.1em] text-brand-purple">
                <BrandText text={t("role")} />
              </div>
              <h2 className="mb-3.5 mt-2 text-2xl font-bold text-dark">
                <BrandText text={t("title")} />
              </h2>
              <p className="mb-5 max-w-[560px] text-[15.5px] text-muted">
                <BrandText text={t("bio")} />
              </p>
              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                {points.map((point, index) => {
                  const Icon = pointIcons[index] ?? Handshake;

                  return (
                    <TrustPointCard
                      key={point.title}
                      icon={Icon}
                      title={point.title}
                      text={point.text}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-6 sm:gap-9">
                {stats.map((s, i) => (
                  <div key={i}>
                    <b className="block text-2xl text-dark">
                      <CountUp value={s.value} />
                    </b>
                    <span className="text-[13px] text-muted">{s.label}</span>
                  </div>
                ))}
              </div>
              <a
                href={getContactHref(locale)}
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-[15px] font-bold text-white transition hover:-translate-y-0.5"
              >
                {t("cta")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
