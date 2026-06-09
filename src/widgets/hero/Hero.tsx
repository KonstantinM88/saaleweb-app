import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { Button } from "@/shared/ui/Button";
import { Dashboard } from "./Dashboard";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section id="top" className="relative overflow-hidden py-20 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(720px 420px at 78% 8%, rgba(139,92,246,0.14), transparent 60%), radial-gradient(620px 380px at 15% 0%, rgba(255,79,163,0.12), transparent 55%)",
        }}
      />
      <Container className="grid items-center gap-14 md:grid-cols-[1.02fr_0.98fr]">
        <div>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-medium text-gray-700">
            <span className="h-[7px] w-[7px] rounded-full bg-success shadow-[0_0_0_3px_rgba(16,185,129,0.18)]" />
            {t("badge")}
          </span>

          <h1 className="mb-5 text-[clamp(38px,5.4vw,64px)] font-bold leading-[1.08] tracking-tight text-dark">
            {t("titleA")}
            <span className="text-gradient">{t("titleB")}</span>
          </h1>

          <p className="mb-8 max-w-[560px] text-[clamp(16px,1.6vw,19px)] text-muted">
            <b className="font-semibold text-ink">{t("lead1")}</b>
            <br />
            {t("lead2")}
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <Button href="#contact">{t("ctaPrimary")} →</Button>
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
