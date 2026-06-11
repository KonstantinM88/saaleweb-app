import { getPosts } from "@/entities/blog/api";
import { siteConfig } from "@/shared/config/site";
import { routing, type AppLocale } from "@/i18n/routing";

export const revalidate = 3600;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") ?? "";
  const locale: AppLocale = (routing.locales as readonly string[]).includes(lang)
    ? (lang as AppLocale)
    : routing.defaultLocale;
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const base = siteConfig.url;

  let posts: Awaited<ReturnType<typeof getPosts>> = [];
  try {
    posts = await getPosts(locale);
  } catch {
    posts = [];
  }

  const feedUrl = `${base}/blog/rss.xml${locale === routing.defaultLocale ? "" : `?lang=${locale}`}`;
  const items = posts
    .map((p) => {
      const url = `${base}${prefix}/blog/${p.slug}`;
      const date = (p.publishedAt ? new Date(p.publishedAt) : new Date()).toUTCString();
      const desc = p.excerpt ? `<description>${esc(p.excerpt)}</description>` : "";
      return `<item><title>${esc(p.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid>${desc}<pubDate>${date}</pubDate></item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(siteConfig.name)} - Blog</title>
<link>${base}${prefix}/blog</link>
<description>${esc(siteConfig.name)} Blog</description>
<language>${locale}</language>
<atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
