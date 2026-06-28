import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { AppLocale } from "@/i18n/routing";
import { ogImageUrl } from "./og";

type SeoOverride = { title: string | null; description: string | null; ogImage: string | null };

/** Reads an admin-managed SEOPage override for a path + locale. */
export async function getSeoOverride(path: string, locale: string): Promise<SeoOverride | null> {
  try {
    const page = (await prisma.sEOPage.findUnique({
      where: { path },
      include: { translations: { where: { locale: locale as AppLocale }, take: 1 } },
    })) as { translations: { title: string; description: string; ogImage: string | null }[] } | null;
    const tr = page?.translations?.[0];
    if (!tr) return null;
    return { title: tr.title ?? null, description: tr.description ?? null, ogImage: tr.ogImage ?? null };
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

  return {
    title,
    description,
    alternates: opts.languages || opts.canonical ? { canonical: opts.canonical, languages: opts.languages } : undefined,
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
