import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { JsonLd } from "@/shared/seo/JsonLd";
import { breadcrumbSchema } from "@/shared/seo/schema";
import { buildMetadata } from "@/shared/seo/metadata";
import { LegalPage } from "@/widgets/legal/LegalPage";
import { DATENSCHUTZ_CONTENT } from "@/widgets/legal/legalContent";

export const revalidate = 3600;

type Params = { locale: string };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const content = DATENSCHUTZ_CONTENT[locale as AppLocale];
  const languages = Object.fromEntries(
    routing.locales.map((targetLocale) => [
      targetLocale,
      getPathname({ locale: targetLocale, href: "/datenschutz" }),
    ]),
  );

  return buildMetadata({
    path: "/datenschutz",
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
    eyebrow: content.eyebrow,
    languages,
  });
}

export default async function DatenschutzPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const content = DATENSCHUTZ_CONTENT[locale as AppLocale];
  const pages = await getTranslations({ locale, namespace: "Pages" });
  const homePath = getPathname({ locale: locale as AppLocale, href: "/" });
  const pagePath = getPathname({ locale: locale as AppLocale, href: "/datenschutz" });

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: pages("home"), path: homePath },
          { name: content.title, path: pagePath },
        ])}
      />
      <LegalPage content={content} homeLabel={pages("home")} />
    </>
  );
}
