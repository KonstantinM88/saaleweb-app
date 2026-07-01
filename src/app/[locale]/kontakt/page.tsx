import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Code2,
  Euro,
  Handshake,
  Laptop,
  LifeBuoy,
  Mail,
  MessageCircle,
  MonitorSmartphone,
  Phone,
  Rocket,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { routing } from "@/i18n/routing";
import { Link, getPathname } from "@/i18n/navigation";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { ContactPageForm } from "@/widgets/contact/ContactPageForm";
import { FaqAccordion, type QA } from "@/widgets/faq/FaqAccordion";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { Reveal } from "@/shared/ui/Reveal";
import { Magnetic } from "@/shared/ui/Magnetic";
import { BrandText } from "@/shared/ui/BrandText";
import { JsonLd } from "@/shared/seo/JsonLd";
import {
  breadcrumbSchema,
  contactPageSchema,
  faqPageSchema,
  localBusinessSchema,
  organizationSchema,
} from "@/shared/seo/schema";
import { buildMetadata } from "@/shared/seo/metadata";
import { siteConfig } from "@/shared/config/site";
import { getHomeHref } from "@/shared/lib/localizedPath";

export const revalidate = 300;

type Params = { locale: string };
type TextCard = { title: string; text: string };
type Metric = { value: string; label: string; text: string };
type VisualLabels = {
  alt: string;
  workspace: string;
  laptopTitle: string;
  laptopLead: string;
  phoneTitle: string;
  cardSeo: string;
  cardAi: string;
  cardSpeed: string;
  trafficLabel: string;
  leadsLabel: string;
};

const timelineIcons: LucideIcon[] = [MessageCircle, CalendarCheck, Target, Sparkles, Code2, Rocket];
const whyIcons: LucideIcon[] = [MessageCircle, Users, Euro, LifeBuoy];
const metricIcons: LucideIcon[] = [Building2, Zap, Search, Bot];
const expectationIcons: LucideIcon[] = [Clock3, CalendarCheck, Handshake, Euro, ShieldCheck, Sparkles];

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "ContactPage" });
  const languages = Object.fromEntries(
    routing.locales.map((targetLocale) => [
      targetLocale,
      getPathname({ locale: targetLocale, href: "/kontakt" }),
    ]),
  );

  return buildMetadata({
    path: "/kontakt",
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    eyebrow: t("heroEyebrow"),
    languages,
  });
}

export default async function ContactPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "ContactPage" });
  const pages = await getTranslations({ locale, namespace: "Pages" });

  const contactPath = getPathname({ locale, href: "/kontakt" });
  const homePath = getHomeHref(locale);
  const timeline = t.raw("timeline") as TextCard[];
  const why = t.raw("why") as TextCard[];
  const expectations = t.raw("expectations") as string[];
  const metrics = t.raw("metrics") as Metric[];
  const logos = t.raw("logos") as string[];
  const localSeoParagraphs = t.raw("localSeoParagraphs") as string[];
  const aiParagraphs = t.raw("aiParagraphs") as string[];
  const aiPlatforms = t.raw("aiPlatforms") as string[];
  const faq = t.raw("faq") as QA[];
  const visual: VisualLabels = {
    alt: t("visualAlt"),
    workspace: t("visualWorkspace"),
    laptopTitle: t("visualLaptopTitle"),
    laptopLead: t("visualLaptopLead"),
    phoneTitle: t("visualPhoneTitle"),
    cardSeo: t("visualCardSeo"),
    cardAi: t("visualCardAi"),
    cardSpeed: t("visualCardSpeed"),
    trafficLabel: t("visualTrafficLabel"),
    leadsLabel: t("visualLeadsLabel"),
  };

  return (
    <>
      <Navbar />
      <JsonLd
        data={[
          organizationSchema(),
          localBusinessSchema(),
          contactPageSchema({
            name: t("label"),
            description: t("metaDescription"),
            path: contactPath,
            locale,
          }),
          breadcrumbSchema([
            { name: pages("home"), path: homePath },
            { name: t("label"), path: contactPath },
          ]),
          faqPageSchema(faq),
        ]}
      />

      <main>
        <Breadcrumbs items={[{ name: pages("home"), href: "/" }, { name: t("label") }]} />

        <section className="relative overflow-hidden pb-14 pt-6 md:pb-24 md:pt-10">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(720px 420px at 86% 8%, rgba(139,92,246,0.16), transparent 60%), radial-gradient(640px 360px at 8% 12%, rgba(255,79,163,0.12), transparent 58%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-45"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(17,24,39,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,24,39,0.05) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
                maskImage: "radial-gradient(ellipse 82% 66% at 50% 0%, #000 22%, transparent 78%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 82% 66% at 50% 0%, #000 22%, transparent 78%)",
              }}
            />
          </div>

          <Container>
            <div className="grid items-center gap-11 lg:grid-cols-[0.98fr_1.02fr] lg:gap-14">
              <div className="hero-stagger">
                <span className="eyebrow">{t("heroEyebrow")}</span>
                <h1 className="mt-4 text-[clamp(38px,5.4vw,66px)] font-bold leading-[1.04] tracking-tight text-dark">
                  {t("heroTitle")}
                </h1>
                <p className="mt-5 max-w-2xl text-[clamp(16px,1.65vw,20px)] leading-relaxed text-muted">
                  <BrandText text={t("heroLead")} />
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Magnetic>
                    <a
                      href="#contact"
                      className="btn-shine group inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_16px_34px_-18px_rgba(139,92,246,0.95)] transition-all hover:-translate-y-0.5"
                    >
                      {t("primaryCta")}
                      <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
                    </a>
                  </Magnetic>
                  <Magnetic>
                    <Link
                      href="/projekte"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-line bg-white px-6 py-3.5 text-[15px] font-semibold text-dark shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-purple hover:text-brand-purple"
                    >
                      {t("secondaryCta")}
                    </Link>
                  </Magnetic>
                </div>

                <p className="mt-5 flex items-center gap-2 text-[13.5px] font-medium text-muted">
                  <CheckCircle2 size={16} className="text-emerald-700" aria-hidden />
                  {t("responseNote")}
                </p>
              </div>

              <Reveal delay={100} direction="zoom">
                <ContactWorkspaceVisual labels={visual} />
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="contact-process">
          <Container>
            <Reveal className="mx-auto mb-12 max-w-[760px] text-center">
              <span className="eyebrow">{t("timelineEyebrow")}</span>
              <h2 id="contact-process" className="mt-4 text-[clamp(29px,4vw,48px)] font-bold tracking-tight text-dark">
                {t("timelineTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-[650px] text-[clamp(16px,1.55vw,19px)] leading-relaxed text-muted">
                <BrandText text={t("timelineLead")} />
              </p>
            </Reveal>

            <div className="relative">
              <div
                aria-hidden
                className="absolute left-[8%] right-[8%] top-[41px] hidden h-px bg-gradient-to-r from-brand-pink/30 via-brand-purple/70 to-brand-pink/30 lg:block"
              />
              <ol className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-6">
                {timeline.map((item, index) => {
                  const Icon = timelineIcons[index] ?? CheckCircle2;
                  return (
                    <Reveal key={item.title} delay={index * 70}>
                      <li className="group h-full rounded-[24px] border border-line bg-white p-5 shadow-[0_18px_48px_-38px_rgba(17,24,39,0.45)] transition hover:-translate-y-1 hover:border-brand-purple/35 hover:shadow-[0_28px_62px_-42px_rgba(139,92,246,0.65)]">
                        <div className="relative mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#6D28D9] shadow-[0_18px_36px_-24px_rgba(139,92,246,0.75)] ring-1 ring-line transition group-hover:bg-brand group-hover:text-white">
                          <Icon size={22} aria-hidden />
                          <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-dark font-mono text-[11px] font-bold text-white">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="text-base font-bold tracking-tight text-dark">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                      </li>
                    </Reveal>
                  );
                })}
              </ol>
            </div>
          </Container>
        </section>

        <section className="bg-surface py-16 md:py-24" aria-labelledby="why-saaleweb-contact">
          <Container>
            <Reveal className="mx-auto mb-11 max-w-[760px] text-center">
              <span className="eyebrow">{t("whyEyebrow")}</span>
              <h2 id="why-saaleweb-contact" className="mt-4 text-[clamp(29px,4vw,48px)] font-bold tracking-tight text-dark">
                <BrandText text={t("whyTitle")} />
              </h2>
              <p className="mx-auto mt-4 max-w-[650px] text-[clamp(16px,1.55vw,19px)] leading-relaxed text-muted">
                <BrandText text={t("whyLead")} />
              </p>
            </Reveal>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {why.map((item, index) => {
                const Icon = whyIcons[index] ?? ShieldCheck;
                return (
                  <Reveal key={item.title} delay={index * 80}>
                    <article className="group h-full rounded-[26px] border border-line bg-white p-7 shadow-[0_18px_52px_-38px_rgba(17,24,39,0.45)] transition-all hover:-translate-y-1 hover:border-brand-purple/35 hover:shadow-[0_30px_68px_-44px_rgba(139,92,246,0.6)]">
                      <div className="mb-6 grid h-[52px] w-[52px] place-items-center rounded-[18px] bg-brand-soft text-[#6D28D9] transition group-hover:scale-105">
                        <Icon size={24} aria-hidden />
                      </div>
                      <h3 className="text-lg font-bold tracking-tight text-dark">{item.title}</h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.text}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>

        <section id="contact" className="relative overflow-hidden py-16 md:py-24" aria-labelledby="contact-form-title">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-white" />
          <Container>
            <div className="grid gap-9 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
              <Reveal className="lg:sticky lg:top-28">
                <span className="eyebrow">{t("formSectionEyebrow")}</span>
                <h2 id="contact-form-title" className="mt-4 text-[clamp(29px,4vw,48px)] font-bold tracking-tight text-dark">
                  {t("formSectionTitle")}
                </h2>
                <p className="mt-4 max-w-[560px] text-[clamp(16px,1.55vw,19px)] leading-relaxed text-muted">
                  <BrandText text={t("formSectionLead")} />
                </p>
                <div className="mt-7 grid gap-3">
                  {expectations.slice(0, 3).map((item, index) => {
                    const Icon = expectationIcons[index] ?? CheckCircle2;
                    return (
                      <div key={item} className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm">
                          <Icon size={18} aria-hidden />
                        </span>
                        <span className="text-sm font-semibold text-ink">{item}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-7 rounded-[24px] border border-line bg-dark p-5 text-white shadow-[0_28px_64px_-44px_rgba(17,24,39,0.85)]">
                  <p className="text-sm font-semibold text-white/70">{t("directContactLabel")}</p>
                  <div className="mt-3 grid gap-2 text-sm">
                    <a className="inline-flex items-center gap-2 text-white transition hover:text-brand-pink" href={`mailto:${siteConfig.email}`}>
                      <Mail size={16} aria-hidden />
                      {siteConfig.email}
                    </a>
                    <a className="inline-flex items-center gap-2 text-white/80 transition hover:text-white" href="#contact">
                      <Phone size={16} aria-hidden />
                      {t("callHint")}
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={120} direction="right">
                <ContactPageForm />
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="bg-surface py-16 md:py-24" aria-labelledby="after-request">
          <Container>
            <div className="grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <Reveal>
                <span className="eyebrow">{t("expectationsEyebrow")}</span>
                <h2 id="after-request" className="mt-4 text-[clamp(29px,4vw,48px)] font-bold tracking-tight text-dark">
                  {t("expectationsTitle")}
                </h2>
                <p className="mt-4 max-w-[560px] text-[clamp(16px,1.55vw,19px)] leading-relaxed text-muted">
                  <BrandText text={t("expectationsLead")} />
                </p>
              </Reveal>

              <div className="grid gap-4 sm:grid-cols-2">
                {expectations.map((item, index) => {
                  const Icon = expectationIcons[index] ?? CheckCircle2;
                  return (
                    <Reveal key={item} delay={index * 60}>
                      <div className="flex h-full items-start gap-3 rounded-[22px] border border-line bg-white p-5 shadow-[0_16px_44px_-36px_rgba(17,24,39,0.45)]">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                          <Icon size={19} aria-hidden />
                        </span>
                        <span className="pt-2 text-[15px] font-semibold leading-snug text-dark">{item}</span>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </Container>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="contact-trust">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-[760px] text-center">
              <span className="eyebrow">{t("trustEyebrow")}</span>
              <h2 id="contact-trust" className="mt-4 text-[clamp(29px,4vw,48px)] font-bold tracking-tight text-dark">
                {t("trustTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-[650px] text-[clamp(16px,1.55vw,19px)] leading-relaxed text-muted">
                <BrandText text={t("trustLead")} />
              </p>
            </Reveal>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {metrics.map((item, index) => {
                const Icon = metricIcons[index] ?? BarChart3;
                return (
                  <Reveal key={item.label} delay={index * 70}>
                    <article className="relative h-full overflow-hidden rounded-[26px] border border-line bg-white p-6 shadow-[0_18px_52px_-38px_rgba(17,24,39,0.45)]">
                      <div aria-hidden className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-brand-purple/10 blur-2xl" />
                      <div className="relative mb-5 flex items-center justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-[#6D28D9]">
                          <Icon size={21} aria-hidden />
                        </span>
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.65)]" />
                      </div>
                      <p className="relative text-3xl font-bold tracking-tight text-dark">{item.value}</p>
                      <h3 className="relative mt-2 font-bold text-dark">{item.label}</h3>
                      <p className="relative mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={120}>
              <div className="mt-8 rounded-[28px] border border-line bg-surface p-5 md:p-7">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#6D28D9]">{t("logosTitle")}</p>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {logos.map((logo) => (
                        <span key={logo} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm">
                          {logo}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href="/projekte"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-line bg-white px-5 py-3 text-sm font-semibold text-dark transition hover:border-brand-purple hover:text-brand-purple"
                  >
                    {t("projectsCta")}
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>

        <section className="bg-surface py-16 md:py-24" aria-labelledby="local-seo-contact">
          <Container>
            <div className="grid gap-9 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <Reveal>
                <span className="eyebrow">{t("localSeoEyebrow")}</span>
                <h2 id="local-seo-contact" className="mt-4 text-[clamp(29px,4vw,48px)] font-bold tracking-tight text-dark">
                  {t("localSeoTitle")}
                </h2>
              </Reveal>

              <Reveal delay={80} direction="right">
                <div className="rounded-[28px] border border-line bg-white p-6 shadow-[0_22px_60px_-42px_rgba(17,24,39,0.45)] md:p-8">
                  <div className="space-y-5 text-[16px] leading-relaxed text-ink">
                    {localSeoParagraphs.map((paragraph) => (
                      <p key={paragraph}>
                        <BrandText text={paragraph} />
                      </p>
                    ))}
                  </div>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href="/leistungen" className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-dark transition hover:border-brand-purple hover:text-brand-purple">
                      {t("servicesLink")}
                    </Link>
                    <Link href="/branchen" className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-dark transition hover:border-brand-purple hover:text-brand-purple">
                      {t("industriesLink")}
                    </Link>
                    <Link href="/preise" className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-dark transition hover:border-brand-purple hover:text-brand-purple">
                      {t("pricingLink")}
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="ai-search-contact">
          <Container>
            <div className="grid gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <Reveal>
                <span className="eyebrow">{t("aiEyebrow")}</span>
                <h2 id="ai-search-contact" className="mt-4 text-[clamp(29px,4vw,48px)] font-bold tracking-tight text-dark">
                  {t("aiTitle")}
                </h2>
                <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-muted">
                  {aiParagraphs.map((paragraph) => (
                    <p key={paragraph}>
                      <BrandText text={paragraph} />
                    </p>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={90} direction="zoom">
                <div className="rounded-[30px] border border-line bg-dark p-5 text-white shadow-[0_30px_80px_-48px_rgba(17,24,39,0.9)] md:p-7">
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-5">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#6D28D9]">
                          <Bot size={21} aria-hidden />
                        </span>
                        <div>
                          <p className="font-semibold">{t("aiPanelTitle")}</p>
                          <p className="text-xs text-white/60">{t("aiPanelLead")}</p>
                        </div>
                      </div>
                      <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                        LLM
                      </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {aiPlatforms.map((platform, index) => (
                        <div key={platform} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-brand-pink">
                            {index + 1}
                          </span>
                          <span className="text-sm font-semibold text-white">{platform}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="bg-surface pb-20 pt-16 md:pb-24 md:pt-24" aria-labelledby="contact-faq">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-[720px] text-center">
              <span className="eyebrow">{t("faqEyebrow")}</span>
              <h2 id="contact-faq" className="mt-4 text-[clamp(29px,4vw,46px)] font-bold tracking-tight text-dark">
                {t("faqTitle")}
              </h2>
            </Reveal>
            <FaqAccordion items={faq} />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ContactWorkspaceVisual({ labels }: { labels: VisualLabels }) {
  return (
    <div className="relative" role="img" aria-label={labels.alt}>
      <div aria-hidden className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-brand-pink/20 via-brand-purple/15 to-transparent blur-2xl" />
      <div aria-hidden className="relative overflow-hidden rounded-[34px] border border-white bg-white/80 p-4 shadow-[0_34px_90px_-50px_rgba(17,24,39,0.55)] backdrop-blur md:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_16%,rgba(139,92,246,0.15),transparent_34%),radial-gradient(circle_at_12%_12%,rgba(255,79,163,0.12),transparent_30%)]" />
        <div className="relative rounded-[28px] border border-line bg-surface p-4 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-brand-pink" />
              <span className="h-3 w-3 rounded-full bg-brand-purple" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
            </div>
            <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-muted">
              {labels.workspace}
            </span>
          </div>

          <div className="relative min-h-[360px] md:min-h-[420px]">
            <div className="absolute left-1/2 top-8 w-[78%] -translate-x-1/2 rounded-[22px] border border-gray-200 bg-dark p-3 shadow-[0_28px_70px_-42px_rgba(17,24,39,0.9)]">
              <div className="rounded-[16px] bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6D28D9]">{labels.laptopTitle}</p>
                    <p className="mt-1 text-sm font-bold text-dark">{labels.laptopLead}</p>
                  </div>
                  <Laptop className="h-5 w-5 text-[#6D28D9]" />
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_0.8fr]">
                  <div className="rounded-2xl bg-surface p-4">
                    <div className="h-3 w-24 rounded-full bg-dark/90" />
                    <div className="mt-3 h-2 w-full rounded-full bg-gray-200" />
                    <div className="mt-2 h-2 w-4/5 rounded-full bg-gray-200" />
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <div className="h-16 rounded-xl bg-brand-pink/10" />
                      <div className="h-16 rounded-xl bg-brand-purple/10" />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-dark p-4 text-white">
                    <BarChart3 className="mb-3 h-5 w-5 text-brand-pink" />
                    <div className="h-2 w-24 rounded-full bg-white/70" />
                    <div className="mt-4 flex h-20 items-end gap-2">
                      {[36, 54, 42, 78, 66].map((height) => (
                        <span
                          key={height}
                          className="flex-1 rounded-t-lg bg-gradient-to-t from-brand-pink to-brand-purple"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-auto h-5 w-1/2 rounded-b-2xl bg-gray-900" />
            </div>

            <div className="absolute bottom-8 left-5 w-[34%] min-w-[132px] rounded-[28px] border-[8px] border-dark bg-white p-3 shadow-[0_24px_58px_-36px_rgba(17,24,39,0.85)] motion-safe:animate-bob">
              <div className="mb-3 mx-auto h-1.5 w-10 rounded-full bg-gray-200" />
              <div className="rounded-2xl bg-surface p-3">
                <Smartphone className="mb-3 h-5 w-5 text-[#6D28D9]" />
                <p className="text-xs font-bold text-dark">{labels.phoneTitle}</p>
                <div className="mt-3 space-y-2">
                  <div className="h-2 w-full rounded-full bg-gray-200" />
                  <div className="h-2 w-4/5 rounded-full bg-gray-200" />
                  <div className="h-7 rounded-lg bg-brand" />
                </div>
              </div>
            </div>

            <FloatingCard className="right-2 top-24" icon={Search} label={labels.cardSeo} />
            <FloatingCard className="right-5 bottom-24" icon={Bot} label={labels.cardAi} delay="0.7s" />
            <FloatingCard className="left-[38%] bottom-5" icon={Zap} label={labels.cardSpeed} delay="1.2s" />

            <div className="absolute left-[46%] top-[58%] hidden -translate-x-1/2 rounded-2xl border border-line bg-white px-4 py-3 shadow-[0_18px_44px_-30px_rgba(17,24,39,0.5)] sm:block">
              <div className="flex items-center gap-4">
                <MonitorSmartphone className="h-5 w-5 text-[#6D28D9]" />
                <div>
                  <p className="text-xs font-semibold text-muted">{labels.trafficLabel}</p>
                  <p className="text-lg font-bold text-dark">+47%</p>
                </div>
                <div className="h-8 w-px bg-line" />
                <div>
                  <p className="text-xs font-semibold text-muted">{labels.leadsLabel}</p>
                  <p className="text-lg font-bold text-dark">24h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatingCard({
  className,
  icon: Icon,
  label,
  delay,
}: {
  className: string;
  icon: LucideIcon;
  label: string;
  delay?: string;
}) {
  return (
    <div
      className={`absolute ${className} rounded-2xl border border-line bg-white px-4 py-3 shadow-[0_20px_46px_-32px_rgba(17,24,39,0.55)] motion-safe:animate-bob`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-soft text-[#6D28D9]">
          <Icon size={16} aria-hidden />
        </span>
        <span className="text-xs font-bold text-dark">{label}</span>
      </div>
    </div>
  );
}
