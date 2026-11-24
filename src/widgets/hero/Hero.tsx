import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { Button } from "@/shared/ui/Button";
import { getContactHref } from "@/shared/lib/contactHref";
import { getLocalizedHref } from "@/shared/lib/localizedPath";
import { HeroShowcase } from "./HeroShowcase";

/**
 * First screen. The lead is one sentence and the primary CTA follows it
 * directly, so a phone viewport (390×844) shows headline, offer and button
 * before the consent banner or any scrolling.
 */
export function Hero() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const projectsHref = getLocalizedHref(locale, "projects");

  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-8 md:py-20 lg:py-24">
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

      <Container className="grid items-center gap-14 md:grid-cols-[1.02fr_0.98fr] md:gap-12 lg:gap-16">
        <div>
          <span className="hero-reveal hero-reveal-1 mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-[13px] font-medium text-gray-700 backdrop-blur-xs">
            <span className="h-[7px] w-[7px] rounded-full bg-success animate-[pulse-dot_2.4s_ease-out_infinite]" />
            {t("badge")}
          </span>

          <h1 className="mb-4 text-[clamp(36px,5.4vw,64px)] font-bold leading-[1.06] tracking-tight text-dark">
            {t("titleA")}
            <span className="text-gradient text-gradient-animated">{t("titleB")}</span>
          </h1>

          <p className="mb-6 max-w-[560px] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-ink">
            {t("lead")}
          </p>

          <div className="hero-reveal hero-reveal-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button href={getContactHref(locale)} prefetch={false} className="w-full sm:w-auto">
              {t("ctaPrimary")}
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Button>
            <Button href={projectsHref} prefetch={false} variant="ghost" className="w-full sm:w-auto">
              {t("ctaSecondary")}
            </Button>
          </div>

          <p className="hero-reveal hero-reveal-3 mt-4 flex items-center gap-2 text-[13.5px] text-muted">
            <Check size={16} className="shrink-0 text-success" />
            {t("note")}
          </p>
        </div>

        <HeroShowcase />
      </Container>
    </section>
  );
}
