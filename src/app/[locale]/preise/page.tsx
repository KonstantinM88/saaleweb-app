import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { CtaBanner } from "@/shared/ui/CtaBanner";
import { JsonLd } from "@/shared/seo/JsonLd";
import { breadcrumbSchema } from "@/shared/seo/schema";
import { buildMetadata } from "@/shared/seo/metadata";
import { getContactHref } from "@/shared/lib/contactHref";
import { PricingPlans, type PricingPlanView } from "@/widgets/pricing/PricingPlans";

export const revalidate = 300;

type Params = { locale: string };
type StaticPkg = { name: string; sub: string; price: string; features: string[] };

async function getPlans(locale: AppLocale): Promise<PricingPlanView[]> {
  try {
    const rows = await prisma.pricingPlan.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: { translations: { where: { locale }, take: 1 } },
    });
    return rows.flatMap((row) => {
      const tr = row.translations[0];
      if (!tr) return [];
      return {
        name: tr.name,
        sub: tr.sub ?? "",
        price: tr.price,
        features: (tr.features ?? []) as string[],
        featured: row.featured,
      };
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Pricing" });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ locale: l, href: "/preise" })]),
  );
  return buildMetadata({
    path: "/preise",
    locale,
    title: t("title"),
    description: t("lead"),
    eyebrow: t("eyebrow"),
    languages,
  });
}

export default async function PricingPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Pricing" });
  const th = await getTranslations({ locale, namespace: "Pages" });
  const fallback: PricingPlanView[] = (t.raw("packages") as StaticPkg[]).map((p, i) => ({
    ...p,
    featured: i === 1,
  }));
  const db = await getPlans(locale);
  const plans = db.length > 0 ? db : fallback;
  const homePath = locale === routing.defaultLocale ? "/" : `/${locale}`;
  const contactHref = getContactHref(locale);

  return (
    <>
      <Navbar />
      <JsonLd
        data={breadcrumbSchema([
          { name: th("home"), path: homePath },
          { name: t("eyebrow"), path: getPathname({ locale, href: "/preise" }) },
        ])}
      />
      <main>
        <Breadcrumbs items={[{ name: th("home"), href: "/" }, { name: t("eyebrow") }]} />
        <section className="py-12">
          <Container>
            <div className="mx-auto mb-12 max-w-[680px] text-center">
              <span className="eyebrow">{t("eyebrow")}</span>
              <h1 className="mt-4 text-[clamp(32px,5vw,56px)] font-bold tracking-tight text-dark">
                {t("title")}
              </h1>
              <p className="mx-auto mt-4 max-w-[620px] text-lg text-muted">{t("lead")}</p>
            </div>
            <PricingPlans
              plans={plans}
              popularLabel={t("popular")}
              buttonLabel={t("button")}
              contactHref={contactHref}
            />
          </Container>
        </section>
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
