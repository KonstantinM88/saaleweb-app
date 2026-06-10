import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/shared/config/site";
import { cities } from "@/shared/config/cities";
import { prisma } from "@/lib/prisma";

const BASE = siteConfig.url;

function abs(locale: string, path: string) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${BASE}${prefix}${path === "/" ? "/" : path}`;
}

/** A page that shares the same path across all locales (static routes). */
function sharedEntry(path: string, priority = 0.7): MetadataRoute.Sitemap[number] {
  return {
    url: abs(routing.defaultLocale, path),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, abs(l, path)])),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    sharedEntry("/", 1),
    ...cities.map((c) => sharedEntry(`/standorte/${c.slug}`, 0.6)),
  ];

  // Dynamic, DB-backed routes with per-locale slugs (grouped for hreflang).
  try {
    const services = (await prisma.serviceTranslation.findMany({
      where: { service: { published: true } },
      select: { locale: true, slug: true, serviceId: true },
    })) as { locale: string; slug: string; serviceId: string }[];
    entries.push(...groupBySlug(services, "leistungen", (r) => r.serviceId));

    const industries = (await prisma.industryTranslation.findMany({
      where: { industry: { published: true } },
      select: { locale: true, slug: true, industryId: true },
    })) as { locale: string; slug: string; industryId: string }[];
    entries.push(...groupBySlug(industries, "branchen", (r) => r.industryId));
  } catch {
    // No DB during build — static + city routes are emitted regardless.
  }

  return entries;
}

type Row = { locale: string; slug: string };

function groupBySlug<T extends Row>(
  rows: T[],
  segment: string,
  idOf: (r: T) => string,
): MetadataRoute.Sitemap {
  const groups = new Map<string, T[]>();
  for (const r of rows) {
    const key = idOf(r);
    const list = groups.get(key) ?? [];
    list.push(r);
    groups.set(key, list);
  }

  return [...groups.values()].map((list) => {
    const def = list.find((r) => r.locale === routing.defaultLocale) ?? list[0];
    const languages = Object.fromEntries(
      list.map((r) => [r.locale, abs(r.locale, `/${segment}/${r.slug}`)]),
    );
    return {
      url: abs(def.locale, `/${segment}/${def.slug}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages },
    };
  });
}
