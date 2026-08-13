import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { MapPin, ArrowRight } from "lucide-react";
import { routing } from "@/i18n/routing";
import { getPathname, Link } from "@/i18n/navigation";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { Reveal } from "@/shared/ui/Reveal";
import { CtaBanner } from "@/shared/ui/CtaBanner";
import { JsonLd } from "@/shared/seo/JsonLd";
import {
  breadcrumbSchema,
  collectionPageSchema,
  itemListSchema,
  localBusinessSchema,
  faqPageSchema,
} from "@/shared/seo/schema";
import { buildMetadata } from "@/shared/seo/metadata";
import { cities } from "@/shared/config/cities";
import { getPhase4LocationLinks } from "@/widgets/seo-landing/phase4Content";

/**
 * Hub for the six city landing pages.
 *
 * Until now the city pages were only reachable from the footer, which is the
 * weakest link position on the document. A hub gives them a real parent, puts
 * /standorte into the sitemap and the main navigation, and gives Google a
 * single page that answers "where does SaaleWeb work".
 */

type Params = { locale: string };

export const revalidate = 86_400;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "LocationsHub" });
  const path = getPathname({ locale, href: "/standorte" });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ locale: l, href: "/standorte" })]),
  );

  return buildMetadata({
    path: "/standorte",
    canonical: path,
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    eyebrow: t("eyebrow"),
    languages,
  });
}

export default async function LocationsHubPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "LocationsHub" });
  const tp = await getTranslations({ locale, namespace: "Pages" });
  const path = getPathname({ locale, href: "/standorte" });
  const links = getPhase4LocationLinks(locale);
  const faq = t.raw("faq") as { q: string; a: string }[];

  const itemsForSchema = cities.map((city) => ({
    name: city.name,
    path: getPathname({
      locale,
      href: { pathname: "/standorte/[slug]", params: { slug: city.slug } },
    }),
  }));

  return (
    <>
      <Navbar />
      <JsonLd
        data={[
          collectionPageSchema({
            name: t("metaTitle"),
            description: t("metaDescription"),
            path,
            locale,
          }),
          itemListSchema(itemsForSchema),
          localBusinessSchema(),
          breadcrumbSchema([
            { name: tp("home"), path: getPathname({ locale, href: "/" }) },
            { name: t("eyebrow"), path },
          ]),
          faqPageSchema(faq),
        ]}
      />

      <main>
        <Breadcrumbs items={[{ name: tp("home"), href: "/" }, { name: t("eyebrow") }]} />

        <section className="border-b border-line bg-surface py-12 md:py-20">
          <Container>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-gray-700">
                <MapPin size={14} aria-hidden className="text-brand-purple" />
                {t("eyebrow")}
              </span>
              <h1 className="mt-5 break-words text-[clamp(32px,4.4vw,50px)] font-bold leading-[1.1] tracking-tight text-dark">
                {t("title")}
              </h1>
              {(t.raw("lead") as string[]).map((paragraph, index) => (
                <p key={index} className="mt-4 max-w-2xl break-words text-[16.5px] text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-14 md:py-20">
          <Container>
            <h2 className="mb-8 break-words text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-dark">
              {t("citiesTitle")}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {links.map((link, index) => {
                const citySlug = link.href.split("/").filter(Boolean).at(-1);
                const city = cities.find((item) => item.slug === citySlug);
                if (!city) return null;
                return (
                  <Reveal key={city.slug} delay={index * 50} className="h-full">
                    <Link
                      href={{ pathname: "/standorte/[slug]", params: { slug: city.slug } }}
                      className="group flex h-full min-w-0 flex-col rounded-2xl border border-line bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                    >
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand-purple">
                        <MapPin size={20} aria-hidden />
                      </span>
                      <h3 className="mt-5 break-words text-[19px] font-bold text-dark">
                        {link.label}
                      </h3>
                      <p className="mt-2 min-w-0 flex-1 break-words text-[14.5px] leading-relaxed text-muted">
                        {link.description}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-extrabold text-brand-purple">
                        {t("cityCta")}
                        <ArrowRight
                          size={16}
                          aria-hidden
                          className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                        />
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>

        <section className="border-y border-line bg-surface py-14 md:py-20">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="min-w-0">
                <h2 className="break-words text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-dark">
                  {t("areaTitle")}
                </h2>
                <p className="mt-4 break-words text-[16px] leading-relaxed text-muted">
                  {t("areaText")}
                </p>
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                {(t.raw("areaPoints") as { title: string; text: string }[]).map((point, index) => (
                  <div
                    key={index}
                    className="min-w-0 rounded-2xl border border-line bg-white p-5"
                  >
                    <h3 className="break-words text-[15.5px] font-bold text-dark">{point.title}</h3>
                    <p className="mt-2 break-words text-[14px] leading-relaxed text-muted">
                      {point.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section className="py-14 md:py-20">
          <Container>
            <h2 className="mb-8 break-words text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-dark">
              {t("faqTitle")}
            </h2>
            <div className="grid gap-3">
              {faq.map((item, index) => (
                <details
                  key={index}
                  className="group min-w-0 rounded-2xl border border-line bg-white p-5 open:border-brand-purple"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 break-words text-[16px] font-bold text-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple">
                    {item.q}
                    <span
                      aria-hidden
                      className="mt-1 shrink-0 text-brand-purple transition-transform group-open:rotate-45 motion-reduce:transition-none"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 break-words text-[15px] leading-relaxed text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
