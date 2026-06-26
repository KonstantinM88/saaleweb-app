import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Contact } from "@/widgets/contact/Contact";
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
} from "@/shared/seo/schema";
import { buildMetadata } from "@/shared/seo/metadata";
import { siteConfig } from "@/shared/config/site";

export const revalidate = 300;

type Params = { locale: string };
type TextCard = { title: string; text: string };
type VisualLabels = {
  status: string;
  title: string;
  lead: string;
  leadLabel: string;
  seoLabel: string;
  geoLabel: string;
  aiLabel: string;
  seoValue: string;
  geoValue: string;
  aiValue: string;
};

const proofIcons: LucideIcon[] = [Clock3, MessageCircle, ShieldCheck];
const focusIcons: LucideIcon[] = [Zap, Search, Bot];
const geoIcons: LucideIcon[] = [MapPin, ShieldCheck, Sparkles];
const processIcons: LucideIcon[] = [MessageCircle, Search, CheckCircle2];

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
  const homePath = locale === routing.defaultLocale ? "/" : `/${locale}`;
  const proof = t.raw("proof") as TextCard[];
  const focus = t.raw("focus") as TextCard[];
  const regions = t.raw("regions") as string[];
  const geoCards = t.raw("geoCards") as TextCard[];
  const process = t.raw("process") as TextCard[];
  const faq = t.raw("faq") as QA[];
  const visual: VisualLabels = {
    status: t("visualStatus"),
    title: t("visualTitle"),
    lead: t("visualLead"),
    leadLabel: t("visualLeadLabel"),
    seoLabel: t("visualSeoLabel"),
    geoLabel: t("visualGeoLabel"),
    aiLabel: t("visualAiLabel"),
    seoValue: t("visualSeoValue"),
    geoValue: t("visualGeoValue"),
    aiValue: t("visualAiValue"),
  };

  return (
    <>
      <Navbar />
      <JsonLd
        data={[
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

        <section className="relative overflow-hidden pb-12 pt-6 md:pb-20 md:pt-10">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(680px 380px at 80% 4%, rgba(139,92,246,0.13), transparent 60%), radial-gradient(620px 360px at 8% 12%, rgba(255,79,163,0.10), transparent 58%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(17,24,39,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,24,39,0.05) 1px, transparent 1px)",
                backgroundSize: "54px 54px",
                maskImage: "radial-gradient(ellipse 82% 64% at 50% 0%, #000 25%, transparent 78%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 82% 64% at 50% 0%, #000 25%, transparent 78%)",
              }}
            />
          </div>

          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-[0.98fr_1.02fr] lg:gap-14">
              <div className="hero-stagger">
                <span className="eyebrow">{t("heroEyebrow")}</span>
                <h1 className="mt-4 text-[clamp(34px,5.2vw,62px)] font-bold leading-[1.06] tracking-tight text-dark">
                  {t("heroTitle")}
                </h1>
                <p className="mt-5 max-w-2xl text-[clamp(16px,1.7vw,20px)] text-muted">
                  <BrandText text={t("heroLead")} />
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Magnetic>
                    <a
                      href="#contact"
                      className="btn-shine group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,79,163,0.55)] transition-all hover:-translate-y-0.5"
                    >
                      {t("primaryCta")}
                      <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
                    </a>
                  </Magnetic>
                  <Magnetic>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-6 py-3.5 text-[15px] font-semibold text-dark transition-all hover:border-brand-purple hover:text-brand-purple"
                    >
                      <Mail size={17} aria-hidden />
                      {t("secondaryCta")}
                    </a>
                  </Magnetic>
                </div>

                <p className="mt-5 flex items-center gap-2 text-[13.5px] text-muted">
                  <CheckCircle2 size={16} className="text-emerald-700" aria-hidden />
                  {t("responseNote")}
                </p>
              </div>

              <Reveal delay={100}>
                <ContactVisual labels={visual} regions={regions} />
              </Reveal>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {proof.map((item, index) => {
                const Icon = proofIcons[index] ?? ShieldCheck;
                return (
                  <Reveal key={item.title} delay={index * 80}>
                    <article className="h-full rounded-[22px] border border-line bg-white p-6 shadow-[0_18px_52px_-34px_rgba(17,24,39,0.45)]">
                      <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-brand-purple/10 text-[#6D28D9]">
                        <Icon size={21} aria-hidden />
                      </div>
                      <h2 className="text-lg font-bold tracking-tight text-dark">{item.title}</h2>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.text}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>

        <section className="py-16 md:py-24">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-[720px] text-center md:mb-14">
              <span className="eyebrow">{t("focusEyebrow")}</span>
              <h2 className="mt-4 text-[clamp(28px,4vw,46px)] font-bold tracking-tight text-dark">
                {t("focusTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-[640px] text-[clamp(16px,1.6vw,19px)] text-muted">
                <BrandText text={t("focusLead")} />
              </p>
            </Reveal>

            <div className="grid gap-5 md:grid-cols-3">
              {focus.map((item, index) => {
                const Icon = focusIcons[index] ?? Sparkles;
                return (
                  <Reveal key={item.title} delay={index * 90}>
                    <article className="group h-full rounded-[24px] border border-line bg-surface p-7 transition-all hover:-translate-y-1 hover:border-brand-purple/30 hover:bg-white hover:shadow-[0_22px_56px_-34px_rgba(139,92,246,0.45)]">
                      <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#6D28D9] shadow-sm transition-colors group-hover:bg-brand-purple/10">
                        <Icon size={23} aria-hidden />
                      </div>
                      <h3 className="text-xl font-bold tracking-tight text-dark">{item.title}</h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.text}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>

        <section className="bg-surface py-16 md:py-24">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <Reveal>
                <span className="eyebrow">{t("geoEyebrow")}</span>
                <h2 className="mt-4 text-[clamp(28px,4vw,46px)] font-bold tracking-tight text-dark">
                  {t("geoTitle")}
                </h2>
                <p className="mt-4 max-w-[600px] text-[clamp(16px,1.6vw,19px)] text-muted">
                  <BrandText text={t("geoLead")} />
                </p>

                <div className="mt-7 flex flex-wrap gap-2.5">
                  {regions.map((region) => (
                    <span
                      key={region}
                      className="rounded-full border border-line bg-white px-3.5 py-2 text-[13.5px] font-semibold text-ink"
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </Reveal>

              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
                {geoCards.map((item, index) => {
                  const Icon = geoIcons[index] ?? Globe2;
                  return (
                    <Reveal key={item.title} delay={index * 80}>
                      <article className="flex h-full gap-4 rounded-[22px] border border-line bg-white p-6 shadow-[0_16px_44px_-34px_rgba(17,24,39,0.45)]">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-pink/10 text-[#BE185D]">
                          <Icon size={20} aria-hidden />
                        </div>
                        <div>
                          <h3 className="font-bold tracking-tight text-dark">{item.title}</h3>
                          <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{item.text}</p>
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </Container>
        </section>

        <section className="py-16 md:py-24">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-[700px] text-center">
              <span className="eyebrow">{t("processEyebrow")}</span>
              <h2 className="mt-4 text-[clamp(28px,4vw,46px)] font-bold tracking-tight text-dark">
                {t("processTitle")}
              </h2>
            </Reveal>

            <div className="grid gap-5 md:grid-cols-3">
              {process.map((item, index) => {
                const Icon = processIcons[index] ?? CheckCircle2;
                return (
                  <Reveal key={item.title} delay={index * 90}>
                    <article className="relative h-full overflow-hidden rounded-[24px] border border-line bg-white p-7 shadow-[0_18px_52px_-36px_rgba(17,24,39,0.45)]">
                      <div aria-hidden className="absolute right-5 top-4 font-mono text-5xl font-bold text-gray-100">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="relative">
                        <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-dark text-white">
                          <Icon size={21} aria-hidden />
                        </div>
                        <h3 className="text-lg font-bold tracking-tight text-dark">{item.title}</h3>
                        <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.text}</p>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>

        <Contact source="contact_page" />

        <section className="pb-20 pt-4 md:pb-24">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-[700px] text-center">
              <span className="eyebrow">{t("faqEyebrow")}</span>
              <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-dark">
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

function ContactVisual({ labels, regions }: { labels: VisualLabels; regions: string[] }) {
  const visibleRegions = regions.slice(0, 4);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[36px] bg-gradient-to-br from-brand-pink/20 via-brand-purple/10 to-transparent blur-2xl"
      />
      <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-dark p-5 shadow-[0_26px_80px_-42px_rgba(17,24,39,0.9)] sm:p-7">
        <div
          aria-hidden
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.10) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <div
          aria-hidden
          className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-purple/30 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-14 h-60 w-60 rounded-full bg-brand-pink/25 blur-3xl"
        />

        <div className="relative rounded-[24px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[#6D28D9]">
                <MessageCircle size={19} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{labels.status}</p>
                <p className="text-xs text-white/60">{siteConfig.email}</p>
              </div>
            </div>
            <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
              24h
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_0.92fr]">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.07] p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                {labels.leadLabel}
              </p>
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-white">
                {labels.title}
              </h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/70">
                {labels.lead}
              </p>
            </div>

            <div className="relative min-h-[210px] overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.05] p-4">
              <div aria-hidden className="absolute inset-0">
                <svg className="h-full w-full" viewBox="0 0 240 210" fill="none">
                  <path
                    d="M42 155 C82 80 144 115 196 48"
                    stroke="url(#contactLineA)"
                    strokeWidth="2"
                    strokeDasharray="7 7"
                  />
                  <path
                    d="M43 60 C85 94 118 42 190 148"
                    stroke="url(#contactLineB)"
                    strokeWidth="2"
                    strokeDasharray="6 8"
                  />
                  <defs>
                    <linearGradient id="contactLineA" x1="42" y1="155" x2="196" y2="48">
                      <stop stopColor="#ff4fa3" />
                      <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="contactLineB" x1="43" y1="60" x2="190" y2="148">
                      <stop stopColor="#8b5cf6" />
                      <stop offset="1" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <VisualNode className="left-[10%] top-[18%]" label={visibleRegions[0] ?? "Halle"} active />
              <VisualNode className="right-[11%] top-[18%]" label={visibleRegions[1] ?? "Leipzig"} />
              <VisualNode className="left-[12%] bottom-[14%]" label={visibleRegions[2] ?? "Merseburg"} />
              <VisualNode className="right-[8%] bottom-[12%]" label={visibleRegions[3] ?? "Saalekreis"} />

              <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[24px] border border-white/15 bg-white text-center shadow-[0_18px_42px_-20px_rgba(255,255,255,0.8)]">
                <div>
                  <Globe2 className="mx-auto mb-1 h-5 w-5 text-[#6D28D9]" aria-hidden />
                  <p className="text-xs font-bold text-dark">SaaleWeb</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <SignalPill icon={Search} label={labels.seoLabel} value={labels.seoValue} />
            <SignalPill icon={Sparkles} label={labels.geoLabel} value={labels.geoValue} />
            <SignalPill icon={Bot} label={labels.aiLabel} value={labels.aiValue} />
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualNode({
  className,
  label,
  active = false,
}: {
  className: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div className={`absolute ${className}`}>
      <div className="flex items-center gap-2 rounded-full border border-white/15 bg-dark/80 px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
        <span
          className={active ? "h-2.5 w-2.5 rounded-full bg-emerald-400" : "h-2.5 w-2.5 rounded-full bg-brand-purple"}
          aria-hidden
        />
        {label}
      </div>
    </div>
  );
}

function SignalPill({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
      <div className="mb-2 flex items-center gap-2 text-white">
        <Icon size={16} aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">{label}</span>
      </div>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
