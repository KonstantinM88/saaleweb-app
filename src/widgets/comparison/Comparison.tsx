import { getLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight, Check } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { getAuditHref } from "@/shared/lib/localizedPath";
import { BeforeAfter, type RelaunchDemoCopy } from "./BeforeAfter";

/** An illustrative relaunch with concrete scope, rather than claims about competitors. */
export async function Comparison() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Relaunch" });

  return (
    <section id="relaunch" aria-labelledby="relaunch-title" className="scroll-mt-24 overflow-hidden bg-surface py-16 md:py-24">
      <Container>
        <div className="mb-9 grid min-w-0 gap-5 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-14">
          <Reveal>
            <span className="eyebrow">{t("eyebrow")}</span>
            <h2 id="relaunch-title" className="mt-4 text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.1] tracking-tight text-dark">{t("title")}</h2>
          </Reveal>
          <Reveal>
            <p className="text-[17px] leading-relaxed text-ink">{t("lead")}</p>
            <a href={getAuditHref(locale)} className="mt-6 inline-flex min-h-11 items-center gap-2 text-[15px] font-bold text-[#6D28D9] underline-offset-4 hover:underline">{t("cta")} <ArrowUpRight size={17} aria-hidden /></a>
          </Reveal>
        </div>
        <BeforeAfter copy={t.raw("demo") as RelaunchDemoCopy} />
        <p className="mt-8 flex items-start gap-2 rounded-2xl border border-line bg-white px-5 py-4 text-sm leading-relaxed text-ink"><Check size={18} className="mt-0.5 shrink-0 text-emerald-700" aria-hidden />{t("continuity")}</p>
      </Container>
    </section>
  );
}
