import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { Button } from "@/shared/ui/Button";
import { getContactHref } from "@/shared/lib/contactHref";
import { Dashboard } from "./Dashboard";

export function Hero() {
  const t = useTranslations("Hero");
  const locale = useLocale();

  return (
    <section id="top" className="relative overflow-hidden py-12 md:py-24">
      {/* Living-gradient backdrop and engineering grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="hero-gradient-field"
          style={{
            background:
              "linear-gradient(120deg, rgba(255,79,163,0.14), transparent 32%, rgba(139,92,246,0.13) 66%, transparent), conic-gradient(from 210deg at 50% 30%, rgba(255,79,163,0.10), rgba(139,92,246,0.12), rgba(255,79,163,0.06), transparent 78%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(17,24,39,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,24,39,0.05) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
            maskImage: "radial-gradient(ellipse 90% 65% at 50% 0%, #000 25%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 65% at 50% 0%, #000 25%, transparent 78%)",
          }}
        />
      </div>

      <Container className="grid items-center gap-10 md:grid-cols-[1.02fr_0.98fr] md:gap-14">
        <div className="hero-stagger">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-[13px] font-medium text-gray-700 backdrop-blur-sm">
            <span className="h-[7px] w-[7px] rounded-full bg-success [animation:pulse-dot_2.4s_ease-out_infinite]" />
            {t("badge")}
          </span>

          <h1 className="mb-5 text-[clamp(38px,5.4vw,64px)] font-bold leading-[1.08] tracking-tight text-dark">
            {t("titleA")}
            <span className="text-gradient text-gradient-animated">{t("titleB")}</span>
          </h1>

          <p className="mb-8 max-w-[560px] text-[clamp(16px,1.6vw,19px)] text-muted">
            <b className="font-semibold text-ink">{t("lead1")}</b>
            <br />
            {t("lead2")}
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <Button href={getContactHref(locale)}>
              {t("ctaPrimary")}
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Button>
            <Button href="#pricing" variant="ghost">
              {t("ctaSecondary")}
            </Button>
          </div>

          <p className="mt-5 flex items-center gap-2 text-[13.5px] text-muted">
            <Check size={16} className="text-success" />
            {t("note")}
          </p>
        </div>

        <Dashboard />
      </Container>
    </section>
  );
}
