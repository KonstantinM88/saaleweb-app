import { prisma } from "@/lib/prisma";
import { routing, type AppLocale } from "@/i18n/routing";
import { readingTimeMinutes } from "@/shared/lib/markdown";

export type PostCategory = { slug: string; name: string };

export type PostListItem = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  readingTime: number;
  category: PostCategory | null;
};

export type PostDetail = PostListItem & {
  content: string;
  author: { name: string; role: string | null } | null;
  languages: Record<string, string>;
  /** Per-locale slug map for smart language switching. */
  slugs: Record<string, string>;
};

type CategoryTr = { locale: string; name: string; slug: string };

function pickCategory(
  translations: CategoryTr[] | undefined,
  locale: AppLocale,
): PostCategory | null {
  const tr = translations?.find((c) => c.locale === locale);
  return tr ? { slug: tr.slug, name: tr.name } : null;
}

export async function getCategories(locale: AppLocale): Promise<PostCategory[]> {
  try {
    const rows = (await prisma.blogCategory.findMany({
      where: { posts: { some: { published: true } } },
      include: { translations: true },
    })) as { translations: CategoryTr[] }[];
    return rows
      .map((r) => pickCategory(r.translations, locale))
      .filter((c): c is PostCategory => c !== null);
  } catch {
    return [];
  }
}

export async function getPosts(
  locale: AppLocale,
  categorySlug?: string,
): Promise<PostListItem[]> {
  try {
    const rows = (await prisma.blogPostTranslation.findMany({
      where: {
        locale,
        post: {
          published: true,
          ...(categorySlug
            ? { category: { translations: { some: { locale, slug: categorySlug } } } }
            : {}),
        },
      },
      orderBy: { post: { publishedAt: "desc" } },
      include: { post: { include: { category: { include: { translations: true } } } } },
    })) as RawTr[];
    return rows.map((r) => toListItem(r, locale));
  } catch {
    return [];
  }
}

export async function getPost(
  locale: AppLocale,
  slug: string,
): Promise<PostDetail | null> {
  try {
    const tr = (await prisma.blogPostTranslation.findFirst({
      where: { locale, slug, post: { published: true } },
      include: {
        post: {
          include: {
            translations: true,
            category: { include: { translations: true } },
            author: { include: { translations: true } },
          },
        },
      },
    })) as RawDetail | null;
    if (!tr) return null;

    const languages: Record<string, string> = {};
    const slugs: Record<string, string> = {};
    for (const sib of tr.post.translations) {
      const prefix = sib.locale === routing.defaultLocale ? "" : `/${sib.locale}`;
      languages[sib.locale] = `${prefix}/blog/${sib.slug}`;
      slugs[sib.locale] = sib.slug;
    }

    const authorRole =
      tr.post.author?.translations.find((a) => a.locale === locale)?.role ?? null;

    return {
      ...toListItem(tr, locale),
      content: tr.content,
      author: tr.post.author ? { name: tr.post.author.name, role: authorRole } : null,
      languages,
      slugs,
    };
  } catch {
    return null;
  }
}

export async function getRelated(
  locale: AppLocale,
  currentSlug: string,
  categorySlug?: string,
): Promise<PostListItem[]> {
  const posts = await getPosts(locale, categorySlug);
  return posts.filter((p) => p.slug !== currentSlug).slice(0, 3);
}

/** { locale, slug } category pairs for generateStaticParams of the category page. */
export async function getAllCategoryParams(): Promise<{ locale: string; slug: string }[]> {
  try {
    const rows = (await prisma.blogCategoryTranslation.findMany({
      where: { category: { posts: { some: { published: true } } } },
      select: { locale: true, slug: true },
    })) as { locale: string; slug: string }[];
    return rows.map((r) => ({ locale: r.locale, slug: r.slug }));
  } catch {
    return [];
  }
}

/** Per-post mapping of locale -> slug (sitemap hreflang grouping). */
export async function getBlogSlugGroups(): Promise<Record<string, string>[]> {
  try {
    const posts = (await prisma.blogPost.findMany({
      where: { published: true },
      include: { translations: { select: { locale: true, slug: true } } },
    })) as { translations: { locale: string; slug: string }[] }[];
    return posts.map((p) =>
      Object.fromEntries(p.translations.map((t) => [t.locale, t.slug])),
    );
  } catch {
    return [];
  }
}

/** Per-category mapping of locale -> slug (sitemap hreflang grouping). */
export async function getCategorySlugGroups(): Promise<Record<string, string>[]> {
  try {
    const cats = (await prisma.blogCategory.findMany({
      where: { posts: { some: { published: true } } },
      include: { translations: { select: { locale: true, slug: true } } },
    })) as { translations: { locale: string; slug: string }[] }[];
    return cats.map((c) =>
      Object.fromEntries(c.translations.map((t) => [t.locale, t.slug])),
    );
  } catch {
    return [];
  }
}

/** Locale -> slug map for one category, located by its slug in a given locale. */
export async function getCategoryLocaleSlugs(
  locale: AppLocale,
  slug: string,
): Promise<Record<string, string> | null> {
  try {
    const tr = (await prisma.blogCategoryTranslation.findFirst({
      where: { locale, slug },
      include: {
        category: { include: { translations: { select: { locale: true, slug: true } } } },
      },
    })) as { category: { translations: { locale: string; slug: string }[] } } | null;
    if (!tr) return null;
    return Object.fromEntries(tr.category.translations.map((t) => [t.locale, t.slug]));
  } catch {
    return null;
  }
}

// ---- internal mapping ----

type RawTr = {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  post: {
    coverImage: string | null;
    publishedAt: Date | null;
    readingTime: number | null;
    category: { translations: CategoryTr[] } | null;
  };
};

type RawDetail = RawTr & {
  post: RawTr["post"] & {
    translations: { locale: string; slug: string }[];
    author: { name: string; translations: { locale: string; role: string }[] } | null;
  };
};

function toListItem(r: RawTr, locale: AppLocale): PostListItem {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    coverImage: r.post.coverImage,
    publishedAt: r.post.publishedAt ? r.post.publishedAt.toISOString() : null,
    readingTime: r.post.readingTime ?? readingTimeMinutes(r.content),
    category: pickCategory(r.post.category?.translations, locale),
  };
}
