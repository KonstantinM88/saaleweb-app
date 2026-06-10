import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { getCategories, getPosts } from "@/entities/blog/api";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Container } from "@/shared/ui/Container";
import { Link } from "@/i18n/navigation";
import { PostCard } from "@/widgets/blog/PostCard";
import { cn } from "@/shared/lib/cn";

type Params = { locale: string };
type Search = { [key: string]: string | string[] | undefined };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Blog" });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${l === routing.defaultLocale ? "" : `/${l}`}/blog`]),
  );
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: { languages },
  };
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const { kategorie } = await searchParams;
  const activeCategory = typeof kategorie === "string" ? kategorie : undefined;

  const t = await getTranslations({ locale, namespace: "Blog" });
  const [categories, posts] = await Promise.all([
    getCategories(locale),
    getPosts(locale, activeCategory),
  ]);

  const chip = "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors";

  return (
    <>
      <Navbar />
      <main>
        <section className="py-14">
          <Container>
            <span className="eyebrow">{t("eyebrow")}</span>
            <h1 className="mt-4 text-[clamp(32px,5vw,56px)] font-bold tracking-tight text-dark">
              {t("title")}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">{t("subtitle")}</p>

            {categories.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                <Link
                  href="/blog"
                  className={cn(
                    chip,
                    !activeCategory
                      ? "border-transparent bg-dark text-white"
                      : "border-line bg-white text-ink hover:border-brand-purple",
                  )}
                >
                  {t("all")}
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/blog?kategorie=${c.slug}`}
                    className={cn(
                      chip,
                      activeCategory === c.slug
                        ? "border-transparent bg-dark text-white"
                        : "border-line bg-white text-ink hover:border-brand-purple",
                    )}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}

            {posts.length === 0 ? (
              <p className="mt-12 rounded-2xl border border-dashed border-line bg-surface p-10 text-center text-muted">
                {t("empty")}
              </p>
            ) : (
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} locale={locale} />
                ))}
              </div>
            )}
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
