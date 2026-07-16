import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Permanent compatibility redirects keep old or cross-locale slugs out
      // of the index while transferring their signals to one canonical URL.
      {
        source: "/en/services/webdesign-halle",
        destination: "/en/services/web-design-halle",
        permanent: true,
      },
      {
        source: "/ru/blog/sichtbarkeit-in-ki-suche",
        destination: "/ru/blog/vidimost-v-ai-poiske",
        permanent: true,
      },
      {
        source: "/ru/uslugi/ai-optimization",
        destination: "/ru/uslugi/optimizaciya-pod-ii",
        permanent: true,
      },
      {
        source: "/leistungen/ai-optimization",
        destination: "/leistungen/ki-optimierung",
        permanent: true,
      },
    ];
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
