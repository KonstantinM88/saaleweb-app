import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "en", "ru"],
  defaultLocale: "de",
  // German lives at "/", English at "/en", Russian at "/ru"
  localePrefix: "as-needed",
  // Localized URL segments. The keys are the internal (canonical) pathnames
  // that match the App Router folder structure; the values are the public,
  // per-locale URLs that next-intl rewrites to/from.
  pathnames: {
    "/": "/",
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/blog/kategorie/[slug]": {
      de: "/blog/kategorie/[slug]",
      en: "/blog/category/[slug]",
      ru: "/blog/kategoriya/[slug]",
    },
    "/leistungen": { de: "/leistungen", en: "/services", ru: "/uslugi" },
    "/leistungen/[slug]": {
      de: "/leistungen/[slug]",
      en: "/services/[slug]",
      ru: "/uslugi/[slug]",
    },
    "/branchen": { de: "/branchen", en: "/industries", ru: "/otrasli" },
    "/branchen/[slug]": {
      de: "/branchen/[slug]",
      en: "/industries/[slug]",
      ru: "/otrasli/[slug]",
    },
    "/kontakt": { de: "/kontakt", en: "/contact", ru: "/kontakt" },
    "/preise": { de: "/preise", en: "/pricing", ru: "/ceny" },
    "/projekte": { de: "/projekte", en: "/projects", ru: "/proekty" },
    "/projekte/[slug]": {
      de: "/projekte/[slug]",
      en: "/projects/[slug]",
      ru: "/proekty/[slug]",
    },
    "/standorte/[slug]": {
      de: "/standorte/[slug]",
      en: "/locations/[slug]",
      ru: "/goroda/[slug]",
    },
    "/impressum": { de: "/impressum", en: "/imprint", ru: "/impressum" },
    "/datenschutz": { de: "/datenschutz", en: "/privacy-policy", ru: "/datenschutz" },
  },
});

export type AppLocale = (typeof routing.locales)[number];
