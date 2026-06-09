import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Hero } from "@/widgets/hero/Hero";
import { Trust } from "@/widgets/trust/Trust";
import { CaseStudies } from "@/widgets/case-studies/CaseStudies";
import { Services } from "@/widgets/services/Services";
import { Industries } from "@/widgets/industries/Industries";
import { TechStack } from "@/widgets/tech-stack/TechStack";
import { AiReady } from "@/widgets/ai-ready/AiReady";
import { Comparison } from "@/widgets/comparison/Comparison";
import { Process } from "@/widgets/process/Process";
import { Founder } from "@/widgets/founder/Founder";
import { Testimonials } from "@/widgets/testimonials/Testimonials";
import { Pricing } from "@/widgets/pricing/Pricing";
import { Faq } from "@/widgets/faq/Faq";
import { Contact } from "@/widgets/contact/Contact";
import { Footer } from "@/widgets/footer/Footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Trust />
        <CaseStudies />
        <Services />
        <Industries />
        <TechStack />
        <AiReady />
        <Comparison />
        <Process />
        <Founder />
        <Testimonials />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
