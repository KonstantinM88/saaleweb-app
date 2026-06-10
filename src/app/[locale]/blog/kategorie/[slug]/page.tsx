import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  getPosts,
  getCategories,
  getAllCategoryParams,
  getCategoryLocaleSlugs,
} from "@/entities/blog/api";
import { LocaleSlugsProvider } from "@/features/language-switcher/LocaleSlugsContext";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { Link, getPathname } from "@/i18n/navigation";
import { PostCard } from "@/widgets/blog/PostCard";
import { cn } from "@/shared/lib/cn";

type Params = { locale: string; slug: string };

export async function generateStaticParams() {
  return getAllCategoryParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const categories = await getCategories(locale);
  const current = categories.find((c) => c.slug === slug);
  if (!current) return {};
  const t = await getTranslations({ locale, namespace: "Blog" });
  const localeSlugs = (await getCategoryLocaleSlugs(locale, slug)) ?? {};
  const languages = Object.fromEntries(
    routing.locales
      .filter((l) => localeSlugs[l] ?? l === locale)
      .map((l) => [
        l,
        getPathname({
          locale: l,
          href: { pathname: "/blog/kategorie/[slug]", params: { slug: localeSlugs[l] ?? slug } },
        }),
      ]),
  );
  return {
    title: `${current.name} — ${t("title")}`,
    description: t("subtitle"),
    alternates: { languages },
  };
}

export default async function BlogCategoryPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const categories = await getCategories(locale as AppLocale);
  const current = categories.find((c) => c.slug === slug);
  if (!current) notFound();

  const t = await getTranslations({ locale, namespace: "Blog" });
  const tp = await getTranslations({ locale, namespace: "Pages" });
  const [posts, localeSlugs] = await Promise.all([
    getPosts(locale as AppLocale, slug),
    getCategoryLocaleSlugs(locale as AppLocale, slug),
  ]);

  const chip = "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors";

  return (
    <LocaleSlugsProvider slugs={localeSlugs ?? { [locale]: slug }}>
      <Navbar />
      <main>
        <Breadcrumbs
          items={[
            { name: tp("home"), href: "/" },
            { name: t("title"), href: "/blog" },
            { name: current.name },
          ]}
        />
        <section className="py-10">
          <Container>
            <span className="eyebrow">{t("categoryEyebrow")}</span>
            <h1 className="mt-4 text-[clamp(30px,5vw,52px)] font-bold tracking-tight text-dark">
              {current.name}
            </h1>

            <div className="mt-8 flex flex-wrap gap-2">
              <Link
                href="/blog"
                className={cn(chip, "border-line bg-white text-ink hover:border-brand-purple")}
              >
                {t("all")}
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={{ pathname: "/blog/kategorie/[slug]", params: { slug: c.slug } }}
                  className={cn(
                    chip,
                    c.slug === slug
                      ? "border-transparent bg-dark text-white"
                      : "border-line bg-white text-ink hover:border-brand-purple",
                  )}
                >
                  {c.name}
                </Link>
              ))}
            </div>

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
    </LocaleSlugsProvider>
  );
}
