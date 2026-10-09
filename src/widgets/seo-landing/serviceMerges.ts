/**
 * Service page consolidation.
 *
 * The original CMS-backed Performance service and the later, substantially
 * stronger performance-optimization landing page cover the same search intent.
 * Keep only the richer page indexable and redirect the legacy slug so existing
 * signals are preserved.
 */

export type ServiceMergeLocale = "de" | "en" | "ru";

/** Legacy CMS slug -> surviving service slug, per locale. */
export const SERVICE_SLUG_MERGES: Record<ServiceMergeLocale, Record<string, string>> = {
  de: {
    performance: "performance-optimierung",
  },
  en: {
    performance: "performance-optimization",
  },
  ru: {
    proizvoditelnost: "optimizaciya-proizvoditelnosti",
  },
};

function isServiceMergeLocale(locale: string): locale is ServiceMergeLocale {
  return locale === "de" || locale === "en" || locale === "ru";
}

/** True when this service slug has been superseded and must not be indexed. */
export function isMergedServiceSlug(locale: string, slug: string): boolean {
  if (!isServiceMergeLocale(locale)) return false;
  return slug in SERVICE_SLUG_MERGES[locale];
}
