import { siteConfig } from "@/shared/config/site";

/** Absolute URL to the dynamic OG image for a page. */
export function ogImageUrl(input: { title: string; eyebrow?: string }): string {
  const params = new URLSearchParams({ title: input.title });
  if (input.eyebrow) params.set("eyebrow", input.eyebrow);
  return `${siteConfig.url}/api/og?${params.toString()}`;
}

// English copy uses British spelling ("optimisation"), hence en_GB.
const OG_LOCALES = { de: "de_DE", en: "en_GB", ru: "ru_RU" } as const;

/** Open Graph locale (`de_DE`) for an app locale; unknown values fall back to German. */
export function ogLocale(locale: string): string {
  return OG_LOCALES[locale as keyof typeof OG_LOCALES] ?? OG_LOCALES.de;
}

/** The other published Open Graph locales, for `og:locale:alternate`. */
export function ogAlternateLocales(locale: string): string[] {
  const current = ogLocale(locale);
  return Object.values(OG_LOCALES).filter((value) => value !== current);
}
