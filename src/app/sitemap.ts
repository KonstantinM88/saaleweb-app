import type { MetadataRoute } from "next";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { siteConfig } from "@/shared/config/site";
import { cities } from "@/shared/config/cities";
import { getBlogSlugGroups, getCategorySlugGroups } from "@/entities/blog/api";
import { prisma } from "@/lib/prisma";
import { getSeoIndustrySlugGroups, getSeoServiceSlugGroups } from "@/widgets/seo-landing/phase4Content";

const BASE = siteConfig.url;
const abs = (p: string) => `${BASE}${p}`;

type Entry = MetadataRoute.Sitemap[number];

function entry(
  defLocale: AppLocale,
  defPath: string,
  languages: Record<string, string>,
  priority: number,
  changeFrequency: Entry["changeFrequency"],
): Entry {
  const alternates = {
    ...languages,
    "x-default": abs(defPath),
  };
  return {
    url: abs(defPath),
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: { languages: alternates },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Home + index pages (same path key across locales, prefix/pathnames differ)
  for (const href of ["/", "/blog", "/leistungen", "/branchen", "/kontakt", "/preise", "/projekte"] as const) {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [l, abs(getPathname({ locale: l, href }))]),
    );
    entries.push(entry(routing.defaultLocale, getPathname({ locale: routing.defaultLocale, href }), languages, href === "/" ? 1 : 0.7, "weekly"));
  }

  // Local landing pages
  for (const city of cities) {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [
        l,
        abs(getPathname({ locale: l, href: { pathname: "/standorte/[slug]", params: { slug: city.slug } } })),
      ]),
    );
    entries.push(
      entry(
        routing.defaultLocale,
        getPathname({ locale: routing.defaultLocale, href: { pathname: "/standorte/[slug]", params: { slug: city.slug } } }),
        languages,
        0.6,
        "monthly",
      ),
    );
  }

  // Phase 4 commercial SEO/GEO landing pages grouped by localized slugs.
  for (const slugs of getSeoServiceSlugGroups()) {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [
        l,
        abs(getPathname({ locale: l, href: { pathname: "/leistungen/[slug]", params: { slug: slugs[l] } } })),
      ]),
    );
    const path = getPathname({
      locale: routing.defaultLocale,
      href: { pathname: "/leistungen/[slug]", params: { slug: slugs.de } },
    });
    entries.push(entry(routing.defaultLocale, path, languages, 0.85, "monthly"));
  }

  for (const slugs of getSeoIndustrySlugGroups()) {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [
        l,
        abs(getPathname({ locale: l, href: { pathname: "/branchen/[slug]", params: { slug: slugs[l] } } })),
      ]),
    );
    const path = getPathname({
      locale: routing.defaultLocale,
      href: { pathname: "/branchen/[slug]", params: { slug: slugs.de } },
    });
    entries.push(entry(routing.defaultLocale, path, languages, 0.78, "monthly"));
  }

  // Blog posts (MDX) — grouped by post for hreflang
  for (const group of await getBlogSlugGroups()) {
    const languages: Record<string, string> = {};
    for (const [l, slug] of Object.entries(group)) {
      languages[l] = abs(getPathname({ locale: l as AppLocale, href: { pathname: "/blog/[slug]", params: { slug } } }));
    }
    const defSlug = group[routing.defaultLocale] ?? Object.values(group)[0];
    entries.push(
      entry(
        routing.defaultLocale,
        getPathname({ locale: routing.defaultLocale, href: { pathname: "/blog/[slug]", params: { slug: defSlug } } }),
        languages,
        0.7,
        "monthly",
      ),
    );
  }

  // Blog categories (per-locale slugs grouped for hreflang)
  for (const group of await getCategorySlugGroups()) {
    const languages: Record<string, string> = {};
    for (const [l, slug] of Object.entries(group)) {
      languages[l] = abs(getPathname({ locale: l as AppLocale, href: { pathname: "/blog/kategorie/[slug]", params: { slug } } }));
    }
    const defSlug = group[routing.defaultLocale] ?? Object.values(group)[0];
    entries.push(
      entry(
        routing.defaultLocale,
        getPathname({ locale: routing.defaultLocale, href: { pathname: "/blog/kategorie/[slug]", params: { slug: defSlug } } }),
        languages,
        0.5,
        "monthly",
      ),
    );
  }

  // Services & industries (DB-backed, per-locale slugs). Skipped without a DB.
  try {
    const services = (await prisma.serviceTranslation.findMany({
      where: { service: { published: true } },
      select: { locale: true, slug: true, serviceId: true },
    })) as { locale: string; slug: string; serviceId: string }[];
    entries.push(...groupDbEntries(services, (r) => r.serviceId, "/leistungen/[slug]"));

    const industries = (await prisma.industryTranslation.findMany({
      where: { industry: { published: true } },
      select: { locale: true, slug: true, industryId: true },
    })) as { locale: string; slug: string; industryId: string }[];
    entries.push(...groupDbEntries(industries, (r) => r.industryId, "/branchen/[slug]"));

    const projects = (await prisma.projectTranslation.findMany({
      where: { project: { published: true } },
      select: { locale: true, slug: true, projectId: true },
    })) as { locale: string; slug: string; projectId: string }[];
    entries.push(...groupDbEntries(projects, (r) => r.projectId, "/projekte/[slug]"));
  } catch {
    // No DB during build — file-based routes are emitted regardless.
  }

  return dedupeEntries(entries);
}

function groupDbEntries<T extends { locale: string; slug: string }>(
  rows: T[],
  idOf: (r: T) => string,
  pathname: "/leistungen/[slug]" | "/branchen/[slug]" | "/projekte/[slug]",
): MetadataRoute.Sitemap {
  const groups = new Map<string, T[]>();
  for (const r of rows) {
    const list = groups.get(idOf(r)) ?? [];
    list.push(r);
    groups.set(idOf(r), list);
  }
  return [...groups.values()].map((list) => {
    const languages: Record<string, string> = {};
    for (const r of list) {
      languages[r.locale] = abs(getPathname({ locale: r.locale as AppLocale, href: { pathname, params: { slug: r.slug } } }));
    }
    const def = list.find((r) => r.locale === routing.defaultLocale) ?? list[0];
    return entry(
      routing.defaultLocale,
      getPathname({ locale: def.locale as AppLocale, href: { pathname, params: { slug: def.slug } } }),
      languages,
      0.8,
      "monthly",
    );
  });
}

function dedupeEntries(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  return entries.filter((item) => {
    const key = item.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
