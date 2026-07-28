import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const permanentCompatibilityRedirects = [
  // Earlier compatibility aliases that may still exist in external indexes.
  { source: "/en/services/webdesign-halle", destination: "/en/services/web-design-halle" },
  { source: "/ru/blog/sichtbarkeit-in-ki-suche", destination: "/ru/blog/vidimost-v-ai-poiske" },
  { source: "/ru/uslugi/ai-optimization", destination: "/ru/uslugi/optimizaciya-pod-ii" },
  { source: "/leistungen/ai-optimization", destination: "/leistungen/ki-optimierung" },

  // Search Console 404 cleanup, 2026-07-28: cross-locale industry slugs.
  { source: "/ru/otrasli/bau", destination: "/ru/otrasli/stroitelstvo" },
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
] satisfies Array<{ source: string; destination: string }>;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // Keep duplicate legacy URLs out of the index while transferring their
    // signals to exactly one localized canonical page.
    return permanentCompatibilityRedirects.map((redirect) => ({
      ...redirect,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/llms.txt",
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
  },
};

export default withNextIntl(nextConfig);
