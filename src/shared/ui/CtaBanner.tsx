import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BrandText } from "./BrandText";
import { Container } from "./Container";

export function CtaBanner() {
  const t = useTranslations("Pages");

  return (
    <section className="py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[28px] bg-dark p-10 text-center md:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(600px 320px at 50% 0%, rgba(255,79,163,0.28), transparent 60%), radial-gradient(500px 300px at 80% 100%, rgba(139,92,246,0.26), transparent 60%)",
            }}
          />
          <div className="relative">
            <h2 className="text-[clamp(24px,3vw,38px)] font-bold tracking-tight text-white">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[16px] text-gray-400">
              <BrandText text={t("ctaText")} />
            </p>
            <Link
              href="/kontakt"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white transition hover:-translate-y-0.5"
            >
              {t("ctaButton")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
