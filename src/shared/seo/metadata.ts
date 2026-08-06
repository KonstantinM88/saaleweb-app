import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAppLocale } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import { SEO_OVERRIDE_CACHE_SECONDS, SEO_OVERRIDE_CACHE_TAG } from "./cache";
import { ogImageUrl } from "./og";

type SeoOverride = { title: string | null; description: string | null; ogImage: string | null };

const readCachedSeoOverride = unstable_cache(
  async (path: string, locale: AppLocale): Promise<SeoOverride | null> => {
    const page = (await prisma.sEOPage.findUnique({
      where: { path },
      include: { translations: { where: { locale }, take: 1 } },
    })) as { translations: { title: string; description: string; ogImage: string | null }[] } | null;
    const translation = page?.translations?.[0];

    if (!translation) return null;

    return {
      title: translation.title ?? null,
      description: translation.description ?? null,
      ogImage: translation.ogImage ?? null,
    };
  },
  ["seo-page-override-v1"],
  {
    // Metadata changes are rare. Admin actions invalidate this tag immediately.
    revalidate: SEO_OVERRIDE_CACHE_SECONDS,
    tags: [SEO_OVERRIDE_CACHE_TAG],
  },
);

/** Reads an admin-managed SEOPage override for a path + locale. */
export async function getSeoOverride(path: string, locale: string): Promise<SeoOverride | null> {
  if (!isAppLocale(locale)) return null;

  try {
    return await readCachedSeoOverride(path, locale);
  } catch {
    return null;
  }
}

/**
 * Builds page metadata: SEOPage override (if any) wins over the provided
 * fallback; OG image is the custom ogImage or a generated /api/og card.
 */
export async function buildMetadata(opts: {
  path: string;
  locale: string;
  title: string;
  description?: string;
  eyebrow?: string;
  languages?: Record<string, string>;
  canonical?: string;
  image?: string | null;
  ogType?: "website" | "article";
}): Promise<Metadata> {
  const override = await getSeoOverride(opts.path, opts.locale);
  const title = override?.title || opts.title;
  const description = override?.description || opts.description;
  const ogImage = override?.ogImage || opts.image || ogImageUrl({ title, eyebrow: opts.eyebrow });
  const languages =
    opts.languages && !opts.languages["x-default"]
      ? { ...opts.languages, "x-default": opts.languages.de ?? opts.canonical ?? "/" }
      : opts.languages;
  const canonical = opts.canonical ?? languages?.[opts.locale] ?? opts.path;

  return {
    title,
    description,
    alternates: languages || canonical ? { canonical, languages } : undefined,
    openGraph: {
      title,
      description,
      type: opts.ogType ?? "website",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
