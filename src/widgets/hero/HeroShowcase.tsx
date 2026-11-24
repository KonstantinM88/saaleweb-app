import { ArrowUpRight, MessageSquareQuote } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/shared/config/site";
import { ProjectDevices } from "@/shared/ui/ProjectDevices";
import { getHeroMetrics } from "./liveMetrics";

export async function HeroShowcase() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Hero.showcase" });
  const metrics = await getHeroMetrics();
  return <div className="dash-enter mx-auto w-full max-w-[600px]" aria-label={t("label")}>
    <div className="relative pt-5">
      <Link href={{ pathname: "/projekte/[slug]", params: { slug: "neue-liebe-nebra" } }} prefetch={false} className="block overflow-hidden rounded-[24px] border border-white bg-white shadow-lift outline-hidden transition-transform hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-4">
        <ProjectDevices desktop="/images/project-captures/2026-11-17/neue-liebe.webp" mobile="/images/project-captures/2026-11-17/neue-liebe-mobile.webp" name={t("primaryName")} domain="neueliebe-nebra.de" desktopLabel={t("desktop")} mobileLabel={t("mobile")} priority />
      </Link>
      <a href={siteConfig.googleBusiness.placeUrl} target="_blank" rel="noopener noreferrer" className="absolute right-0 top-0 flex min-h-11 items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-xs font-bold text-dark shadow-card hover:border-brand-purple">
        <MessageSquareQuote size={17} className="text-[#6D28D9]" aria-hidden />{t("google")}<ArrowUpRight size={14} aria-hidden />
      </a>
      <div title={`${metrics.measuredAt} · Google Lighthouse · saaleweb.de`} className="mt-3 inline-flex rounded-xl border border-line bg-white px-3 py-2 text-[11px] font-semibold text-dark shadow-card">⚡ {t("lighthouse", { score: metrics.pageSpeed })}</div>
    </div>
    <p className="mt-3 text-[13px] leading-relaxed text-muted"><b className="font-semibold text-dark">{t("primaryName")}</b> · {t("primaryMeta")}</p>
  </div>;
}
