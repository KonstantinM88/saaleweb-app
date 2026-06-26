import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import {
  Search,
  Sparkles,
  MousePointerClick,
  Zap,
  ArrowRight,
  Check,
  type LucideIcon,
} from "lucide-react";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { Reveal } from "@/shared/ui/Reveal";
import { Magnetic } from "@/shared/ui/Magnetic";
import { BrandText } from "@/shared/ui/BrandText";
import { getContactHref } from "@/shared/lib/contactHref";
import { JsonLd } from "@/shared/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema, serviceSchema } from "@/shared/seo/schema";
import { buildMetadata } from "@/shared/seo/metadata";
import { TrustMetrics } from "@/shared/ui/TrustMetrics";
import { ServiceCard, type ServiceCardData } from "@/widgets/services-page/ServiceCard";
import { FaqAccordion, type QA } from "@/widgets/faq/FaqAccordion";

export const revalidate = 300;

type Params = { locale: string };
type Step = { title: string; desc: string };
type Result = { title: string; desc: string };

const resultIcons: LucideIcon[] = [Search, Sparkles, MousePointerClick, Zap];

async function getItems(locale: AppLocale): Promise<ServiceCardData[]> {
  try {
    const rows = (await prisma.serviceTranslation.findMany({
      where: { locale, service: { published: true } },
      orderBy: { service: { order: "asc" } },
      select: {
        name: true,
        slug: true,
        excerpt: true,
        service: {
          select: {
            coverImage: true,
            translations: {
              where: { locale: "de" },
              select: { slug: true },
              take: 1,
            },
          },
        },
      },
    })) as {
      name: string;
      slug: string;
      excerpt: string | null;
      service: {
        coverImage: string | null;
        translations: { slug: string }[];
      };
    }[];
    return rows.map((row) => ({
      name: row.name,
      slug: row.slug,
      metaSlug: row.service.translations[0]?.slug ?? row.slug,
      excerpt: row.excerpt,
      coverImage: row.service.coverImage,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "ServicesPage" });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ locale: l, href: "/leistungen" })]),
  );
  return buildMetadata({
    path: "/leistungen",
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    eyebrow: t("heroEyebrow"),
    languages,
  });
}

export default async function ServicesIndexPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "ServicesPage" });
  const tp = await getTranslations({ locale, namespace: "Pages" });
  const items = await getItems(locale);

  const steps = t.raw("process") as Step[];
  const results = t.raw("results") as Result[];
  const faq = t.raw("faq") as QA[];

  const homePath = locale === routing.defaultLocale ? "/" : `/${locale}`;
  const servicesPath = getPathname({ locale, href: "/leistungen" });
  const pricingHref = getPathname({ locale, href: "/preise" });
  const contactHref = getContactHref(locale);

  const trust = [
    { value: t("trust1Value"), label: t("trust1Label") },
    { value: t("trust2Value"), label: t("trust2Label") },
    { value: t("trust3Value"), label: t("trust3Label") },
    { value: t("trust4Value"), label: t("trust4Label") },
  ];

  return (
    <>
      <Navbar />
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: tp("home"), path: homePath },
            { name: tp("servicesLabel"), path: servicesPath },
          ]),
          faqPageSchema(faq),
          ...items.map((s) =>
            serviceSchema({
              name: s.name,
              description: s.excerpt ?? t("metaDescription"),
              path: `${servicesPath}/${s.slug}`,
              locale,
            }),
          ),
        ]}
      />

      <main>
        <Breadcrumbs items={[{ name: tp("home"), href: "/" }, { name: tp("servicesLabel") }]} />

        {/* ---------------- HERO ---------------- */}
        <section className="relative overflow-hidden pb-10 pt-6 md:pb-16 md:pt-10">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(620px 360px at 82% 0%, rgba(139,92,246,0.10), transparent 60%), radial-gradient(560px 320px at 8% 4%, rgba(255,79,163,0.08), transparent 58%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(17,24,39,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,24,39,0.05) 1px, transparent 1px)",
                backgroundSize: "54px 54px",
                maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 25%, transparent 78%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, #000 25%, transparent 78%)",
              }}
            />
          </div>
          <Container>
            <div className="hero-stagger max-w-3xl">
              <span className="eyebrow">{t("heroEyebrow")}</span>
              <h1 className="mt-4 text-[clamp(32px,5.2vw,58px)] font-bold leading-[1.08] tracking-tight text-dark">
                {t("heroTitle")}
              </h1>
              <p className="mt-5 max-w-2xl text-[clamp(16px,1.7vw,20px)] text-muted">
                {t("heroLead")}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Magnetic>
                  <a
                    href={contactHref}
                    className="btn-shine group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,79,163,0.55)] transition-all hover:-translate-y-0.5"
                  >
                    {t("heroCta")}
                    <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href={pricingHref}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-6 py-3.5 text-[15px] font-semibold text-dark transition-all hover:border-brand-purple hover:text-brand-purple"
                  >
                    {t("heroCta2")}
                  </a>
                </Magnetic>
              </div>
            </div>

            <Reveal delay={120}>
              <div className="mt-12">
                <TrustMetrics items={trust} />
              </div>
            </Reveal>
          </Container>
        </section>

        {/* ---------------- SERVICES GRID ---------------- */}
        <section className="py-16 md:py-24">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-[680px] text-center md:mb-14">
              <span className="eyebrow">{t("servicesEyebrow")}</span>
              <h2 className="mt-4 text-[clamp(28px,4vw,46px)] font-bold tracking-tight text-dark">
                {t("servicesTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-[620px] text-[clamp(16px,1.6vw,19px)] text-muted">
                {t("servicesLead")}
              </p>
            </Reveal>

            {items.length === 0 ? (
              <p className="mx-auto max-w-md rounded-2xl border border-dashed border-line bg-surface p-10 text-center text-muted">
                {tp("servicesLabel")} —
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, i) => (
                  <ServiceCard
                    key={item.slug}
                    item={item}
                    index={i}
                    locale={locale}
                    outcomesLabel={t("outcomesLabel")}
                    moreLabel={t("learnMore")}
                  />
                ))}
              </div>
            )}
          </Container>
        </section>

        {/* ---------------- PROCESS ---------------- */}
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-[680px] text-center md:mb-14">
              <span className="eyebrow">{t("processEyebrow")}</span>
              <h2 className="mt-4 text-[clamp(28px,4vw,46px)] font-bold tracking-tight text-dark">
                {t("processTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-[620px] text-[clamp(16px,1.6vw,19px)] text-muted">
                {t("processLead")}
              </p>
            </Reveal>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="relative">
                    {i < steps.length - 1 && (
                      <span className="absolute left-[58px] top-[26px] hidden h-px w-[calc(100%_-_40px)] bg-gradient-to-r from-brand-pink/40 to-brand-purple/40 lg:block" />
                    )}
                    <div className="relative z-10 mb-5 grid h-[52px] w-[52px] place-items-center rounded-[15px] border border-line bg-white font-mono text-lg font-semibold text-brand-purple shadow-card">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-dark">{step.title}</h3>
                    <p className="text-sm text-muted">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* ---------------- RESULTS ---------------- */}
        <section className="py-16 md:py-24">
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
              <Reveal>
                <span className="eyebrow">
                  <BrandText text={t("resultsEyebrow")} />
                </span>
                <h2 className="mt-4 text-[clamp(26px,3.6vw,42px)] font-bold tracking-tight text-dark">
                  {t("resultsTitle")}
                </h2>
                <p className="mt-4 max-w-md text-[clamp(16px,1.6vw,18px)] text-muted">
                  {t("resultsLead")}
                </p>
                <Magnetic className="mt-7 inline-block">
                  <a
                    href={contactHref}
                    className="btn-shine group inline-flex items-center justify-center gap-2 rounded-xl bg-dark px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5"
                  >
                    {t("heroCta")}
                    <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </a>
                </Magnetic>
              </Reveal>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {results.map((r, i) => {
                  const Icon = resultIcons[i % resultIcons.length];
                  return (
                    <Reveal key={i} delay={i * 80} className="h-full">
                      <div className="card-border-glow h-full rounded-[18px] border border-line bg-white p-6">
                        <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand-purple">
                          <Icon size={22} aria-hidden />
                        </div>
                        <h3 className="mb-1.5 text-[16.5px] font-bold text-dark">{r.title}</h3>
                        <p className="text-[14px] leading-relaxed text-muted">{r.desc}</p>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </Container>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-[680px] text-center md:mb-14">
              <span className="eyebrow">{t("faqEyebrow")}</span>
              <h2 className="mt-4 text-[clamp(28px,4vw,46px)] font-bold tracking-tight text-dark">
                {t("faqTitle")}
              </h2>
            </Reveal>
            <FaqAccordion items={faq} />
          </Container>
        </section>

        {/* ---------------- FINAL CTA ---------------- */}
        <section className="py-16 md:py-20">
          <Container>
            <Reveal>
              <div className="relative overflow-hidden rounded-[24px] bg-dark p-8 text-center sm:p-12 md:rounded-[28px] md:p-14">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(600px 320px at 50% 0%, rgba(255,79,163,0.28), transparent 60%), radial-gradient(500px 300px at 85% 100%, rgba(139,92,246,0.26), transparent 60%)",
                  }}
                />
                <div className="relative">
                  <h2 className="text-[clamp(24px,3.2vw,40px)] font-bold tracking-tight text-white">
                    {tp("ctaTitle")}
                  </h2>
                  <p className="mx-auto mt-3 max-w-lg text-[16px] text-gray-400">{tp("ctaText")}</p>
                  <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    <Magnetic>
                      <a
                        href={contactHref}
                        className="btn-shine group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5"
                      >
                        {t("heroCta")}
                        <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
                      </a>
                    </Magnetic>
                    <Magnetic>
                      <a
                        href={pricingHref}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-white/10"
                      >
                        {t("heroCta2")}
                      </a>
                    </Magnetic>
                  </div>
                  <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13.5px] text-gray-400">
                    {[t("trust4Label"), t("trust2Label"), t("trust3Label")].map((x) => (
                      <li key={x} className="inline-flex items-center gap-1.5">
                        <Check size={15} className="text-success" aria-hidden />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
