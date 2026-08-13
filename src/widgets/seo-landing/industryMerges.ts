/**
 * Industry page consolidation.
 *
 * Two generations of industry pages lived under /branchen/[slug]: the original
 * CMS-backed set (hotels, restaurants, …) and the purpose-built premium
 * templates (hotel-website, restaurant-website, …). Both were indexable and
 * both were linked from the homepage, so Google kept the pair around position
 * 60+ instead of ranking one of them. Search Console, 28 days:
 *
 *   /branchen/hotel-website  389 impressions, position 68.9
 *   /branchen/kanzleien       54 impressions, position 64.7
 *   /branchen/restaurants     18 impressions, position 41.4
 *
 * The premium template wins in every overlapping pair. The legacy slug is
 * redirected (301) so its signals transfer instead of competing.
 *
 * Industries with no premium counterpart — law firms, medical practices, real
 * estate — are untouched and stay exactly where they are.
 */

export type MergeLocale = "de" | "en" | "ru";

/** Legacy CMS slug → premium slug, per locale. */
export const INDUSTRY_SLUG_MERGES: Record<MergeLocale, Record<string, string>> = {
  de: {
    hotels: "hotel-website",
    restaurants: "restaurant-website",
    "beauty-salons": "beauty-studio-website",
    bau: "bauunternehmen-website",
    handwerk: "handwerker-website",
  },
  en: {
    hotels: "hotel-website",
    restaurants: "restaurant-website",
    "beauty-salons": "beauty-studio-website",
    construction: "construction-company-website",
    craftsmen: "craftsmen-website",
  },
  ru: {
    oteli: "sayt-dlya-otelya",
    restorany: "sayt-dlya-restorana",
    "beauty-salony": "sayt-dlya-salona-krasoty",
    stroitelstvo: "sayt-dlya-stroitelnoy-kompanii",
    remeslenniki: "sayt-dlya-masterov",
  },
};

/** URL prefix of the industries section per locale. */
export const INDUSTRY_PATH_PREFIX: Record<MergeLocale, string> = {
  de: "/branchen",
  en: "/en/industries",
  ru: "/ru/otrasli",
};

function isMergeLocale(locale: string): locale is MergeLocale {
  return locale === "de" || locale === "en" || locale === "ru";
}

/** True when this slug has been superseded and must not be linked or indexed. */
export function isMergedIndustrySlug(locale: string, slug: string): boolean {
  if (!isMergeLocale(locale)) return false;
  return slug in INDUSTRY_SLUG_MERGES[locale];
}

/** Returns the surviving slug for a legacy slug, or the slug unchanged. */
export function resolveIndustrySlug(locale: string, slug: string): string {
  if (!isMergeLocale(locale)) return slug;
  return INDUSTRY_SLUG_MERGES[locale][slug] ?? slug;
}

/** Redirect pairs for next.config.mjs, expanded across all three locales. */
export function industryMergeRedirects(): { source: string; destination: string }[] {
  return (Object.keys(INDUSTRY_SLUG_MERGES) as MergeLocale[]).flatMap((locale) =>
    Object.entries(INDUSTRY_SLUG_MERGES[locale]).map(([from, to]) => ({
      source: `${INDUSTRY_PATH_PREFIX[locale]}/${from}`,
      destination: `${INDUSTRY_PATH_PREFIX[locale]}/${to}`,
    })),
  );
}
