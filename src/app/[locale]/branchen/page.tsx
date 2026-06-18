import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { ArrowRight } from "lucide-react";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { Reveal } from "@/shared/ui/Reveal";
import { Magnetic } from "@/shared/ui/Magnetic";
import { TrustMetrics } from "@/shared/ui/TrustMetrics";
import { CtaBanner } from "@/shared/ui/CtaBanner";
import { JsonLd } from "@/shared/seo/JsonLd";
import { breadcrumbSchema } from "@/shared/seo/schema";
import { buildMetadata } from "@/shared/seo/metadata";
import { IndustryCard, type IndustryCardData } from "@/widgets/industries-page/IndustryCard";

export const revalidate = 300;

type Params = { locale: string };

async function getItems(locale: AppLocale): Promise<IndustryCardData[]> {
  try {
    const rows = (await prisma.industryTranslation.findMany({
      where: { locale, industry: { published: true } },
      orderBy: { industry: { order: "asc" } },
      select: {
        name: true,
        slug: true,
        excerpt: true,
        industry: {
          select: {
            coverImage: true,
            translations: {
              where: { locale: routing.defaultLocale },
              select: { slug: true },
              take: 1,
            },
          },
        },
      },
    })) as {
      name: string;
      slug: string;
      excerpt: string | null;
      industry: {
        coverImage: string | null;
        translations: { slug: string }[];
      };
    }[];
    return rows.map((row) => ({
      name: row.name,
      slug: row.slug,
      canonicalSlug: row.industry.translations[0]?.slug ?? row.slug,
      excerpt: row.excerpt,
      coverImage: row.industry.coverImage,
    }));
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
  return buildMetadata({
    path: "/branchen",
    locale,
    title: t("title"),
    description: t("lead"),
    eyebrow: t("eyebrow"),
    languages,
  });
}

export default async function IndustriesIndexPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Industries" });
  const ti = await getTranslations({ locale, namespace: "IndustriesPage" });
  const tp = await getTranslations({ locale, namespace: "Pages" });
  const items = await getItems(locale);
  const homePath = locale === routing.defaultLocale ? "/" : `/${locale}`;
  const contactHref = locale === routing.defaultLocale ? "/#contact" : `/${locale}#contact`;

  const trust = [
    { value: ti("trust1Value"), label: ti("trust1Label") },
    { value: ti("trust2Value"), label: ti("trust2Label") },
    { value: ti("trust3Value"), label: ti("trust3Label") },
    { value: ti("trust4Value"), label: ti("trust4Label") },
  ];

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

        {/* HERO */}
        <section className="relative overflow-hidden pb-10 pt-6 md:pb-16 md:pt-10">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(620px 360px at 82% 0%, rgba(139,92,246,0.10), transparent 60%), radial-gradient(560px 320px at 8% 4%, rgba(255,79,163,0.08), transparent 58%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(17,24,39,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,24,39,0.05) 1px, transparent 1px)",
                backgroundSize: "54px 54px",
                maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 25%, transparent 78%)",
                WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 25%, transparent 78%)",
              }}
            />
          </div>
          <Container>
            <div className="hero-stagger max-w-3xl">
              <span className="eyebrow">{t("eyebrow")}</span>
              <h1 className="mt-4 text-[clamp(32px,5.2vw,58px)] font-bold leading-[1.08] tracking-tight text-dark">
                {t("title")}
              </h1>
              <p className="mt-5 max-w-2xl text-[clamp(16px,1.7vw,20px)] text-muted">{t("lead")}</p>
              <div className="mt-8">
                <Magnetic>
                  <a
                    href={contactHref}
                    className="btn-shine group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,79,163,0.55)] transition-all hover:-translate-y-0.5"
                  >
                    {ti("detail.ctaButton")}
                    <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </a>
                </Magnetic>
              </div>
            </div>

            <Reveal delay={120}>
              <div className="mt-12">
                <TrustMetrics items={trust} />
              </div>
            </Reveal>
          </Container>
        </section>

        {/* GRID */}
        <section className="py-16 md:py-24">
          <Container>
            {items.length === 0 ? (
              <p className="mx-auto max-w-md rounded-2xl border border-dashed border-line bg-surface p-10 text-center text-muted">
                {tp("industriesLabel")} —
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, i) => (
                  <IndustryCard key={item.slug} item={item} index={i} moreLabel={ti("explore")} />
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
