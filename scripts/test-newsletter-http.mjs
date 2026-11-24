import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import pg from 'pg';

// Requires the explicitly preloaded SMTP stub and a disposable DB, never prod.
const base = 'http://localhost:3198';
const databaseUrl = process.env.NEWSLETTER_TEST_DATABASE_URL;
const database = new URL(databaseUrl || 'about:blank');
assert.equal(database.hostname, '127.0.0.1'); assert.equal(database.port, '55439');
assert.equal(database.pathname, '/newsletter_abuse_test');
const capturePath = process.env.NEWSLETTER_SMTP_STUB_LOG;
assert(capturePath);
const captures = async () => (await readFile(capturePath, 'utf8')).trim().split('\n').map((line) => JSON.parse(line));
assert((await captures()).some((row) => row.kind === 'stub-ready'));
const mailCount = async () => (await captures()).filter((row) => row.kind === 'smtp').length;
assert.equal(await mailCount(), 0, 'Use a fresh capture log');
const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();
const manifest = JSON.parse(await readFile('.next/server/server-reference-manifest.json', 'utf8'));
const actionId = (name) => {
  const entry = Object.entries(manifest.node).find(([, value]) => value.exportedName === name);
  assert(entry, `Missing built Server Action ${name}`); return entry[0];
};
async function call(name, path, values) {
  const body = new FormData();
  // React 19.3's FormData references use <prefix>_<partId>_<field>.
  // Referenced fields must precede the root when Next decodes a streaming body.
  for (const [key, value] of Object.entries(values)) body.set(`_1_${key}`, value);
  body.set('0', JSON.stringify([{ status: 'idle' }, '$K1']));
  const response = await fetch(base + path, {
    method: 'POST', headers: { 'Next-Action': actionId(name), Origin: base, Accept: 'text/x-component' }, body,
  });
  const text = await response.text();
  assert.equal(response.status, 200, `Action HTTP ${response.status}`);
  const result = text.split('\n').flatMap((line) => {
    try { const value = JSON.parse(line.replace(/^[0-9a-f]+:/, '')); return value?.status ? [value] : []; }
    catch { return []; }
  }).at(-1);
  assert(result, 'No action result in React response'); return result;
}
async function setFlag(value) {
  await client.query('INSERT INTO "Settings" (id,key,value,"updatedAt") VALUES ($1,$2,$3,now()) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value,"updatedAt"=now()', [randomUUID(), 'newsletter.signup.enabled', JSON.stringify(value)]);
}
const checks = [];
async function check(name, task) { await task(); checks.push(name); console.log(`PASS ${name}`); }
const newsletter = { email: 'http-newsletter@example.test', locale: 'de', website: '', 'cf-turnstile-response': 'newsletter_signup' };
try {
  await client.query('DELETE FROM "Settings"');
  await client.query('DELETE FROM "NewsletterSubscriber"');
  await check('DE EN RU server HTML shows signup unavailable, footer form absent', async () => {
    const messages = await Promise.all(['de','en','ru'].map(async (locale) => JSON.parse(await readFile(`messages/${locale}.json`, 'utf8'))));
    for (const [index, path] of ['/', '/en', '/ru'].entries()) {
      const response = await fetch(base + path); const html = await response.text();
      assert.equal(response.status, 200); assert(html.includes(messages[index].Newsletter.unavailable));
      assert(!html.includes('id="newsletter-email-footer"'));
    }
  });
  await check('direct medical-page POST with missing or false switch never invokes SMTP', async () => {
    assert.equal((await call('subscribeToNewsletter', '/branchen/arztpraxen', newsletter)).status, 'unavailable');
    await setFlag(false);
    assert.equal((await call('subscribeToNewsletter', '/branchen/arztpraxen', newsletter)).status, 'unavailable');
    const response = await fetch(base + '/api/newsletter/status');
    assert.match(response.headers.get('cache-control'), /no-store/);
    assert.deepEqual(await response.json(), { enabled: false }); assert.equal(await mailCount(), 0);
  });
  await check('enabled direct POST requires CAPTCHA and sends one pending DOI', async () => {
    await setFlag(true);
    assert.deepEqual(await fetch(base + '/api/newsletter/status').then((r) => r.json()), { enabled: true });
    assert.equal((await call('subscribeToNewsletter', '/branchen/arztpraxen', { ...newsletter, 'cf-turnstile-response': '' })).message, 'captcha');
    assert.equal(await mailCount(), 0);
    assert.deepEqual(await call('subscribeToNewsletter', '/branchen/arztpraxen', newsletter), { status: 'success' });
    assert.equal(await mailCount(), 1);
    const { rows } = await client.query('SELECT confirmed FROM "NewsletterSubscriber" WHERE email=$1', [newsletter.email]);
    assert.equal(rows[0].confirmed, false);
  });
  await check('pending repeat and confirmed address cannot send another DOI over HTTP', async () => {
    assert.equal((await call('subscribeToNewsletter', '/branchen/arztpraxen', newsletter)).message, 'rate_limited');
    await client.query('UPDATE "NewsletterSubscriber" SET confirmed=true WHERE email=$1', [newsletter.email]);
    assert.equal((await call('subscribeToNewsletter', '/branchen/arztpraxen', newsletter)).status, 'already');
    assert.equal(await mailCount(), 1); await setFlag(false);
  });
  await check('contact, homepage and audit actions store leads and retain mail with signup off', async () => {
    const before = Number((await client.query('SELECT count(*) FROM "Lead"')).rows[0].count);
    for (const [source, path] of [['contact_page','/kontakt'], ['homepage_contact','/'], ['website_audit','/kostenlose-website-analyse']]) {
      const values = { name: 'Local HTTP Test', email: 'contact@example.test', locale: 'de', source, submissionId: randomUUID(), message: 'A local test request with no external delivery.', privacy: 'accepted', projectWebsite: 'https://example.test', website: '', 'cf-turnstile-response': source };
      const result = await call('submitContact', path, values);
      assert.equal(result.status, 'success'); assert.equal(result.created, true);
      assert.equal((await call('submitContact', path, values)).created, false);
    }
    assert.equal(Number((await client.query('SELECT count(*) FROM "Lead"')).rows[0].count), before + 3);
    assert.equal(await mailCount(), 7, 'One DOI plus three admin/client mail pairs; duplicates send nothing');
  });
  const output = { checkedAt: new Date().toISOString(), passed: checks.length, smtpStubCalls: await mailCount(), realEmails: 0, checks };
  await writeFile('docs/audits/2026-11-24-newsletter-http-tests.json', JSON.stringify(output, null, 2));
} finally { await setFlag(false); await client.end(); }
