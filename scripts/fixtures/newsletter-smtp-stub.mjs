// Explicitly preloaded ONLY by the isolated localhost HTTP test server.
// This is not imported by application code and exposes no runtime test endpoint.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import net from 'node:net';
const database = new URL(process.env.DATABASE_URL || 'about:blank');
assert.equal(database.hostname, '127.0.0.1');
assert.equal(database.port, '55439');
assert.equal(database.pathname, '/newsletter_abuse_test');
const output = process.env.NEWSLETTER_SMTP_STUB_LOG;
assert(output, 'Require an explicit local SMTP capture path');
Object.assign(process.env, {
  AUTH_SECRET: 'newsletter-local-http-secret-not-production',
  MAIL_PROVIDER: 'smtp', SMTP_HOST: '127.0.0.1', SMTP_PORT: '55440', SMTP_SECURE: 'false',
  SMTP_USER: 'sender@example.test', SMTP_PASSWORD: 'synthetic-test-password',
  SMTP_FROM: 'SaaleWeb Test <sender@example.test>', NEWSLETTER_FROM: 'SaaleWeb Test <sender@example.test>',
  LEAD_NOTIFY_TO: 'operator@example.test', RESEND_API_KEY: '', TELEGRAM_BOT_TOKEN: '',
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'synthetic-site-key', TURNSTILE_SECRET_KEY: 'synthetic-secret-key',
});
// A loopback SMTP sink also captures a mailer bundled into Next's server chunks.
// It never relays mail, uses synthetic authentication and accepts only .test RCPTs.
const smtp = net.createServer((socket) => {
  fs.appendFileSync(output, JSON.stringify({ kind: 'smtp-connection' }) + '\n');
  socket.setEncoding('utf8'); socket.setTimeout(20_000, () => socket.destroy());
  socket.write('220 localhost SMTP test sink\r\n');
  let buffer = ''; let data = false; let auth = false; let recipients = [];
  socket.on('data', (chunk) => {
    buffer += chunk;
    while (buffer.length) {
      if (data) {
        const end = buffer.indexOf('\r\n.\r\n'); if (end < 0) break;
        const message = buffer.slice(0, end); buffer = buffer.slice(end + 5); data = false;
        fs.appendFileSync(output, JSON.stringify({ kind: 'smtp', to: recipients, subject: message.match(/^Subject: (.*)$/mi)?.[1] || '' }) + '\n');
        socket.write('250 captured locally; never relayed\r\n'); continue;
      }
      const end = buffer.indexOf('\r\n'); if (end < 0) break;
      const line = buffer.slice(0, end); buffer = buffer.slice(end + 2);
      if (auth) { auth = false; socket.write('235 authenticated for test\r\n'); continue; }
      if (/^EHLO|^HELO/i.test(line)) socket.write('250-localhost\r\n250-AUTH PLAIN\r\n250 8BITMIME\r\n');
      else if (/^AUTH PLAIN/i.test(line)) { if (line.split(' ').length > 2) socket.write('235 authenticated for test\r\n'); else { auth = true; socket.write('334 \r\n'); } }
      else if (/^MAIL FROM:/i.test(line)) { recipients = []; socket.write('250 sender ok\r\n'); }
      else if (/^RCPT TO:/i.test(line)) {
        const recipient = line.match(/<([^>]+)>/)?.[1];
        if (!recipient?.endsWith('@example.test')) socket.write('550 only reserved test addresses allowed\r\n');
        else { recipients.push(recipient); socket.write('250 recipient ok\r\n'); }
      }
      else if (/^DATA$/i.test(line)) { data = true; socket.write('354 end with dot\r\n'); }
      else if (/^QUIT$/i.test(line)) socket.end('221 goodbye\r\n');
      else socket.write('250 ok\r\n');
    }
  });
});
await new Promise((resolve, reject) => { smtp.once('error', reject); smtp.listen(55440, '127.0.0.1', resolve); });
const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = String(input instanceof Request ? input.url : input);
  if (url === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') {
    const rawBody = init?.body !== undefined ? await new Response(init.body).text() : input instanceof Request ? await input.clone().text() : '';
    const token = new URLSearchParams(rawBody).get('response');
    const actions = ['newsletter_signup', 'homepage_contact', 'contact_page', 'website_audit'];
    return Response.json({ success: actions.includes(token), hostname: 'saaleweb.de', action: token });
  }
  assert(['localhost', '127.0.0.1', '[::1]'].includes(new URL(url).hostname), 'No outbound HTTP allowed from the isolated test server');
  return realFetch(input, init);
};
fs.appendFileSync(output, JSON.stringify({ kind: 'stub-ready' }) + '\n');
