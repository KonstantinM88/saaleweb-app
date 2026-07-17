import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config/site";
import { robotsDisallow } from "@/shared/seo/crawl";

// Search, user-requested retrieval and model-development tokens published by
// the respective AI providers. Explicit rules make the public-site policy
// unambiguous while keeping private application surfaces excluded.
const aiUserAgents = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bytespider",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [...aiUserAgents],
        allow: "/",
        disallow: [...robotsDisallow],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: [...robotsDisallow],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
