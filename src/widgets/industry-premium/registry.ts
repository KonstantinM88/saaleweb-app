import type { HotelLandingContent, PremiumLocale } from "./types";
import { hotelDe } from "./content/hotel.de";
import { hotelEn } from "./content/hotel.en";
import { hotelRu } from "./content/hotel.ru";

/**
 * Canonical industry slugs (the German slug, matching INDUSTRY_SLUGS in
 * `@/widgets/seo-landing/phase4Content`) that are rendered with the premium
 * template instead of the generic Phase-4 landing page.
 *
 * Adding an industry here is the only wiring needed: the route resolves the
 * canonical slug from any localized or alias slug and looks it up in this map.
 */
const premiumIndustries: Record<string, Record<PremiumLocale, HotelLandingContent>> = {
  "hotel-website": { de: hotelDe, en: hotelEn, ru: hotelRu },
};

export const premiumIndustrySlugs = Object.keys(premiumIndustries);

export function isPremiumIndustry(canonicalSlug: string): boolean {
  return canonicalSlug in premiumIndustries;
}

export function getPremiumIndustry(
  canonicalSlug: string,
  locale: string,
): HotelLandingContent | null {
  if (locale !== "de" && locale !== "en" && locale !== "ru") return null;
  return premiumIndustries[canonicalSlug]?.[locale] ?? null;
}
