import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPost, getRelated } from "@/entities/blog/api";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/shared/config/site";
import { extractToc } from "@/shared/lib/markdown";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { CtaBanner } from "@/shared/ui/CtaBanner";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/shared/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/shared/seo/schema";
import { Toc } from "@/widgets/blog/Toc";
import { ShareButtons } from "@/widgets/blog/ShareButtons";
import { PostCard } from "@/widgets/blog/PostCard";
import { LocaleSlugsProvider } from "@/features/language-switcher/LocaleSlugsContext";

type Params = { locale: string; slug: string };

export async function generateStaticParams() {
  try {
    const rows = (await prisma.blogPostTranslation.findMany({
      where: { post: { published: true } },
      select: { locale: true, slug: true },
    })) as { locale: string; slug: string }[];
    return rows.map((r) => ({ locale: r.locale, slug: r.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const post = await getPost(locale as AppLocale, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { languages: post.languages },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const post = await getPost(locale as AppLocale, slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "Blog" });
  const tp = await getTranslations({ locale, namespace: "Pages" });

  const toc = extractToc(post.content);
  const related = await getRelated(locale as AppLocale, slug, post.category?.slug);
  const path = `${locale === routing.defaultLocale ? "" : `/${locale}`}/blog/${slug}`;
  const fullUrl = `${siteConfig.url}${path}`;
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <LocaleSlugsProvider slugs={post.slugs}>
      <Navbar />
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.excerpt,
            path,
            locale,
            datePublished: post.publishedAt,
            image: post.coverImage,
            authorName: post.author?.name,
          }),
          breadcrumbSchema([
            { name: tp("home"), path: locale === routing.defaultLocale ? "/" : `/${locale}` },
            { name: t("title"), path: `${locale === routing.defaultLocale ? "" : `/${locale}`}/blog` },
            { name: post.title, path },
          ]),
        ]}
      />
      <main>
        <Breadcrumbs
          items={[
            { name: tp("home"), href: "/" },
            { name: t("title"), href: "/blog" },
            { name: post.title },
          ]}
        />

        <article className="py-10">
          <Container>
            <header className="mx-auto max-w-3xl">
              {post.category && (
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-brand-purple">
                  {post.category.name}
                </span>
              )}
              <h1 className="mt-3 text-[clamp(30px,5vw,52px)] font-bold leading-tight tracking-tight text-dark">
                {post.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-[13.5px] text-muted">
                {post.author && (
                  <>
                    <span>
                      {t("by")} <b className="font-semibold text-ink">{post.author.name}</b>
                      {post.author.role ? `, ${post.author.role}` : ""}
                    </span>
                    <span className="text-line">·</span>
                  </>
                )}
                {date && <span>{date}</span>}
                {date && <span className="text-line">·</span>}
                <span>
                  {post.readingTime} {t("readingTime")}
                </span>
              </div>
            </header>

            <div className="mx-auto mt-10 grid max-w-5xl gap-12 lg:grid-cols-[1fr_240px]">
              <div className="markdown min-w-0 max-w-3xl">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
                  {post.content}
                </ReactMarkdown>

                <div className="mt-12 border-t border-line pt-6">
                  <ShareButtons
                    url={fullUrl}
                    title={post.title}
                    shareLabel={t("share")}
                    copyLabel={t("copy")}
                    copiedLabel={t("copied")}
                  />
                </div>
              </div>

              {toc.length > 0 && (
                <aside className="hidden lg:block">
                  <div className="sticky top-24">
                    <Toc items={toc} title={t("toc")} />
                  </div>
                </aside>
              )}
            </div>
          </Container>
        </article>

        {related.length > 0 && (
          <section className="py-16">
            <Container>
              <h2 className="mb-8 text-2xl font-bold tracking-tight text-dark">{t("related")}</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <PostCard key={p.slug} post={p} locale={locale} />
                ))}
              </div>
            </Container>
          </section>
        )}

        <CtaBanner />

        <Container>
          <div className="pb-10">
            <Link href="/blog" className="text-sm font-semibold text-brand-purple">
              ← {t("back")}
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </LocaleSlugsProvider>
  );
}
