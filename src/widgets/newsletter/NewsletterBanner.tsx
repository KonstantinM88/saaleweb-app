import { useTranslations } from "next-intl";
import { NewsletterForm } from "./NewsletterForm";

export function NewsletterBanner() {
  const t = useTranslations("Newsletter");

  return (
    <section className="relative mt-14 overflow-hidden rounded-3xl border border-line bg-surface px-6 py-10 text-center md:px-10 md:py-12">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand-pink/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-brand-purple/10 blur-3xl" />
      </div>
      <div className="relative">
        <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-brand-pink">
          {t("eyebrow")}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-dark md:text-3xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[15px] text-muted">{t("text")}</p>
        <div className="mt-6 flex justify-center">
          <NewsletterForm variant="banner" />
        </div>
      </div>
    </section>
  );
}
