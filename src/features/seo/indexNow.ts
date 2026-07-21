import { siteConfig } from "@/shared/config/site";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/;

export type IndexNowSubmissionResult = {
  ok: boolean;
  configured: boolean;
  submitted: number;
  status?: number;
  reason?: "not_configured" | "no_valid_urls" | "request_failed" | "rejected";
};

export function getIndexNowKey(): string | null {
  const key = process.env.INDEXNOW_KEY?.trim() ?? "";
  return INDEXNOW_KEY_PATTERN.test(key) ? key : null;
}

export function isIndexNowConfigured(): boolean {
  return getIndexNowKey() !== null;
}

export function getIndexNowKeyLocation(): string {
  return `${siteConfig.url}/indexnow-key.txt`;
}

function normalizeIndexNowUrl(value: string): string | null {
  try {
    const site = new URL(siteConfig.url);
    const url = new URL(value, site);
    if (url.protocol !== "https:" || url.hostname !== site.hostname) return null;
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

export async function submitIndexNowUrls(values: string[]): Promise<IndexNowSubmissionResult> {
  const key = getIndexNowKey();
  if (!key) {
    return { ok: false, configured: false, submitted: 0, reason: "not_configured" };
  }

  const urls = [...new Set(values.map(normalizeIndexNowUrl).filter((value): value is string => Boolean(value)))].slice(0, 10_000);
  if (urls.length === 0) {
    return { ok: false, configured: true, submitted: 0, reason: "no_valid_urls" };
  }

  const host = new URL(siteConfig.url).hostname;

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key,
        keyLocation: getIndexNowKeyLocation(),
        urlList: urls,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });

    const accepted = response.status === 200 || response.status === 202;
    if (!accepted) {
      console.warn("[indexnow] URL submission rejected.", {
        status: response.status,
        urlCount: urls.length,
      });
    }

    return {
      ok: accepted,
      configured: true,
      submitted: accepted ? urls.length : 0,
      status: response.status,
      reason: accepted ? undefined : "rejected",
    };
  } catch (error) {
    console.warn("[indexnow] URL submission failed.", {
      urlCount: urls.length,
      error: error instanceof Error ? error.name : "unknown_error",
    });
    return { ok: false, configured: true, submitted: 0, reason: "request_failed" };
  }
}

export function submitIndexNowPaths(paths: string[]): Promise<IndexNowSubmissionResult> {
  return submitIndexNowUrls(paths.map((path) => new URL(path, siteConfig.url).toString()));
}
