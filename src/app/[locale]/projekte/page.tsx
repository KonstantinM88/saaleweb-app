import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPathname, Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { CtaBanner } from "@/shared/ui/CtaBanner";
import { JsonLd } from "@/shared/seo/JsonLd";
import { breadcrumbSchema } from "@/shared/seo/schema";
import { buildMetadata } from "@/shared/seo/metadata";
import { cn } from "@/shared/lib/cn";

export const revalidate = 300;

type Params = { locale: string };
type Card = {
  slug: string;
  title: string;
  tag: string;
  result: string;
  cover: { image: string | null; color: string | null };
};

const covers = [
  "bg-brand",
  "bg-gradient-to-br from-sky-500 to-brand-purple",
  "bg-gradient-to-br from-amber-500 to-brand-pink",
];

async function getItems(locale: AppLocale): Promise<Card[]> {
  try {
    const rows = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      include: {
        translations: { where: { locale }, take: 1 },
        category: { include: { translations: { where: { locale }, take: 1 } } },
        media: { orderBy: { order: "asc" }, take: 1 },
      },
    });
    return rows.flatMap((row, i) => {
      const tr = row.translations[0];
      if (!tr) return [];
      return {
        slug: tr.slug,
        title: tr.title,
        tag: row.category?.translations?.[0]?.name ?? "",
        result: row.resultValue ?? "",
        cover: { image: row.media?.[0]?.url ?? null, color: row.coverColor ?? covers[i % covers.length] },
      } as Card;
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "CaseStudies" });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ locale: l, href: "/projekte" })]),
  );
  return buildMetadata({
    path: "/projekte",
    locale,
    title: t("title"),
    description: t("lead"),
    eyebrow: t("eyebrow"),
    languages,
  });
}

export default async function ProjectsIndexPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "CaseStudies" });
  const tp = await getTranslations({ locale, namespace: "Projects" });
  const th = await getTranslations({ locale, namespace: "Pages" });
  const items = await getItems(locale);
  const homePath = locale === routing.defaultLocale ? "/" : `/${locale}`;

  return (
    <>
      <Navbar />
      <JsonLd
        data={breadcrumbSchema([
          { name: th("home"), path: homePath },
          { name: tp("label"), path: getPathname({ locale, href: "/projekte" }) },
        ])}
      />
      <main>
        <Breadcrumbs items={[{ name: th("home"), href: "/" }, { name: tp("label") }]} />
        <section className="py-12">
          <Container>
            <span className="eyebrow">{t("eyebrow")}</span>
            <h1 className="mt-4 text-[clamp(32px,5vw,56px)] font-bold tracking-tight text-dark">
              {t("title")}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">{t("lead")}</p>

            {items.length === 0 ? (
              <p className="mt-12 rounded-2xl border border-dashed border-line bg-surface p-10 text-center text-muted">
                {tp("empty")}
              </p>
            ) : (
              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                {items.map((item) => {
                  const hex = item.cover.color?.startsWith("#");
                  return (
                    <Link
                      key={item.slug}
                      href={{ pathname: "/projekte/[slug]", params: { slug: item.slug } }}
                      className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white transition-all hover:-translate-y-1.5 hover:border-transparent hover:shadow-lift"
                    >
                      <div
                        className={cn(
                          "relative h-[160px]",
                          item.cover.image ? "bg-dark" : !hex ? item.cover.color ?? "bg-brand" : undefined,
                        )}
                        style={!item.cover.image && hex ? { background: item.cover.color ?? undefined } : undefined}
                      >
                        {item.cover.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.cover.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
                        ) : (
                          <span className="absolute bottom-3.5 left-4 text-xl font-bold tracking-tight text-white">
                            {item.title}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-[18px]">
                        {item.tag && (
                          <span className="mb-2.5 w-fit rounded-md bg-brand-soft px-2 py-1 font-mono text-[11px] font-semibold text-brand-purple">
                            {item.tag}
                          </span>
                        )}
                        <h2 className="text-lg font-bold text-dark group-hover:text-brand-purple">{item.title}</h2>
                        {item.result && (
                          <b className="mt-auto pt-3 text-[22px] text-success">{item.result}</b>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Container>
        </section>
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
