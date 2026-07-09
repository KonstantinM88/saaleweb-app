import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { buildMetadata } from "@/shared/seo/metadata";
import { serviceSchema, breadcrumbSchema, faqPageSchema } from "@/shared/seo/schema";
import { JsonLd } from "@/shared/seo/JsonLd";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { AuditLandingPage } from "@/widgets/audit-landing/AuditLandingPage";
import { getAuditLandingCopy } from "@/widgets/audit-landing/auditContent";

type Params = { locale: string };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function localizedLanguages() {
  return Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ locale: l, href: "/audit" })]),
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const copy = getAuditLandingCopy(locale as AppLocale);

  return buildMetadata({
    path: "/audit",
    locale,
    title: copy.metaTitle,
    description: copy.metaDescription,
    eyebrow: copy.eyebrow,
    languages: localizedLanguages(),
  });
}

export default async function AuditPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const appLocale = locale as AppLocale;
  const copy = getAuditLandingCopy(appLocale);
  const tp = await getTranslations({ locale, namespace: "Pages" });

  const path = getPathname({ locale: appLocale, href: "/audit" });
  const homePath = getPathname({ locale: appLocale, href: "/" });

  return (
    <>
      <Navbar />
      <JsonLd
        data={[
          serviceSchema({ name: copy.h1, description: copy.metaDescription, path, locale }),
          breadcrumbSchema([
            { name: tp("home"), path: homePath },
            { name: copy.eyebrow, path },
          ]),
          faqPageSchema(copy.faq),
        ]}
      />
      <AuditLandingPage copy={copy} locale={locale} />
      <Footer />
    </>
  );
}
