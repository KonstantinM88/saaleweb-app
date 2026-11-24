/** Read-only regression check for GSC-discovered URL-like React keys and aliases.
 * node scripts/check-seo-url-integrity.mjs --base http://localhost:3198
 */
const baseIndex = process.argv.indexOf('--base');
const base = (baseIndex >= 0 ? process.argv[baseIndex + 1] : 'http://localhost:3198')?.replace(/\/$/, '');
if (!base || !/^https?:\/\//.test(base)) throw new Error('Pass an HTTP(S) --base URL');
const redirects = [
  ['/leistungen/website-wartung-Website-Wartung', '/leistungen/website-wartung'],
  ['/leistungen/proizvoditelnost', '/leistungen/performance-optimierung'],
  ['/en/services/proizvoditelnost', '/en/services/performance-optimization'],
  ['/ru/uslugi/performance', '/ru/uslugi/optimizaciya-proizvoditelnosti'],
];
const sources = [
  '/leistungen/website-sicherheit', '/en/services/website-security', '/ru/uslugi/bezopasnost-sayta',
  '/leistungen', '/en/services', '/ru/uslugi',
];
const forbidden = '/leistungen/website-wartung-Website-Wartung';
const retainedHubLinks = {
  '/en/services': ['/en/services/web-development', '/en/services/maintenance'],
  '/ru/uslugi': ['/ru/uslugi/razrabotka-sajtov', '/ru/uslugi/podderzhka'],
};
const checks = [];
async function fetchPage(path) {
  return fetch(base + path, {redirect: 'manual', signal: AbortSignal.timeout(30_000)});
}
for (const [source, target] of redirects) {
  for (const query of ['', '?utm_source=url-integrity&check=1']) {
    const response = await fetchPage(source + query);
    const location = new URL(response.headers.get('location') || source, base);
    await response.body?.cancel();
    if (response.status !== 308 || location.pathname !== target || location.search !== query) {
      throw new Error(`Expected one 308 preserving query: ${source}${query}; got ${response.status} ${location.pathname}${location.search}`);
    }
    const destination = await fetchPage(target + query);
    const html = await destination.text();
    if (destination.status !== 200 || !/<h1\b/.test(html)) throw new Error(`Invalid redirect target: ${target}`);
    checks.push({source: source + query, target: target + query, status: '308 -> 200'});
  }
}
for (const path of sources) {
  const response = await fetchPage(path);
  const html = await response.text();
  if (response.status !== 200) throw new Error(`Source page HTTP ${response.status}: ${path}`);
  // Check the whole response, including serialized React payloads, not just hrefs.
  if (html.includes(forbidden)) throw new Error(`Synthetic URL still serialized in ${path}`);
  checks.push({source: path, status: '200; no malformed URL in HTML/RSC'});
  for (const href of retainedHubLinks[path] || []) {
    if (!html.includes(`href="${href}"`)) throw new Error(`Retained service has no hub link: ${href}`);
    checks.push({source: path, target: href, status: 'Retained service linked in server HTML'});
  }
}
console.log(JSON.stringify({base, passed: checks.length, checks}, null, 2));
