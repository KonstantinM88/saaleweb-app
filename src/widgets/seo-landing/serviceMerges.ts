/**
 * Service page consolidation.
 *
 * Only explicitly reviewed equivalent pages are consolidated. The 2026-10-30
 * GSC review authorized two DE-only pairs; their EN/RU pages remain available.
 */

export type ServiceMergeLocale = "de" | "en" | "ru";

/** Legacy CMS slug -> surviving service slug, per locale. */
export const SERVICE_SLUG_MERGES: Record<ServiceMergeLocale, Record<string, string>> = {
  de: {
    performance: "performance-optimierung",
    "website-entwicklung": "website-erstellen-lassen",
    wartung: "website-wartung",
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

/** Used by language navigation; metadata must omit the retired translation. */
export function resolveServiceSlug(locale: string, slug: string): string {
  return isServiceMergeLocale(locale) ? SERVICE_SLUG_MERGES[locale][slug] ?? slug : slug;
}
