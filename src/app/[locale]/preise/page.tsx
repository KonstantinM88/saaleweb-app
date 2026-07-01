import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { JsonLd } from "@/shared/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema, offerCatalogSchema, webPageSchema } from "@/shared/seo/schema";
import { buildMetadata } from "@/shared/seo/metadata";
import { getHomeHref } from "@/shared/lib/localizedPath";
import {
  getPricingLandingCopy,
  getPricingOfferItems,
  PricingLandingPage,
  priceToMinPrice,
} from "@/widgets/pricing/PricingLandingPage";
import type { PricingPlanView } from "@/widgets/pricing/PricingPlans";

export const revalidate = 300;

type Params = { locale: string };
type StaticPkg = { name: string; sub: string; price: string; features: string[] };

const fallbackPrices: Record<AppLocale, { starter: string; business: string }> = {
  de: { starter: "ab 990 €", business: "ab 1.990 €" },
  en: { starter: "from €990", business: "from €1,990" },
  ru: { starter: "от 990 €", business: "от 1 990 €" },
};

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

function getPackagePrice(
  plans: PricingPlanView[],
  match: string[],
  fallbackIndex: number,
  fallback: string,
) {
  const byName = plans.find((plan) => {
    const name = plan.name.toLowerCase();
    return match.some((term) => name.includes(term));
  });
  return byName?.price ?? plans[fallbackIndex]?.price ?? fallback;
}

function getDynamicPrices(locale: AppLocale, plans: PricingPlanView[], fallback: PricingPlanView[]) {
  const candidates = plans.length > 0 ? plans : fallback;
  const starterFallback =
    getPackagePrice(fallback, ["starter"], 0, fallbackPrices[locale].starter) || fallbackPrices[locale].starter;
  const businessFallback =
    getPackagePrice(fallback, ["business"], 1, fallbackPrices[locale].business) || fallbackPrices[locale].business;

  return {
    starterPrice: getPackagePrice(candidates, ["starter"], 1, starterFallback),
    businessPrice: getPackagePrice(candidates, ["business"], 2, businessFallback),
  };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const appLocale = locale as AppLocale;
  const copy = getPricingLandingCopy(appLocale);
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ locale: l, href: "/preise" })]),
  );
  return buildMetadata({
    path: "/preise",
    locale,
    title: copy.metaTitle,
    description: copy.metaDescription,
    eyebrow: copy.eyebrow,
    languages,
  });
}

export default async function PricingPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const appLocale = locale as AppLocale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Pricing" });
  const th = await getTranslations({ locale, namespace: "Pages" });
  const fallback: PricingPlanView[] = (t.raw("packages") as StaticPkg[]).map((p, i) => ({
    ...p,
    featured: i === 1,
  }));
  const db = await getPlans(appLocale);
  const { starterPrice, businessPrice } = getDynamicPrices(appLocale, db, fallback);
  const copy = getPricingLandingCopy(appLocale);
  const path = getPathname({ locale: appLocale, href: "/preise" });
  const homePath = getHomeHref(appLocale);
  const offers = getPricingOfferItems(appLocale, starterPrice, businessPrice).map((offer) => ({
    ...offer,
    url: path,
    minPrice: priceToMinPrice(offer.price),
  }));

  return (
    <>
      <Navbar />
      <JsonLd
        data={[
          webPageSchema({
            name: copy.metaTitle,
            description: copy.metaDescription,
            path,
            locale,
            about: "Website pricing, SEO, GEO, AIO, WordPress, React and Next.js services",
          }),
          breadcrumbSchema([
            { name: th("home"), path: homePath },
            { name: copy.eyebrow, path },
          ]),
          faqPageSchema(copy.faq),
          offerCatalogSchema({
            name: copy.packagesTitle,
            description: copy.packagesLead,
            path,
            locale,
            offers,
          }),
        ]}
      />
      <main>
        <Breadcrumbs items={[{ name: th("home"), href: "/" }, { name: copy.eyebrow }]} />
        <PricingLandingPage locale={appLocale} starterPrice={starterPrice} businessPrice={businessPrice} />
      </main>
      <Footer />
    </>
  );
}
