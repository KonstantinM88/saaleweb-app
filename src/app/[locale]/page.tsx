// src/app/[locale]/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Hero } from "@/widgets/hero/Hero";
import { ProofStrip } from "@/widgets/proof-strip/ProofStrip";
import { CaseStudies } from "@/widgets/case-studies/CaseStudies";
import { Pricing } from "@/widgets/pricing/Pricing";
import { OfferOverview } from "@/widgets/offer-overview/OfferOverview";
import { WhySaaleWebSection } from "@/widgets/why-saaleweb/WhySaaleWebSection";
import { AiReady } from "@/widgets/ai-ready/AiReady";
import { Comparison } from "@/widgets/comparison/Comparison";
import { Automation } from "@/widgets/automation/Automation";
import { LocalSeo } from "@/widgets/local-seo/LocalSeo";
import { DirectAnswers } from "@/widgets/direct-answers/DirectAnswers";
import { Founder } from "@/widgets/founder/Founder";
import { Testimonials } from "@/widgets/testimonials/Testimonials";
import { Process } from "@/widgets/process/Process";
import { WebsiteAuditSection } from "@/widgets/website-audit/WebsiteAuditSection";
import { Faq } from "@/widgets/faq/Faq";
import { Contact } from "@/widgets/contact/Contact";
import { MobileCtaBar } from "@/widgets/contact/MobileCtaBar";
import { Footer } from "@/widgets/footer/Footer";
import { isAppLocale } from "@/i18n/routing";
import { siteConfig } from "@/shared/config/site";
import { getContactHref } from "@/shared/lib/contactHref";
import { HomeJsonLd } from "@/shared/seo/HomeJsonLd";

// CMS actions invalidate this route immediately. The daily fallback prevents
// public traffic from repeatedly waking Neon's five-minute autosuspended DB.
export const revalidate = 86_400;

/**
 * Balanced homepage (2026-11-17): early proof/pricing, then relaunch,
 * automation, search visibility and regional evidence before trust and FAQ.
 * Direct answers render once, earlier than the general FAQ. Decorative
 * full-height GrowthWindow/TechStack sections remain available elsewhere.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();

  setRequestLocale(locale);
  const mobileCta = await getTranslations({ locale, namespace: "MobileCta" });

  return (
    <>
      <Navbar />
      <HomeJsonLd locale={locale} />
      <main>
        <Hero />
        <ProofStrip />
        <CaseStudies />
        <Pricing />
        <Comparison />
        <OfferOverview />
        <Automation />
        <AiReady />
        <LocalSeo />
        <DirectAnswers />
        <WhySaaleWebSection />
        <Founder />
        <Testimonials locale={locale} />
        <Process />
        <WebsiteAuditSection />
        <Faq />
        <Contact locale={locale} />
      </main>
      <Footer />
      <MobileCtaBar
        labels={{ consult: mobileCta("consult"), whatsapp: mobileCta("whatsapp") }}
        contactHref={getContactHref(locale)}
        whatsappHref={siteConfig.phone.whatsappUrl}
      />
    </>
  );
}
