import "server-only";

export type UrlCheck = { url: string; ok: boolean; status: number; ms: number };

export type SelfCheckResult = {
  checks: UrlCheck[];
  okCount: number;
  averageMs: number;
  sitemapOk: boolean;
  sitemapUrls: number;
};

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://saaleweb.de").replace(/\/+$/, "");
}

export const KEY_PATHS = [
  "/",
  "/en",
  "/ru",
  "/leistungen",
  "/preise",
  "/kontakt",
  "/kostenlose-website-analyse",
] as const;

export function keyUrls(): string[] {
  const base = baseUrl();
  return KEY_PATHS.map((path) => (path === "/" ? `${base}/` : `${base}${path}`));
}

async function checkUrl(url: string): Promise<UrlCheck> {
  const startedAt = Date.now();
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
      headers: { "User-Agent": "SaaleWeb-SEO-Monitor/1.0" },
    });
    return { url, ok: response.ok, status: response.status, ms: Date.now() - startedAt };
  } catch {
    return { url, ok: false, status: 0, ms: Date.now() - startedAt };
  }
}

export async function runSelfCheck(): Promise<SelfCheckResult> {
  const checks = await Promise.all(keyUrls().map((url) => checkUrl(url)));

  let sitemapOk = false;
  let sitemapUrls = 0;
  try {
    const response = await fetch(`${baseUrl()}/sitemap.xml`, {
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
      headers: { "User-Agent": "SaaleWeb-SEO-Monitor/1.0" },
    });
    if (response.ok) {
      const xml = await response.text();
      sitemapUrls = (xml.match(/<loc>/g) ?? []).length;
      sitemapOk = sitemapUrls > 0;
    }
  } catch {
    sitemapOk = false;
  }

  const okCount = checks.filter((check) => check.ok).length;
  const averageMs = checks.length
    ? Math.round(checks.reduce((sum, check) => sum + check.ms, 0) / checks.length)
    : 0;

  return { checks, okCount, averageMs, sitemapOk, sitemapUrls };
}
