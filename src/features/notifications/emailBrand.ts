import "server-only";

import { siteConfig } from "@/shared/config/site";

const EMAIL_LOGO_PATH = "/brand/saaleweb-email-logo.png";
const PRODUCTION_SITE_URL = `https://${siteConfig.domain}`;

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function isLocalUrl(value: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(value);
}

function emailAssetBaseUrl(): string {
  const configured = process.env.EMAIL_ASSET_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_SITE_URL;
  const baseUrl = trimTrailingSlash(configured);

  return isLocalUrl(baseUrl) ? PRODUCTION_SITE_URL : baseUrl;
}

function escAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function emailBrandHeader(): string {
  const logoUrl = `${emailAssetBaseUrl()}${EMAIL_LOGO_PATH}`;

  return (
    `<div style="margin:0 0 24px;padding:18px 20px;border-radius:20px;background:linear-gradient(135deg,#fff7fb,#f6f2ff);border:1px solid #eadcff">` +
    `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">` +
    `<tr>` +
    `<td style="width:52px;vertical-align:middle">` +
    `<img src="${escAttr(logoUrl)}" width="44" height="44" alt="SaaleWeb" style="display:block;border:0;border-radius:14px;outline:none;text-decoration:none" />` +
    `</td>` +
    `<td style="vertical-align:middle;padding-left:12px">` +
    `<div style="font:800 18px/1.2 system-ui,-apple-system,Segoe UI,sans-serif;color:#111827">SaaleWeb</div>` +
    `<div style="font:500 12px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;color:#6b7280">Websites · SEO · AI Search</div>` +
    `</td>` +
    `</tr>` +
    `</table>` +
    `</div>`
  );
}
