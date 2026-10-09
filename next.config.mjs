// @ts-check

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const permanentCompatibilityRedirects = [
  // Earlier compatibility aliases that may still exist in external indexes.
  { source: "/en/services/webdesign-halle", destination: "/en/services/web-design-halle" },
  { source: "/en/services/get-a-website", destination: "/en/services/website-development" },
  {
    source: "/en/services/modernize-wordpress-website",
    destination: "/en/services/wordpress-website-modernization",
  },
  { source: "/ru/uslugi/zakazat-sajt", destination: "/ru/uslugi/razrabotka-saytov" },
  { source: "/ru/uslugi/veb-dizajn-halle", destination: "/ru/uslugi/webdesign-halle" },
  {
    source: "/ru/uslugi/modernizaciya-wordpress-sajta",
    destination: "/ru/uslugi/modernizaciya-wordpress-sayta",
  },
  { source: "/ru/uslugi/podderzhka-sajta", destination: "/ru/uslugi/podderzhka-saytov" },

  // Service consolidation, 2026-10-09. Mirrors
  // src/widgets/seo-landing/serviceMerges.ts. The CMS-backed Performance page
  // duplicates the richer performance-optimization landing page.
  { source: "/leistungen/performance", destination: "/leistungen/performance-optimierung" },
  { source: "/en/services/performance", destination: "/en/services/performance-optimization" },
  {
    source: "/ru/uslugi/proizvoditelnost",
    destination: "/ru/uslugi/optimizaciya-proizvoditelnosti",
  },
  {
    source: "/leistungen/modernizaciya-wordpress-sajta",
    destination: "/leistungen/wordpress-website-modernisieren",
  },
  {
    source: "/en/services/modernizaciya-wordpress-sajta",
    destination: "/en/services/wordpress-website-modernization",
  },
  { source: "/leistungen/podderzhka-sajta", destination: "/leistungen/website-wartung" },
  {
    source: "/en/services/podderzhka-sajta",
    destination: "/en/services/website-maintenance",
  },
  { source: "/ru/blog/sichtbarkeit-in-ki-suche", destination: "/ru/blog/vidimost-v-ai-poiske" },
  { source: "/ru/uslugi/ai-optimization", destination: "/ru/uslugi/optimizaciya-pod-ii" },
  { source: "/leistungen/ai-optimization", destination: "/leistungen/ki-optimierung" },

  // Search Console 404 cleanup, 2026-07-28: cross-locale industry slugs.
  {
    source: "/ru/otrasli/bau",
    destination: "/ru/otrasli/sayt-dlya-stroitelnoy-kompanii",
  },
  { source: "/ru/otrasli/arztpraxen", destination: "/ru/otrasli/medcentry" },
  { source: "/ru/otrasli/dienstleister-website", destination: "/ru/otrasli/sayt-dlya-sfery-uslug" },
  { source: "/en/industries/arztpraxen", destination: "/en/industries/medical-practices" },
  { source: "/ru/otrasli/handwerker-website", destination: "/ru/otrasli/sayt-dlya-masterov" },
  { source: "/branchen/nedvizhimost", destination: "/branchen/immobilien" },
  {
    source: "/en/industries/bauunternehmen-website",
    destination: "/en/industries/construction-company-website",
  },
  { source: "/branchen/glazier-website", destination: "/branchen/glaserei-website" },
  {
    source: "/ru/otrasli/glaserei-website",
    destination: "/ru/otrasli/sayt-dlya-stekolnoy-masterskoy",
  },
  { source: "/ru/otrasli/kanzleien", destination: "/ru/otrasli/yuristy" },
  { source: "/en/industries/medcentry", destination: "/en/industries/medical-practices" },
  { source: "/en/industries/kanzleien", destination: "/en/industries/law-firms" },
  { source: "/branchen/medcentry", destination: "/branchen/arztpraxen" },
  { source: "/branchen/sayt-dlya-otelya", destination: "/branchen/hotel-website" },

  // Search Console 404 cleanup, 2026-07-28: cross-locale service slugs.
  { source: "/ru/uslugi/api-integrationen", destination: "/ru/uslugi/api-integracii" },
  { source: "/en/services/api-integrationen", destination: "/en/services/api-integrations" },
  { source: "/leistungen/ai-assistent", destination: "/leistungen/ki-assistent" },
  {
    source: "/ru/uslugi/online-shop-development",
    destination: "/ru/uslugi/sozdanie-internet-magazina",
  },
  { source: "/en/services/webdesign-delitzsch", destination: "/en/services/web-design-delitzsch" },
  { source: "/ru/uslugi/website-erstellen-lassen", destination: "/ru/uslugi/razrabotka-saytov" },
  {
    source: "/en/services/webdesign-schkeuditz",
    destination: "/en/services/web-design-schkeuditz",
  },
  { source: "/en/services/website-erstellen-lassen", destination: "/en/services/website-development" },
  { source: "/leistungen/lokalnoe-seo", destination: "/leistungen/local-seo" },
  { source: "/leistungen/podderzhka", destination: "/leistungen/wartung" },
  { source: "/en/services/online-shop-erstellen", destination: "/en/services/online-shop-development" },
  { source: "/leistungen/website-security", destination: "/leistungen/website-sicherheit" },
  { source: "/en/services/buchungssysteme", destination: "/en/services/booking-systems" },
  { source: "/ru/uslugi/web-design-merseburg", destination: "/ru/uslugi/webdesign-merseburg" },
  { source: "/en/services/shop-produktimport", destination: "/en/services/shop-product-import" },
  { source: "/en/services/automatisierung", destination: "/en/services/automation" },
  { source: "/ru/uslugi/web-design-leipzig", destination: "/ru/uslugi/webdesign-leipzig" },
  { source: "/leistungen/relonch-sajta", destination: "/leistungen/website-relaunch" },
  {
    source: "/leistungen/shop-produktimport-Shop-Produktimport",
    destination: "/leistungen/shop-produktimport",
  },
  { source: "/leistungen/web-design-halle", destination: "/leistungen/webdesign-halle" },

  // Search Console 404 cleanup, 2026-07-28: cross-locale project slugs.
  {
    source: "/en/projects/direktbuchungen-ohne-portale",
    destination: "/en/projects/direct-bookings-without-portals",
  },
  {
    source: "/en/projects/onlajn-zapisi-vyrosli-vtroe",
    destination: "/en/projects/online-bookings-tripled",
  },
  {
    source: "/projekte/direct-bookings-without-portals",
    destination: "/projekte/direktbuchungen-ohne-portale",
  },
  {
    source: "/ru/proekty/qualifizierte-bauanfragen",
    destination: "/ru/proekty/kvalificirovannye-zayavki",
  },

  // Search Console 404 cleanup, 2026-07-28: cross-locale blog and category slugs.
  { source: "/en/blog/category/praxis", destination: "/en/blog/category/business-growth" },
  { source: "/ru/blog/website-relaunch-checklist", destination: "/ru/blog/relonch-sajta-checklist" },
  { source: "/ru/blog/kategoriya/business-growth", destination: "/ru/blog/kategoriya/rost-biznesa" },
  { source: "/en/blog/lokalnoe-seo-halle", destination: "/en/blog/local-seo-halle" },
  { source: "/en/blog/category/webdesign", destination: "/en/blog/category/web-design" },
  {
    source: "/en/blog/google-unternehmensprofil-optimieren",
    destination: "/en/blog/optimize-google-business-profile",
  },
  {
    source: "/en/blog/website-relaunch-checkliste",
    destination: "/en/blog/website-relaunch-checklist",
  },
  {
    source: "/ru/blog/restaurant-website-mehr-reservierungen",
    destination: "/ru/blog/sajt-restorana-bolshe-bronirovanij",
  },
  { source: "/blog/skolko-stoit-sajt-v-halle", destination: "/blog/was-kostet-eine-website-in-halle" },
  {
    source: "/ru/blog/google-unternehmensprofil-optimieren",
    destination: "/ru/blog/optimizaciya-google-biznes-profilya",
  },

  // Search Console 404 cleanup, 2026-07-28: malformed historical URLs.
  { source: "/projekte-Projekte", destination: "/projekte" },
  { source: "/en/locations/merseburg-Merseburg", destination: "/en/locations/merseburg" },
  { source: "/en/locations/saalekreis-Saalekreis", destination: "/en/locations/saalekreis" },
  {
    source: "/ru/kontakt-%D0%9A%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82",
    destination: "/ru/kontakt",
  },

  // Industry consolidation, 2026-08-13. The legacy CMS industry pages competed
  // with the premium templates for the same queries and both stalled around
  // position 60+. Mirrors src/widgets/seo-landing/industryMerges.ts, which
  // stays the source of truth for application code; this file cannot import
  // TypeScript, so the pairs are repeated here. Keep the two in sync.
  { source: "/branchen/hotels", destination: "/branchen/hotel-website" },
  { source: "/branchen/restaurants", destination: "/branchen/restaurant-website" },
  { source: "/branchen/beauty-salons", destination: "/branchen/beauty-studio-website" },
  { source: "/branchen/bau", destination: "/branchen/bauunternehmen-website" },
  { source: "/branchen/handwerk", destination: "/branchen/handwerker-website" },
  { source: "/en/industries/hotels", destination: "/en/industries/hotel-website" },
  { source: "/en/industries/restaurants", destination: "/en/industries/restaurant-website" },
  {
    source: "/en/industries/beauty-salons",
    destination: "/en/industries/beauty-studio-website",
  },
  {
    source: "/en/industries/construction",
    destination: "/en/industries/construction-company-website",
  },
  { source: "/en/industries/craftsmen", destination: "/en/industries/craftsmen-website" },
  { source: "/ru/otrasli/oteli", destination: "/ru/otrasli/sayt-dlya-otelya" },
  { source: "/ru/otrasli/restorany", destination: "/ru/otrasli/sayt-dlya-restorana" },
  {
    source: "/ru/otrasli/beauty-salony",
    destination: "/ru/otrasli/sayt-dlya-salona-krasoty",
  },
  {
    source: "/ru/otrasli/stroitelstvo",
    destination: "/ru/otrasli/sayt-dlya-stroitelnoy-kompanii",
  },
  { source: "/ru/otrasli/remeslenniki", destination: "/ru/otrasli/sayt-dlya-masterov" },
];

const localizedRouteBases = /** @type {const} */ ({
  service: {
    de: "/leistungen",
    en: "/en/services",
    ru: "/ru/uslugi",
  },
  industry: {
    de: "/branchen",
    en: "/en/industries",
    ru: "/ru/otrasli",
  },
  project: {
    de: "/projekte",
    en: "/en/projects",
    ru: "/ru/proekty",
  },
  blog: {
    de: "/blog",
    en: "/en/blog",
    ru: "/ru/blog",
  },
  category: {
    de: "/blog/kategorie",
    en: "/en/blog/category",
    ru: "/ru/blog/kategoriya",
  },
});

/**
 * Historical cross-locale URLs emitted by next-intl's HTTP Link header before
 * the middleware suppressed translated dynamic slugs. Keep these groups as a
 * finite compatibility layer so Google reaches the matching canonical page.
 *
 * @type {Record<keyof typeof localizedRouteBases, Array<Record<"de" | "en" | "ru", string>>>}
 */
const historicalLocalizedSlugGroups = {
  service: [
    // CMS-backed service details. Keep in sync with scripts/sync-homepage-content.ts.
    { de: "website-entwicklung", en: "web-development", ru: "razrabotka-sajtov" },
    { de: "seo-optimierung", en: "seo-optimization", ru: "seo-optimizaciya" },
    { de: "local-seo", en: "local-seo", ru: "lokalnoe-seo" },
    { de: "ki-integration", en: "ai-integration", ru: "integraciya-ii" },
    { de: "website-relaunch", en: "website-relaunch", ru: "relonch-sajta" },
    { de: "performance", en: "performance", ru: "proizvoditelnost" },
    { de: "wartung", en: "maintenance", ru: "podderzhka" },
    { de: "digitalberatung", en: "digital-consulting", ru: "cifrovoj-konsalting" },

    // Code-backed service landings. Keep in sync with SERVICE_SLUGS in phase4Content.ts.
    { de: "website-erstellen-lassen", en: "website-development", ru: "razrabotka-saytov" },
    { de: "webdesign-halle", en: "web-design-halle", ru: "webdesign-halle" },
    {
      de: "wordpress-agentur-halle",
      en: "wordpress-agency-halle",
      ru: "wordpress-agentstvo-halle",
    },
    { de: "webdesign-leipzig", en: "web-design-leipzig", ru: "webdesign-leipzig" },
    { de: "webdesign-merseburg", en: "web-design-merseburg", ru: "webdesign-merseburg" },
    { de: "webdesign-schkeuditz", en: "web-design-schkeuditz", ru: "webdesign-schkeuditz" },
    { de: "webdesign-delitzsch", en: "web-design-delitzsch", ru: "webdesign-delitzsch" },
    { de: "webdesign-saalekreis", en: "web-design-saalekreis", ru: "webdesign-saalekreis" },
    { de: "ki-optimierung", en: "ai-optimization", ru: "optimizaciya-pod-ii" },
    {
      de: "wordpress-website-modernisieren",
      en: "wordpress-website-modernization",
      ru: "modernizaciya-wordpress-sayta",
    },
    {
      de: "performance-optimierung",
      en: "performance-optimization",
      ru: "optimizaciya-proizvoditelnosti",
    },
    { de: "website-wartung", en: "website-maintenance", ru: "podderzhka-saytov" },
    { de: "buchungssysteme", en: "booking-systems", ru: "sistemy-bronirovaniya" },
    {
      de: "online-shop-erstellen",
      en: "online-shop-development",
      ru: "sozdanie-internet-magazina",
    },
    { de: "ki-assistent", en: "ai-assistant", ru: "ai-assistent" },
    { de: "automatisierung", en: "automation", ru: "avtomatizaciya" },
    { de: "api-integrationen", en: "api-integrations", ru: "api-integracii" },
    { de: "website-sicherheit", en: "website-security", ru: "bezopasnost-sayta" },
    { de: "datenanalyse", en: "data-analytics", ru: "analitika-dannyh" },
    { de: "shop-produktimport", en: "shop-product-import", ru: "import-tovarov" },
  ],
  industry: [
    { de: "restaurant-website", en: "restaurant-website", ru: "sayt-dlya-restorana" },
    { de: "hotel-website", en: "hotel-website", ru: "sayt-dlya-otelya" },
    { de: "beauty-studio-website", en: "beauty-studio-website", ru: "sayt-dlya-salona-krasoty" },
    {
      de: "bauunternehmen-website",
      en: "construction-company-website",
      ru: "sayt-dlya-stroitelnoy-kompanii",
    },
    { de: "handwerker-website", en: "craftsmen-website", ru: "sayt-dlya-masterov" },
    {
      de: "glaserei-website",
      en: "glazier-website",
      ru: "sayt-dlya-stekolnoy-masterskoy",
    },
    {
      de: "dienstleister-website",
      en: "service-provider-website",
      ru: "sayt-dlya-sfery-uslug",
    },
    { de: "arztpraxen", en: "medical-practices", ru: "medcentry" },
    { de: "immobilien", en: "real-estate", ru: "nedvizhimost" },
    { de: "kanzleien", en: "law-firms", ru: "yuristy" },
  ],
  project: [
    {
      de: "online-buchungen-verdreifacht",
      en: "online-bookings-tripled",
      ru: "onlajn-zapisi-vyrosli-vtroe",
    },
    {
      de: "direktbuchungen-ohne-portale",
      en: "direct-bookings-without-portals",
      ru: "pryamye-broni-bez-agregatorov",
    },
    {
      de: "qualifizierte-bauanfragen",
      en: "qualified-construction-leads",
      ru: "kvalificirovannye-zayavki",
    },
  ],
  blog: [
    { de: "lokales-seo-halle", en: "local-seo-halle", ru: "lokalnoe-seo-halle" },
    { de: "sichtbarkeit-in-ki-suche", en: "ai-search-visibility", ru: "vidimost-v-ai-poiske" },
    {
      de: "was-kostet-eine-website-in-halle",
      en: "website-cost-in-halle",
      ru: "skolko-stoit-sajt-v-halle",
    },
    {
      de: "restaurant-website-mehr-reservierungen",
      en: "restaurant-website-more-reservations",
      ru: "sajt-restorana-bolshe-bronirovanij",
    },
    {
      de: "website-relaunch-checkliste",
      en: "website-relaunch-checklist",
      ru: "relonch-sajta-checklist",
    },
    {
      de: "google-unternehmensprofil-optimieren",
      en: "optimize-google-business-profile",
      ru: "optimizaciya-google-biznes-profilya",
    },
    { de: "nextjs-vs-wordpress", en: "nextjs-vs-wordpress", ru: "nextjs-vs-wordpress" },
  ],
  category: [
    { de: "seo", en: "seo", ru: "seo" },
    { de: "webdesign", en: "web-design", ru: "veb-dizajn" },
    { de: "ki-suche", en: "ai-search", ru: "ii-i-poisk" },
    { de: "praxis", en: "business-growth", ru: "rost-biznesa" },
  ],
};

/**
 * Original CMS industry slugs were also emitted under the wrong locale before
 * they were consolidated into premium pages. Redirect every historical locale
 * combination directly to the surviving page to avoid a second redirect hop.
 */
const historicalMergedIndustrySlugGroups = [
  {
    slugs: { de: "hotels", en: "hotels", ru: "oteli" },
    destinations: { de: "hotel-website", en: "hotel-website", ru: "sayt-dlya-otelya" },
  },
  {
    slugs: { de: "restaurants", en: "restaurants", ru: "restorany" },
    destinations: {
      de: "restaurant-website",
      en: "restaurant-website",
      ru: "sayt-dlya-restorana",
    },
  },
  {
    slugs: { de: "beauty-salons", en: "beauty-salons", ru: "beauty-salony" },
    destinations: {
      de: "beauty-studio-website",
      en: "beauty-studio-website",
      ru: "sayt-dlya-salona-krasoty",
    },
  },
  {
    slugs: { de: "bau", en: "construction", ru: "stroitelstvo" },
    destinations: {
      de: "bauunternehmen-website",
      en: "construction-company-website",
      ru: "sayt-dlya-stroitelnoy-kompanii",
    },
  },
  {
    slugs: { de: "handwerk", en: "craftsmen", ru: "remeslenniki" },
    destinations: {
      de: "handwerker-website",
      en: "craftsmen-website",
      ru: "sayt-dlya-masterov",
    },
  },
];

const appLocales = /** @type {const} */ (["de", "en", "ru"]);

/** @returns {Array<{ source: string; destination: string }>} */
function buildHistoricalCrossLocaleRedirects() {
  /** @type {Array<{ source: string; destination: string }>} */
  const redirects = [];

  for (const routeKind of /** @type {(keyof typeof localizedRouteBases)[]} */ (
    Object.keys(localizedRouteBases)
  )) {
    const bases = localizedRouteBases[routeKind];
    for (const slugs of historicalLocalizedSlugGroups[routeKind]) {
      const discoveredSlugs = [...new Set(Object.values(slugs))];
      for (const locale of appLocales) {
        for (const discoveredSlug of discoveredSlugs) {
          if (discoveredSlug === slugs[locale]) continue;
          redirects.push({
            source: `${bases[locale]}/${discoveredSlug}`,
            destination: `${bases[locale]}/${slugs[locale]}`,
          });
        }
      }
    }
  }

  return redirects;
}

/** @returns {Array<{ source: string; destination: string }>} */
function buildHistoricalMergedIndustryRedirects() {
  /** @type {Array<{ source: string; destination: string }>} */
  const redirects = [];
  const bases = localizedRouteBases.industry;

  for (const group of historicalMergedIndustrySlugGroups) {
    const discoveredSlugs = [...new Set(Object.values(group.slugs))];
    for (const locale of appLocales) {
      for (const discoveredSlug of discoveredSlugs) {
        redirects.push({
          source: `${bases[locale]}/${discoveredSlug}`,
          destination: `${bases[locale]}/${group.destinations[locale]}`,
        });
      }
    }
  }

  return redirects;
}

/**
 * @param {Array<{ source: string; destination: string }>} redirects
 * @returns {Array<{ source: string; destination: string }>}
 */
function dedupeRedirects(redirects) {
  /** @type {Map<string, { source: string; destination: string }>} */
  const bySource = new Map();
  for (const redirect of redirects) {
    const existing = bySource.get(redirect.source);
    if (existing && existing.destination !== redirect.destination) {
      throw new Error(
        `Conflicting permanent redirects for ${redirect.source}: ${existing.destination} vs ${redirect.destination}`,
      );
    }
    if (!existing) bySource.set(redirect.source, redirect);
  }
  return [...bySource.values()];
}

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // Keep duplicate legacy URLs out of the index while transferring their
    // signals to exactly one localized canonical page.
    return [
      // Both hosts have a valid certificate, but www currently serves a 200
      // copy of each page. Preserve the complete path and original query.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.saaleweb.de" }],
        destination: "https://saaleweb.de/:path*",
        permanent: true,
      },
      ...dedupeRedirects([
        ...permanentCompatibilityRedirects,
        ...buildHistoricalCrossLocaleRedirects(),
        ...buildHistoricalMergedIndustryRedirects(),
      ]).map((redirect) => ({
        ...redirect,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/llms.txt",
        headers: [{ key: "Content-Type", value: "text/markdown; charset=utf-8" }],
      },
      {
        source: "/llms-full.txt",
        headers: [{ key: "Content-Type", value: "text/markdown; charset=utf-8" }],
      },
    ];
  },
  // sharp must stay external (native binaries) for the image-upload route.
  serverExternalPackages: ["sharp"],
  experimental: {
    // This Tailwind marketing site is dominated by first-time mobile visits.
    // Inline critical CSS removes two render-blocking stylesheet round trips.
    inlineCss: true,
    optimizePackageImports: ["lucide-react"],
    // DB-backed static pages do not benefit from aggressive build concurrency.
    // Two workers with one page each keep deploy-time PostgreSQL usage bounded.
    cpus: 2,
    staticGenerationMaxConcurrency: 1,
  },
};

export default withNextIntl(nextConfig);
