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

export const revalidate = 300;

type Params = { locale: string };
type Item = { name: string; slug: string; excerpt: string | null };

async function getItems(locale: AppLocale): Promise<Item[]> {
  try {
    return (await prisma.industryTranslation.findMany({
      where: { locale, industry: { published: true } },
      orderBy: { industry: { order: "asc" } },
      select: { name: true, slug: true, excerpt: true },
    })) as Item[];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Industries" });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ locale: l, href: "/branchen" })]),
  );
  return { title: t("title"), description: t("lead"), alternates: { languages } };
}

export default async function IndustriesIndexPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Industries" });
  const tp = await getTranslations({ locale, namespace: "Pages" });
  const items = await getItems(locale);
  const homePath = locale === routing.defaultLocale ? "/" : `/${locale}`;

  return (
    <>
      <Navbar />
      <JsonLd
        data={breadcrumbSchema([
          { name: tp("home"), path: homePath },
          { name: tp("industriesLabel"), path: getPathname({ locale, href: "/branchen" }) },
        ])}
      />
      <main>
        <Breadcrumbs items={[{ name: tp("home"), href: "/" }, { name: tp("industriesLabel") }]} />
        <section className="py-12">
          <Container>
            <span className="eyebrow">{t("eyebrow")}</span>
            <h1 className="mt-4 text-[clamp(32px,5vw,56px)] font-bold tracking-tight text-dark">
              {t("title")}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">{t("lead")}</p>

            {items.length === 0 ? (
              <p className="mt-12 rounded-2xl border border-dashed border-line bg-surface p-10 text-center text-muted">
                {tp("industriesLabel")} —
              </p>
            ) : (
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((s) => (
                  <Link
                    key={s.slug}
                    href={{ pathname: "/branchen/[slug]", params: { slug: s.slug } }}
                    className="group flex h-full flex-col rounded-[18px] border border-line bg-white p-6 transition-all hover:-translate-y-1.5 hover:border-transparent hover:shadow-lift"
                  >
                    <h2 className="text-lg font-bold text-dark group-hover:text-brand-purple">
                      {s.name}
                    </h2>
                    {s.excerpt && <p className="mt-2 flex-1 text-sm text-muted">{s.excerpt}</p>}
                    <span className="mt-4 text-sm font-semibold text-brand-purple">→</span>
                  </Link>
                ))}
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
