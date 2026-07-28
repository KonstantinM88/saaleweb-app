import type { HotelLandingContent, PremiumLocale, RestaurantLandingContent } from "./types";
import { hotelDe } from "./content/hotel.de";
import { hotelEn } from "./content/hotel.en";
import { hotelRu } from "./content/hotel.ru";
import { restaurantDe } from "./content/restaurant.de";
import { restaurantEn } from "./content/restaurant.en";
import { restaurantRu } from "./content/restaurant.ru";

/**
 * Canonical industry slugs (the German slug, matching INDUSTRY_SLUGS in
 * `@/widgets/seo-landing/phase4Content`) that are rendered with a dedicated
 * premium template instead of the generic Phase-4 landing page.
 *
 * Each entry declares its own `kind`, because the templates are deliberately
 * not interchangeable: a hotel page is built around booking economics, a
 * restaurant page around the menu. Adding an industry means adding content,
 * a template and one line here.
 */
type PremiumEntry =
  | { kind: "hotel"; byLocale: Record<PremiumLocale, HotelLandingContent> }
  | { kind: "restaurant"; byLocale: Record<PremiumLocale, RestaurantLandingContent> };

const premiumIndustries: Record<string, PremiumEntry> = {
  "hotel-website": {
    kind: "hotel",
    byLocale: { de: hotelDe, en: hotelEn, ru: hotelRu },
  },
  "restaurant-website": {
    kind: "restaurant",
    byLocale: { de: restaurantDe, en: restaurantEn, ru: restaurantRu },
  },
};

export type PremiumIndustry =
  | { kind: "hotel"; content: HotelLandingContent }
  | { kind: "restaurant"; content: RestaurantLandingContent };

export const premiumIndustrySlugs = Object.keys(premiumIndustries);

export function isPremiumIndustry(canonicalSlug: string): boolean {
  return canonicalSlug in premiumIndustries;
}

export function getPremiumIndustry(canonicalSlug: string, locale: string): PremiumIndustry | null {
  if (locale !== "de" && locale !== "en" && locale !== "ru") return null;

  const entry = premiumIndustries[canonicalSlug];
  if (!entry) return null;

  return entry.kind === "hotel"
    ? { kind: "hotel", content: entry.byLocale[locale] }
    : { kind: "restaurant", content: entry.byLocale[locale] };
}
