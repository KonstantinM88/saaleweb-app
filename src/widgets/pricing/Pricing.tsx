import { getTranslations, getLocale } from "next-intl/server";
import { unstable_cache } from "next/cache";
import type { AppLocale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { HOMEPAGE_CACHE_SECONDS, HOMEPAGE_CACHE_TAGS } from "@/features/homepage/cache";
import { Container } from "@/shared/ui/Container";
import { getContactHref } from "@/shared/lib/contactHref";
import { getPricingLandingCopy } from "./PricingLandingPage";
import { PricingPlans, type PricingPlanView } from "./PricingPlans";

type StaticPackage = {
  name: string;
  sub: string;
  price: string;
  features: string[];
};

const readCachedDbPlans = unstable_cache(
  async (locale: AppLocale): Promise<PricingPlanView[]> => {
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
        features: tr.features,
        featured: row.featured,
      };
    });
  },
  ["homepage-pricing-plans"],
  {
    revalidate: HOMEPAGE_CACHE_SECONDS,
    tags: [HOMEPAGE_CACHE_TAGS.pricing],
  },
);

async function getDbPlans(locale: AppLocale): Promise<PricingPlanView[]> {
  try {
    return await readCachedDbPlans(locale);
  } catch {
    return [];
  }
}

export async function Pricing() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations({ locale, namespace: "Pricing" });
  const fallback: PricingPlanView[] = (t.raw("packages") as StaticPackage[]).map((plan, index) => ({
    ...plan,
    featured: index === 1,
  }));
  const dbPlans = await getDbPlans(locale);
  const landingCopy = getPricingLandingCopy(locale);
  const individualExamples = landingCopy.packageCopies.individual.examples ?? [];
  const plans = (dbPlans.length > 0 ? dbPlans : fallback).map((plan, index, allPlans) =>
    index === allPlans.length - 1
      ? {
          ...plan,
          examplesTitle: landingCopy.packageCopies.individual.examplesTitle,
          examples: individualExamples,
        }
      : plan,
  );
  const contactHref = getContactHref(locale);

  return (
    <section id="pricing" className="py-16 md:py-24">
      <Container>
        <div className="mx-auto mb-14 max-w-[680px] text-center">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2 className="mt-4 text-[clamp(28px,4vw,46px)] font-bold tracking-tight text-dark">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-[clamp(16px,1.6vw,19px)] text-muted">
            {t("lead")}
          </p>
          <p className="mx-auto mt-3 max-w-[560px] text-[14px] font-semibold text-ink">
            {t("trustLine")}
          </p>
        </div>
        <PricingPlans
          plans={plans}
          popularLabel={t("popular")}
          buttonLabel={t("button")}
          contactHref={contactHref}
        />
      </Container>
    </section>
  );
}
