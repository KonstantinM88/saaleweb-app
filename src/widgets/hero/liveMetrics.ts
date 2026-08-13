import "server-only";

import { getPublicLighthouseMetrics } from "@/features/seo-monitor/lighthouseSnapshot";

/**
 * Public proof metrics for saaleweb.de itself.
 *
 * Every value is server-rendered and therefore visible to people, search
 * engines and AI crawlers. The daily SEO job supplies the measurements; this
 * read path never calls Google and never exposes internal crawler analytics.
 */
export type HeroMetrics = {
  seoScore: number;
  pageSpeed: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  measuredAt: string;
};

export function getHeroMetrics(): Promise<HeroMetrics> {
  return getPublicLighthouseMetrics();
}
