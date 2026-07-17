import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config/site";
import { robotsDisallow } from "@/shared/seo/crawl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...robotsDisallow],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: [...robotsDisallow],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
