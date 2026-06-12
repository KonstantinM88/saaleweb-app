import { getTranslations, getLocale } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { Container } from "@/shared/ui/Container";
import { PricingPlans, type PricingPlanView } from "./PricingPlans";

type StaticPackage = {
  name: string;
  sub: string;
  price: string;
  features: string[];
};

async function getDbPlans(locale: AppLocale): Promise<PricingPlanView[]> {
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
        features: tr.features,
        featured: row.featured,
      };
    });
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
  const plans = dbPlans.length > 0 ? dbPlans : fallback;
  const contactHref = locale === routing.defaultLocale ? "/#contact" : `/${locale}#contact`;

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
