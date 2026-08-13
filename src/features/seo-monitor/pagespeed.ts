import "server-only";

/**
 * PageSpeed Insights API client.
 * The daily report uses one mobile request for Performance/CrUX and one
 * desktop request for Performance/SEO/Accessibility/Best Practices. Public
 * rendering never calls this API.
 */

export type CwvMetric = {
  label: "LCP" | "INP" | "CLS";
  value: string;
  category: "FAST" | "AVERAGE" | "SLOW" | "NONE";
};

export type PageSpeedResult = {
  available: boolean;
  performanceScore: number | null;
  seoScore: number | null;
  accessibilityScore: number | null;
  bestPracticesScore: number | null;
  fieldMetrics: CwvMetric[];
  overallCategory: string | null;
  measuredAt: string | null;
  error?: string;
};

export type PageSpeedOptions = {
  strategy?: "mobile" | "desktop";
  categories?: Array<"performance" | "seo" | "accessibility" | "best-practices">;
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

export async function fetchPageSpeed(
  url: string,
  options: PageSpeedOptions = {},
): Promise<PageSpeedResult> {
  const key = process.env.PAGESPEED_API_KEY?.trim();
  if (!key) {
    return {
      available: false,
      performanceScore: null,
      seoScore: null,
      accessibilityScore: null,
      bestPracticesScore: null,
      fieldMetrics: [],
      overallCategory: null,
      measuredAt: null,
      error: "PAGESPEED_API_KEY не задан",
    };
  }

  try {
    const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    endpoint.searchParams.set("url", url);
    endpoint.searchParams.set("strategy", options.strategy ?? "mobile");
    for (const category of options.categories ?? ["performance"]) {
      endpoint.searchParams.append("category", category);
    }
    endpoint.searchParams.set("key", key);

    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(60_000),
      cache: "no-store",
    });
    if (!response.ok) {
      return {
        available: false,
        performanceScore: null,
        seoScore: null,
        accessibilityScore: null,
        bestPracticesScore: null,
        fieldMetrics: [],
        overallCategory: null,
        measuredAt: null,
        error: `PSI HTTP ${response.status}`,
      };
    }

    const data = (await response.json()) as {
      lighthouseResult?: {
        fetchTime?: string;
        runtimeError?: { code?: string; message?: string };
        categories?: {
          performance?: { score?: number };
          seo?: { score?: number };
          accessibility?: { score?: number };
          "best-practices"?: { score?: number };
        };
      };
      loadingExperience?: {
        overall_category?: string;
        metrics?: Record<string, PsiMetric>;
      };
    };

    if (data.lighthouseResult?.runtimeError?.code) {
      return {
        available: false,
        performanceScore: null,
        seoScore: null,
        accessibilityScore: null,
        bestPracticesScore: null,
        fieldMetrics: [],
        overallCategory: null,
        measuredAt: null,
        error: `PSI ${data.lighthouseResult.runtimeError.code}`,
      };
    }

    const performance = data.lighthouseResult?.categories?.performance?.score;
    const seo = data.lighthouseResult?.categories?.seo?.score;
    const accessibility = data.lighthouseResult?.categories?.accessibility?.score;
    const bestPractices = data.lighthouseResult?.categories?.["best-practices"]?.score;
    const metrics = data.loadingExperience?.metrics ?? {};
    const fieldMetrics = [
      metric("LCP", metrics.LARGEST_CONTENTFUL_PAINT_MS, (value) => `${(value / 1000).toFixed(1)}s`),
      metric("INP", metrics.INTERACTION_TO_NEXT_PAINT, (value) => `${Math.round(value)}ms`),
      metric("CLS", metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE, (value) => (value / 100).toFixed(2)),
    ].filter((item): item is CwvMetric => item !== null);

    return {
      available: true,
      performanceScore: typeof performance === "number" ? Math.round(performance * 100) : null,
      seoScore: typeof seo === "number" ? Math.round(seo * 100) : null,
      accessibilityScore:
        typeof accessibility === "number" ? Math.round(accessibility * 100) : null,
      bestPracticesScore:
        typeof bestPractices === "number" ? Math.round(bestPractices * 100) : null,
      fieldMetrics,
      overallCategory: data.loadingExperience?.overall_category ?? null,
      measuredAt: data.lighthouseResult?.fetchTime ?? null,
    };
  } catch (error) {
    return {
      available: false,
      performanceScore: null,
      seoScore: null,
      accessibilityScore: null,
      bestPracticesScore: null,
      fieldMetrics: [],
      overallCategory: null,
      measuredAt: null,
      error: error instanceof Error ? error.message : "PSI request failed",
    };
  }
}
