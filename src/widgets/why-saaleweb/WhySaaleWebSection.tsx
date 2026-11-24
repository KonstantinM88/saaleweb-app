import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CheckCircle2,
  Gauge,
  Handshake,
  Lock,
  MessageCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { BrandText } from "@/shared/ui/BrandText";
import { getAuditHref } from "@/shared/lib/localizedPath";
import { QualityProof } from "./QualityProof";

type AdvantageKey = "visibility" | "inquiries" | "performance" | "security" | "support" | "contact";
type Advantage = { key: AdvantageKey; title: string; text: string };

const advantageIcons: Record<AdvantageKey, LucideIcon> = {
  visibility: Search,
  inquiries: MessageCircle,
  performance: Gauge,
  security: ShieldCheck,
  support: Lock,
  contact: Handshake,
};

/**
 * Practical differentiators plus sourced own-site quality measurements.
 */
const SHOWN: AdvantageKey[] = ["inquiries", "visibility", "performance", "security", "support", "contact"];

export async function WhySaaleWebSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "WhySaaleWeb" });
  const advantages = (t.raw("advantages") as Advantage[]).filter((item) => SHOWN.includes(item.key));
  advantages.sort((a, b) => SHOWN.indexOf(a.key) - SHOWN.indexOf(b.key));

  return (
    <section id="why-saaleweb" aria-labelledby="why-saaleweb-title" className="scroll-mt-24 py-16 md:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
          <Reveal>
            <span className="eyebrow">{t("eyebrow")}</span>
            <h2
              id="why-saaleweb-title"
              className="mt-4 text-[clamp(30px,4.2vw,50px)] font-extrabold leading-[1.06] tracking-tight text-dark"
            >
              <BrandText text={t("title")} />
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink">{t("lead")}</p>
            <p className="mt-6 text-[15px] leading-relaxed text-muted">{t("cta.note")}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={getAuditHref(locale)}
                className="btn-shine inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-[15px] font-bold text-white shadow-[0_18px_38px_-18px_rgba(139,92,246,0.85)] transition hover:-translate-y-0.5"
              >
                {t("cta.button")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <Link
                href="/projekte"
                prefetch={false}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-[15px] font-bold text-dark transition hover:-translate-y-0.5 hover:border-brand-purple/35 hover:text-brand-purple"
              >
                {t("cta.secondary")}
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {advantages.map((item, index) => {
              const Icon = advantageIcons[item.key] ?? CheckCircle2;
              return (
                <Reveal key={item.key} delay={index * 80}>
                  <article className="group flex h-full gap-3 rounded-[20px] border border-line bg-white p-4 shadow-[0_22px_60px_-48px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/25">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-purple transition-all duration-300 group-hover:bg-brand group-hover:text-white">
                      <Icon className="h-4 w-4" aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-dark">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
        <QualityProof />
      </Container>
    </section>
  );
}
