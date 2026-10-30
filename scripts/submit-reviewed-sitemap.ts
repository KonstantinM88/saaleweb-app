/** Check the published DE pilot; use --submit to submit its sitemap to GSC. */
import fs from "node:fs/promises";
import dotenv from "dotenv";
import { getGoogleServiceAccountAccessToken } from "../src/features/google/serviceAccount";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ path: ".env", quiet: true });

const site = "https://saaleweb.de/";
const base = site.slice(0, -1);
const sitemapUrl = `${site}sitemap.xml`;
const pairs = [
  ["/leistungen/website-entwicklung", "/leistungen/website-erstellen-lassen"],
  ["/leistungen/wartung", "/leistungen/website-wartung"],
] as const;
const submit = process.argv.includes("--submit");
const timeout = () => AbortSignal.timeout(25_000);
const checks: { check: string; ok: boolean; status: number }[] = [];

for (const [source, destination] of pairs) {
  const response = await fetch(`${base}${source}`, { redirect: "manual", signal: timeout() });
  const location = response.headers.get("location");
  const target = location ? new URL(location, base).href : null;
  checks.push({ check: source, ok: response.status === 308 && target === `${base}${destination}`, status: response.status });
  const page = await fetch(`${base}${destination}`, { redirect: "manual", signal: timeout() });
  checks.push({ check: destination, ok: page.status === 200, status: page.status });
}

const sitemap = await fetch(sitemapUrl, { signal: timeout(), headers: { "Cache-Control": "no-cache" } });
const xml = await sitemap.text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const retired = pairs.map(([source]) => `${base}${source}`);
const ready = checks.every((check) => check.ok) && sitemap.status === 200 && urls.length === 229
  && new Set(urls).size === 229 && retired.every((url) => !xml.includes(`"${url}"`) && !urls.includes(url));
const result = { checkedAt: new Date().toISOString(), sitemapUrl, ready, urls: urls.length, checks, submitted: false };

if (!ready) {
  console.log(JSON.stringify({ ...result, state: "awaiting_publication", googleApiCalled: false }, null, 2));
  if (submit) process.exitCode = 1;
} else if (!submit) {
  console.log(JSON.stringify({ ...result, state: "ready_for_submission", googleApiCalled: false }, null, 2));
} else {
  const configuredSite = process.env.GSC_SITE_URL?.trim() || site;
  if (configuredSite !== site) throw new Error("GSC property does not match the reviewed site");
  const token = await getGoogleServiceAccountAccessToken("https://www.googleapis.com/auth/webmasters");
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
  const response = await fetch(endpoint, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, signal: timeout() });
  const output = { ...result, submitted: response.status === 204, status: response.status, submittedAt: new Date().toISOString() };
  await fs.writeFile("docs/audits/2026-10-30-indexation-sitemap-submission.json", JSON.stringify(output, null, 2) + "\n");
  console.log(JSON.stringify(output, null, 2));
  if (!response.ok) process.exitCode = 1;
}
