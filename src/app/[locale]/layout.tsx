import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import brandIcon from "@/assets/brand/favicon.svg";
import { isAppLocale, routing } from "@/i18n/routing";
import { siteConfig } from "@/shared/config/site";
import { JsonLd } from "@/shared/seo/JsonLd";
import { organizationSchema, personSchema, websiteSchema } from "@/shared/seo/schema";
import { getSeoOverride } from "@/shared/seo/metadata";
import { ogImageUrl } from "@/shared/seo/og";
import { PageViewTracker } from "@/features/analytics/PageViewTracker";
import { AnalyticsConsentBanner } from "@/features/analytics/AnalyticsConsentBanner";
import { GtmInteractionTracker } from "@/features/analytics/GtmInteractionTracker";
import { GtmRouteTracker } from "@/features/analytics/GtmRouteTracker";
import { AttributionCapture } from "@/features/analytics/AttributionCapture";
import { AiAssistantWidget } from "@/widgets/assistant/AiAssistantWidget";
import { CustomCursor } from "@/shared/ui/CustomCursor";
import { getPathname } from "@/i18n/navigation";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#8B5CF6",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: "Meta" });

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, l === routing.defaultLocale ? "/" : `/${l}`]),
  );
  languages["x-default"] = "/";
  const canonical = locale === routing.defaultLocale ? "/" : `/${locale}`;

  const override = await getSeoOverride("/", locale);
  const title = override?.title || t("title");
  const description = override?.description || t("description");
  const ogImage = override?.ogImage || ogImageUrl({ title });

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: title, template: `%s · ${siteConfig.name}` },
    description,
    // Public Search Console ownership token. Next.js renders it in <head>.
    verification: {
      google: "QRjpFG6PznICNn6fTL-ljvDHjYh-qrxSVICP7Jb8lVI",
    },
    alternates: { canonical, languages },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: brandIcon.src, type: "image/svg+xml" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      shortcut: [{ url: "/favicon.ico", sizes: "any" }],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        { url: "/apple-icon.svg", type: "image/svg+xml" },
      ],
      other: [{ rel: "mask-icon", url: "/brand/saaleweb-mark-mono.svg", color: "#111827" }],
    },
    openGraph: {
      title,
      description,
      url: canonical === "/" ? siteConfig.url : `${siteConfig.url}${canonical}`,
      siteName: siteConfig.name,
      locale,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const assistant = await getTranslations({ locale, namespace: "AssistantWidget" });
  const consent = await getTranslations({ locale, namespace: "AnalyticsConsent" });
  const assistantLabels = {
    aria: assistant("aria"),
    badge: assistant("badge"),
    title: assistant("title"),
    subtitle: assistant("subtitle"),
    intro: assistant("intro"),
    placeholder: assistant("placeholder"),
    send: assistant("send"),
    close: assistant("close"),
    open: assistant("open"),
    loading: assistant("loading"),
    error: assistant("error"),
    privacy: assistant("privacy"),
    contact: assistant("contact"),
    whatsapp: assistant("whatsapp"),
    whatsappPrefill: assistant("whatsappPrefill"),
    quickPrompts: assistant.raw("quickPrompts") as string[],
  };
  const contactHref = getPathname({ locale, href: "/kontakt" });
  const privacyHref = getPathname({ locale, href: "/datenschutz" });
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? "";
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
  const analyticsConfigured = gtmId.startsWith("GTM-") && measurementId.startsWith("G-");
  const consentLabels = {
    title: consent("title"),
    text: consent("text"),
    accept: consent("accept"),
    reject: consent("reject"),
    settings: consent("settings"),
    privacy: consent("privacy"),
  };

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      data-scroll-behavior="smooth"
    >
      {/* Next.js loads the optimized GTM scripts after hydration. */}
      {analyticsConfigured ? <GoogleTagManager gtmId={gtmId} /> : null}
      <body className="font-sans">
        <JsonLd data={[organizationSchema(), personSchema(), websiteSchema(locale)]} />
        <PageViewTracker locale={locale} />
        <Suspense fallback={null}>
          <AttributionCapture />
        </Suspense>
        {analyticsConfigured ? (
          <>
            <Suspense fallback={null}>
              <GtmRouteTracker locale={locale} />
            </Suspense>
            <GtmInteractionTracker />
            <AnalyticsConsentBanner labels={consentLabels} privacyHref={privacyHref} />
          </>
        ) : null}
        <CustomCursor />
        {/* next-intl 4: provider auto-inherits messages from i18n/request.ts */}
        <NextIntlClientProvider>
          {children}
          <AiAssistantWidget locale={locale} labels={assistantLabels} contactHref={contactHref} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
