import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { cities, getCity } from "@/shared/config/cities";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { CtaBanner } from "@/shared/ui/CtaBanner";
import { JsonLd } from "@/shared/seo/JsonLd";
import { localBusinessSchema, breadcrumbSchema } from "@/shared/seo/schema";

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    cities.map((c) => ({ locale, slug: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const city = getCity(slug);
  if (!city || !hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Cities" });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [
      l,
      `${l === routing.defaultLocale ? "" : `/${l}`}/standorte/${slug}`,
    ]),
  );
  return {
    title: t("metaTitle", { city: city.name }),
    description: t("lead", { city: city.name }),
    alternates: { languages },
  };
}

export default async function CityPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const city = getCity(slug);
  if (!city) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Cities" });
  const tp = await getTranslations({ locale, namespace: "Pages" });
  const path = `${locale === routing.defaultLocale ? "" : `/${locale}`}/standorte/${slug}`;

  return (
    <>
      <Navbar />
      <JsonLd
        data={[
          localBusinessSchema({ areaServed: city.name }),
          breadcrumbSchema([
            { name: tp("home"), path: locale === routing.defaultLocale ? "/" : `/${locale}` },
            { name: city.name, path },
          ]),
        ]}
      />
      <main>
        <Breadcrumbs
          items={[
            { name: tp("home"), href: "/" },
            { name: tp("locationsLabel") },
            { name: city.name },
          ]}
        />
        <section className="py-12">
          <Container className="max-w-3xl">
            <span className="eyebrow">{t("eyebrow")}</span>
            <h1 className="mt-4 text-[clamp(30px,5vw,52px)] font-bold leading-tight tracking-tight text-dark">
              {t("h1", { city: city.name })}
            </h1>
            <p className="mt-5 text-xl text-muted">{t("lead", { city: city.name })}</p>
            <p className="mt-6 text-[16px] leading-relaxed text-ink">
              {t("body", { city: city.name })}
            </p>
          </Container>
        </section>
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
