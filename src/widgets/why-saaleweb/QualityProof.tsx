import { getLocale, getTranslations } from "next-intl/server";
import { getHeroMetrics } from "@/widgets/hero/liveMetrics";

/** Public measurements of our own site, never a customer ROI or ranking claim. */
export async function QualityProof() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "QualityProof" });
  const metrics = await getHeroMetrics();
  const scores = [
    { label: t("performance"), score: metrics.pageSpeed },
    { label: t("seo"), score: metrics.seoScore },
    { label: t("accessibility"), score: metrics.accessibilityScore },
    { label: t("practices"), score: metrics.bestPracticesScore },
  ];
  return (
    <div className="mt-10 overflow-hidden rounded-[24px] border border-line bg-surface p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-lg font-bold text-dark">{t("title")}</h3><p className="mt-1 text-sm text-muted">{t("source", { date: metrics.measuredAt })}</p></div><span className="rounded-full border border-line bg-white px-3 py-1 font-mono text-[11px] text-ink">Google Lighthouse</span></div>
      <dl className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
        {scores.map(({ label, score }) => (
          <div key={label} className="flex min-w-0 flex-col text-center">
            <dt className="order-2 mt-3 text-[13px] font-semibold leading-snug text-ink">{label}</dt>
            <dd className="relative order-1 mx-auto grid h-20 w-20 place-items-center">
              <svg aria-hidden viewBox="0 0 80 80" className="absolute inset-0 h-20 w-20 -rotate-90"><circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="5" /><circle cx="40" cy="40" r="34" fill="none" stroke={score >= 90 ? "#047857" : "#b45309"} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${(score / 100) * 213.63} 213.63`} /></svg>
              <span className="text-2xl font-extrabold text-dark">{score}<span className="sr-only"> / 100</span></span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-muted">{t("method")}</p>
    </div>
  );
}
