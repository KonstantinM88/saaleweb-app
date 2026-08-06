import { ArrowUpRight, Check, MessageCircle, Phone, Send } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { siteConfig } from "@/shared/config/site";
import { getContactHref } from "@/shared/lib/contactHref";
import { BrandText } from "@/shared/ui/BrandText";
import { Container } from "@/shared/ui/Container";

export async function Contact({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Contact" });
  const trustPoints = [t("response"), t("consultation"), t("noPressure")];

  return (
    <section id="contact" className="py-16 md:py-24" aria-labelledby="contact-cta-title">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-[#0f1728] px-6 py-8 shadow-[0_36px_100px_-50px_rgba(15,23,42,0.9)] sm:px-10 sm:py-10 lg:px-14 lg:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(720px 420px at 0% 0%, rgba(255,79,163,0.22), transparent 60%), radial-gradient(680px 400px at 100% 100%, rgba(139,92,246,0.24), transparent 62%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 bottom-10 -z-10 h-48 w-48 rounded-full border border-brand-pink/15"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full border border-brand-purple/15"
          />

          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-14">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-brand-pink">
                {t("eyebrow")}
              </span>
              <h2
                id="contact-cta-title"
                className="mt-4 max-w-xl text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.08] tracking-tight text-white"
              >
                {t("title")}
              </h2>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-slate-300 md:text-lg">
                <BrandText text={t("lead")} />
              </p>

              <ul className="mt-7 grid gap-3 text-sm font-semibold text-slate-200 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {trustPoints.map((point) => (
                  <li key={point} className="flex items-center gap-2.5">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
                      <Check className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[24px] border border-white/12 bg-white/[0.075] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm sm:p-5">
              <div className="px-2 pb-4">
                <p className="text-sm font-bold text-white">{t("choiceTitle")}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{t("choiceText")}</p>
              </div>

              <a
                href={getContactHref(locale)}
                className="group flex min-h-24 items-center gap-4 rounded-[18px] border border-white/10 bg-white px-4 py-4 text-dark shadow-[0_22px_48px_-28px_rgba(0,0,0,0.75)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_62px_-30px_rgba(139,92,246,0.7)] sm:px-5"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand text-white shadow-[0_14px_28px_-16px_rgba(139,92,246,0.95)]">
                  <Send className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-extrabold sm:text-lg">{t("primary")}</span>
                  <span className="mt-0.5 block text-sm leading-snug text-muted">{t("primaryHint")}</span>
                </span>
                <ArrowUpRight
                  className="h-5 w-5 shrink-0 text-brand-purple transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <a
                  href={siteConfig.phone.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-20 items-center gap-3 rounded-[18px] border border-emerald-300/15 bg-emerald-300/[0.08] px-4 py-3.5 text-white transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/30 hover:bg-emerald-300/[0.12]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300">
                    <MessageCircle className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-extrabold">{t("whatsapp")}</span>
                    <span className="mt-0.5 block text-xs text-slate-400">{t("whatsappHint")}</span>
                  </span>
                </a>

                <a
                  href={siteConfig.phone.href}
                  className="group flex min-h-20 items-center gap-3 rounded-[18px] border border-violet-300/15 bg-violet-300/[0.08] px-4 py-3.5 text-white transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/30 hover:bg-violet-300/[0.12]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-300/15 text-violet-200">
                    <Phone className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-extrabold">{t("call")}</span>
                    <span className="mt-0.5 block text-xs text-slate-400">{siteConfig.phone.display}</span>
                  </span>
                </a>
              </div>

              <p className="px-2 pt-4 text-xs leading-relaxed text-slate-500">{t("privacy")}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
