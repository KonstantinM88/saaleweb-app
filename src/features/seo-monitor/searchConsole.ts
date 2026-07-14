import "server-only";

import {
  getGoogleServiceAccountAccessToken,
  hasGoogleServiceAccountCredentials,
} from "@/features/google/serviceAccount";

/**
 * Google Search Console API client using a service-account JWT and the
 * already-installed jose dependency.
 */

const SCOPE = "https://www.googleapis.com/auth/webmasters";

export type SearchAnalyticsTotals = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  startDate: string;
  endDate: string;
  topQueries: { query: string; clicks: number; position: number }[];
};

export type IndexationResult = {
  inspected: number;
  indexed: number;
  problems: { url: string; verdict: string }[];
};

export type GscSnapshot = {
  configured: boolean;
  analytics: SearchAnalyticsTotals | null;
  indexation: IndexationResult | null;
  error?: string;
};

function gscSiteUrl(): string {
  const configured = process.env.GSC_SITE_URL?.trim();
  if (configured) return configured;
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://saaleweb.de").replace(/\/+$/, "");
  return `${base}/`;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

async function querySearchAnalytics(token: string): Promise<SearchAnalyticsTotals> {
  const end = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const start = new Date(end.getTime() - 6 * 24 * 60 * 60 * 1000);
  const site = encodeURIComponent(gscSiteUrl());
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`;

  const run = async (body: Record<string, unknown>) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error(`GSC analytics HTTP ${response.status}`);
    return (await response.json()) as {
      rows?: {
        keys?: string[];
        clicks?: number;
        impressions?: number;
        ctr?: number;
        position?: number;
      }[];
    };
  };

  const [totals, byQuery] = await Promise.all([
    run({ startDate: isoDate(start), endDate: isoDate(end) }),
    run({ startDate: isoDate(start), endDate: isoDate(end), dimensions: ["query"], rowLimit: 5 }),
  ]);

  const total = totals.rows?.[0];
  return {
    clicks: Math.round(total?.clicks ?? 0),
    impressions: Math.round(total?.impressions ?? 0),
    ctr: total?.ctr ?? 0,
    position: total?.position ?? 0,
    startDate: isoDate(start),
    endDate: isoDate(end),
    topQueries: (byQuery.rows ?? []).map((row) => ({
      query: row.keys?.[0] ?? "-",
      clicks: Math.round(row.clicks ?? 0),
      position: Math.round((row.position ?? 0) * 10) / 10,
    })),
  };
}

async function inspectUrl(token: string, url: string, site: string) {
  const response = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: site }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) return { url, indexed: false, verdict: `HTTP ${response.status}` };

  const data = (await response.json()) as {
    inspectionResult?: { indexStatusResult?: { verdict?: string; coverageState?: string } };
  };
  const status = data.inspectionResult?.indexStatusResult;
  return {
    url,
    indexed: status?.verdict === "PASS",
    verdict: status?.coverageState || status?.verdict || "UNKNOWN",
  };
}

async function inspectUrls(token: string, urls: string[]): Promise<IndexationResult> {
  const results = await Promise.all(urls.map((url) => inspectUrl(token, url, gscSiteUrl())));
  return {
    inspected: urls.length,
    indexed: results.filter((result) => result.indexed).length,
    problems: results
      .filter((result) => !result.indexed)
      .map((result) => ({ url: result.url, verdict: result.verdict }))
      .slice(0, 5),
  };
}

export async function fetchGscSnapshot(keyUrls: string[]): Promise<GscSnapshot> {
  if (!hasGoogleServiceAccountCredentials()) {
    return { configured: false, analytics: null, indexation: null };
  }

  try {
    const token = await getGoogleServiceAccountAccessToken(SCOPE);
    const [analytics, indexation] = await Promise.all([
      querySearchAnalytics(token),
      inspectUrls(token, keyUrls),
    ]);
    return { configured: true, analytics, indexation };
  } catch (error) {
    return {
      configured: true,
      analytics: null,
      indexation: null,
      error: error instanceof Error ? error.message : "GSC request failed",
    };
  }
}
