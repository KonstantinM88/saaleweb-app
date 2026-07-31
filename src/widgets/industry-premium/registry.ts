import type {
  BeautyLandingContent,
  ConstructionLandingContent,
  HotelLandingContent,
  PremiumLocale,
  RestaurantLandingContent,
} from "./types";
import { constructionDe } from "./content/construction.de";
import { constructionEn } from "./content/construction.en";
import { constructionRu } from "./content/construction.ru";
import { beautyDe } from "./content/beauty.de";
import { beautyEn } from "./content/beauty.en";
import { beautyRu } from "./content/beauty.ru";
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
  | { kind: "restaurant"; byLocale: Record<PremiumLocale, RestaurantLandingContent> }
  | { kind: "construction"; byLocale: Record<PremiumLocale, ConstructionLandingContent> }
  | { kind: "beauty"; byLocale: Record<PremiumLocale, BeautyLandingContent> };

const premiumIndustries: Record<string, PremiumEntry> = {
  "hotel-website": {
    kind: "hotel",
    byLocale: { de: hotelDe, en: hotelEn, ru: hotelRu },
  },
  "restaurant-website": {
    kind: "restaurant",
    byLocale: { de: restaurantDe, en: restaurantEn, ru: restaurantRu },
  },
  "bauunternehmen-website": {
    kind: "construction",
    byLocale: { de: constructionDe, en: constructionEn, ru: constructionRu },
  },
  "beauty-studio-website": {
    kind: "beauty",
    byLocale: { de: beautyDe, en: beautyEn, ru: beautyRu },
  },
};

export type PremiumIndustry =
  | { kind: "hotel"; content: HotelLandingContent }
  | { kind: "restaurant"; content: RestaurantLandingContent }
  | { kind: "construction"; content: ConstructionLandingContent }
  | { kind: "beauty"; content: BeautyLandingContent };

export const premiumIndustrySlugs = Object.keys(premiumIndustries);

export function isPremiumIndustry(canonicalSlug: string): boolean {
  return canonicalSlug in premiumIndustries;
}

export function getPremiumIndustry(canonicalSlug: string, locale: string): PremiumIndustry | null {
  if (locale !== "de" && locale !== "en" && locale !== "ru") return null;

  const entry = premiumIndustries[canonicalSlug];
  if (!entry) return null;

  switch (entry.kind) {
    case "hotel":
      return { kind: "hotel", content: entry.byLocale[locale] };
    case "restaurant":
      return { kind: "restaurant", content: entry.byLocale[locale] };
    case "construction":
      return { kind: "construction", content: entry.byLocale[locale] };
    case "beauty":
      return { kind: "beauty", content: entry.byLocale[locale] };
    default: {
      const exhaustiveEntry: never = entry;
      return exhaustiveEntry;
    }
  }
}
