import { routing, type AppLocale } from "@/i18n/routing";

export const localizedRoutes = {
  services: { de: "/leistungen", en: "/services", ru: "/uslugi" },
  projects: { de: "/projekte", en: "/projects", ru: "/proekty" },
  industries: { de: "/branchen", en: "/industries", ru: "/otrasli" },
  locations: { de: "/standorte", en: "/locations", ru: "/goroda" },
  contact: { de: "/kontakt", en: "/contact", ru: "/kontakt" },
  pricing: { de: "/preise", en: "/pricing", ru: "/ceny" },
  blog: { de: "/blog", en: "/blog", ru: "/blog" },
} as const satisfies Record<string, Record<AppLocale, `/${string}`>>;

export type LocalizedRouteKey = keyof typeof localizedRoutes;

export function toAppLocale(locale: string): AppLocale {
  return routing.locales.includes(locale as AppLocale) ? (locale as AppLocale) : routing.defaultLocale;
}

export function withLocalePrefix(localeInput: string, path: `/${string}`): string {
  const locale = toAppLocale(localeInput);
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function getHomeHref(locale: string): string {
  return withLocalePrefix(locale, "/");
}

export function getAuditHref(locale: string): string {
  return `${getHomeHref(locale)}#website-audit`;
}

export function getLocalizedHref(locale: string, key: LocalizedRouteKey): string {
  const appLocale = toAppLocale(locale);
  return withLocalePrefix(appLocale, localizedRoutes[key][appLocale]);
}

export function getLocalizedSlugHref(locale: string, key: LocalizedRouteKey, slug: string): string {
  return `${getLocalizedHref(locale, key)}/${slug}`;
}
