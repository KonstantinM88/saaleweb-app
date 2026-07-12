import "server-only";

/**
 * PageSpeed Insights API client.
 * One mobile request for the homepage returns Lighthouse lab performance
 * and Core Web Vitals field data (CrUX) when Google has enough real traffic.
 */

export type CwvMetric = {
  label: "LCP" | "INP" | "CLS";
  value: string;
  category: "FAST" | "AVERAGE" | "SLOW" | "NONE";
};

export type PageSpeedResult = {
  available: boolean;
  performanceScore: number | null;
  fieldMetrics: CwvMetric[];
  overallCategory: string | null;
  error?: string;
};

type PsiMetric = { percentile?: number; category?: string };

function metric(
  label: CwvMetric["label"],
  raw: PsiMetric | undefined,
  format: (percentile: number) => string,
): CwvMetric | null {
  if (!raw || typeof raw.percentile !== "number") return null;
  const category = (raw.category as CwvMetric["category"]) || "NONE";
  return { label, value: format(raw.percentile), category };
}

export async function fetchPageSpeed(url: string): Promise<PageSpeedResult> {
  const key = process.env.PAGESPEED_API_KEY?.trim();
  if (!key) {
    return {
      available: false,
      performanceScore: null,
      fieldMetrics: [],
      overallCategory: null,
      error: "PAGESPEED_API_KEY не задан",
    };
  }

  try {
    const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    endpoint.searchParams.set("url", url);
    endpoint.searchParams.set("strategy", "mobile");
    endpoint.searchParams.set("category", "performance");
    endpoint.searchParams.set("key", key);

    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(60_000),
      cache: "no-store",
    });
    if (!response.ok) {
      return {
        available: false,
        performanceScore: null,
        fieldMetrics: [],
        overallCategory: null,
        error: `PSI HTTP ${response.status}`,
      };
    }

    const data = (await response.json()) as {
      lighthouseResult?: { categories?: { performance?: { score?: number } } };
      loadingExperience?: {
        overall_category?: string;
        metrics?: Record<string, PsiMetric>;
      };
    };

    const score = data.lighthouseResult?.categories?.performance?.score;
    const metrics = data.loadingExperience?.metrics ?? {};
    const fieldMetrics = [
      metric("LCP", metrics.LARGEST_CONTENTFUL_PAINT_MS, (value) => `${(value / 1000).toFixed(1)}s`),
      metric("INP", metrics.INTERACTION_TO_NEXT_PAINT, (value) => `${Math.round(value)}ms`),
      metric("CLS", metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE, (value) => (value / 100).toFixed(2)),
    ].filter((item): item is CwvMetric => item !== null);

    return {
      available: true,
      performanceScore: typeof score === "number" ? Math.round(score * 100) : null,
      fieldMetrics,
      overallCategory: data.loadingExperience?.overall_category ?? null,
    };
  } catch (error) {
    return {
      available: false,
      performanceScore: null,
      fieldMetrics: [],
      overallCategory: null,
      error: error instanceof Error ? error.message : "PSI request failed",
    };
  }
}
