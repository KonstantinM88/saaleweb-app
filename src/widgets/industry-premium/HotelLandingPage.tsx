import { Fragment } from "react";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ExternalLink,
  Minus,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs, type Crumb } from "@/shared/ui/Breadcrumbs";
import { Reveal } from "@/shared/ui/Reveal";
import { Magnetic } from "@/shared/ui/Magnetic";
import { BrandText } from "@/shared/ui/BrandText";
import { EditorialTrust } from "@/shared/ui/EditorialTrust";
import { JsonLd } from "@/shared/seo/JsonLd";
import {
  breadcrumbSchema,
  faqPageSchema,
  offerCatalogSchema,
  serviceSchema,
  webPageSchema,
} from "@/shared/seo/schema";
import { EDITORIAL_REVIEW_DATE } from "@/shared/config/editorial";
import { getContactHref } from "@/shared/lib/contactHref";
import { getAuditHref, getHomeHref } from "@/shared/lib/localizedPath";
import { LocaleSlugsProvider } from "@/features/language-switcher/LocaleSlugsContext";
import type { Phase4SlugMap } from "@/widgets/seo-landing/phase4Content";
import { CommissionCalculator } from "./CommissionCalculator";
import type { HotelLandingContent, PremiumLocale } from "./types";

type Props = {
  content: HotelLandingContent;
  locale: AppLocale;
  path: string;
  parent: { name: string; href: Crumb["href"]; path: string };
  homeLabel: string;
  localeSlugs: Phase4SlugMap;
};

const HOTEL_BOOKING_PREVIEW_URL = "https://waldschlosschen-08.vercel.app/de/hotel/buchen";

export function HotelLandingPage({ content, locale, path, parent, homeLabel, localeSlugs }: Props) {
  const contactHref = getContactHref(locale);
  const auditHref = getAuditHref(locale);
  const homePath = getHomeHref(locale);

  const schema = [
    serviceSchema({ name: content.h1, description: content.metaDescription, path, locale }),
    webPageSchema({
      name: content.h1,
      description: content.metaDescription,
      path,
      locale,
      about: content.eyebrow,
      dateModified: EDITORIAL_REVIEW_DATE,
      author: true,
    }),
    breadcrumbSchema([
      { name: homeLabel, path: homePath },
      { name: parent.name, path: parent.path },
      { name: content.h1, path },
    ]),
    offerCatalogSchema({
      name: content.packages.catalogName,
      description: content.metaDescription,
      path,
      locale,
      offers: content.packages.tiers.map((tier) => ({
        name: tier.name,
        description: tier.forWhom,
        price: tier.price,
        minPrice: tier.minPrice,
      })),
    }),
    faqPageSchema(content.faq.items),
  ];

  return (
    <LocaleSlugsProvider slugs={localeSlugs}>
      <Navbar />
      <JsonLd data={schema} />

      <main className="hotel-page">
        <Breadcrumbs
          items={[{ name: homeLabel, href: "/" }, { name: parent.name, href: parent.href }, { name: content.h1 }]}
        />

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pb-16 pt-8 md:pb-24 md:pt-12">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(255,79,163,0.10),transparent_34%),radial-gradient(circle_at_88%_0%,rgba(139,92,246,0.13),transparent_32%),linear-gradient(180deg,#fff_0%,#f7f8fb_100%)]" />
          </div>
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-10">
              <div className="hero-stagger">
                <span className="eyebrow">{content.eyebrow}</span>
                <h1 className="mt-4 text-[clamp(34px,5.6vw,62px)] font-extrabold leading-[1.04] tracking-[-0.025em] text-dark">
                  <Accented text={content.h1} accent={content.h1Accent} />
                </h1>
                <p className="mt-6 max-w-xl text-[clamp(16.5px,1.7vw,19px)] leading-relaxed text-muted">
                  <BrandText text={content.lead} />
                </p>

                <ul className="mt-7 grid gap-2.5">
                  {content.heroPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-[15px] text-ink">
                      <Check size={17} className="mt-0.5 shrink-0 text-[#B8862B]" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Magnetic>
                    <a
                      href={contactHref}
                      className="btn-shine group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(255,79,163,0.72)] transition-all hover:-translate-y-0.5"
                    >
                      {content.ctaPrimary}
                      <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
                    </a>
                  </Magnetic>
                  <Magnetic>
                    <a
                      href={auditHref}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white px-6 py-3.5 text-[15px] font-semibold text-dark shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-purple hover:text-brand-purple"
                    >
                      {content.ctaSecondary}
                    </a>
                  </Magnetic>
                </div>
              </div>

              <Reveal direction="zoom" delay={80}>
                <BookingBarMock bar={content.bookingBar} />
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ── DIRECT ANSWER (GEO / AIO) ────────────────────────── */}
        <section className="border-y border-line bg-white py-12 md:py-16" aria-labelledby="hotel-answer">
          <Container>
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
                <div>
                  <span className="eyebrow">{content.answer.eyebrow}</span>
                  <h2
                    id="hotel-answer"
                    className="mt-4 text-[clamp(23px,2.9vw,33px)] font-extrabold leading-tight tracking-[-0.02em] text-dark"
                  >
                    {content.answer.question}
                  </h2>
                  <p className="mt-4 text-[16px] leading-relaxed text-ink">
                    <BrandText text={content.answer.text} />
                  </p>
                </div>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {content.answer.facts.map((fact) => (
                    <div key={fact.label} className="rounded-2xl border border-line bg-surface p-4">
                      <dt className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-purple">
                        {fact.label}
                      </dt>
                      <dd className="mt-2 text-[14px] font-semibold leading-relaxed text-ink">
                        <BrandText text={fact.value} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* ── PORTAL vs DIRECT ─────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.channels.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.channels.title}
              </h2>
              <p className="mt-5 text-[16.5px] leading-relaxed text-muted">{content.channels.intro}</p>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-2 md:gap-6">
              {content.channels.columns.map((column, index) => {
                const direct = column.tone === "direct";
                return (
                  <Reveal key={column.title} delay={index * 80} className="h-full">
                    <article
                      className={`flex h-full flex-col rounded-[24px] border p-6 md:p-8 ${
                        direct
                          ? "border-brand-purple/25 bg-white shadow-[0_30px_90px_-64px_rgba(139,92,246,0.85)]"
                          : "border-line bg-surface"
                      }`}
                    >
                      <p
                        className={`font-mono text-[11px] font-bold uppercase tracking-[0.16em] ${
                          direct ? "text-brand-purple" : "text-muted"
                        }`}
                      >
                        {column.subtitle}
                      </p>
                      <h3 className="mt-2 text-[clamp(20px,2.3vw,26px)] font-extrabold tracking-[-0.02em] text-dark">
                        {column.title}
                      </h3>

                      <p className="mt-6 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-success">
                        {content.channels.prosLabel}
                      </p>
                      <ul className="mt-3 grid gap-2.5">
                        {column.pros.map((item) => (
                          <li key={item} className="flex gap-2.5 text-[15px] leading-relaxed text-ink">
                            <Check size={16} className="mt-1 shrink-0 text-success" aria-hidden />
                            {item}
                          </li>
                        ))}
                      </ul>

                      <p className="mt-7 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted">
                        {content.channels.consLabel}
                      </p>
                      <ul className="mt-3 grid gap-2.5">
                        {column.cons.map((item) => (
                          <li key={item} className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
                            <Minus size={16} className="mt-1 shrink-0 text-line" aria-hidden />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={120}>
              <p className="mx-auto mt-8 max-w-3xl border-l-2 border-[#D9A441] pl-5 text-[16px] leading-relaxed text-ink">
                {content.channels.conclusion}
              </p>
            </Reveal>
          </Container>
        </section>

        {/* ── SIGNATURE: COMMISSION CALCULATOR ─────────────────── */}
        <section className="hotel-night relative overflow-hidden py-16 md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_-10%,rgba(217,164,65,0.20),transparent_38%),radial-gradient(circle_at_0%_100%,rgba(139,92,246,0.22),transparent_36%)]"
          />
          <Container className="relative">
            <div className="max-w-3xl">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#E8C071]">
                {content.calculator.eyebrow}
              </span>
              <h2 className="mt-4 text-[clamp(27px,3.8vw,44px)] font-extrabold leading-[1.08] tracking-[-0.025em] text-white">
                {content.calculator.title}
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-white/65">{content.calculator.intro}</p>
            </div>
            <div className="mt-10">
              <CommissionCalculator
                copy={content.calculator}
                locale={locale as PremiumLocale}
                ctaHref={contactHref}
              />
            </div>
          </Container>
        </section>

        {/* ── GUEST JOURNEY ────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.journey.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.journey.title}
              </h2>
              <p className="mt-5 text-[16.5px] leading-relaxed text-muted">{content.journey.intro}</p>
            </Reveal>

            <Reveal className="mt-12">
              <ol className="grid gap-0">
                {content.journey.steps.map((step, index) => (
                  <li
                    key={step.phase}
                    className="hotel-rail grid gap-5 py-7 md:grid-cols-[auto_1fr] md:gap-8"
                  >
                    <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
                      <span className="hotel-figure grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#D9A441]/35 bg-[#D9A441]/10 text-[15px] font-extrabold text-[#8A6316]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[17px] font-extrabold tracking-[-0.01em] text-dark md:w-[128px]">
                        {step.phase}
                      </p>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2 md:gap-8">
                      <div>
                        <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted">
                          {content.journey.guestLabel}
                        </p>
                        <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.guest}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-purple">
                          {content.journey.siteLabel}
                        </p>
                        <p className="mt-2 text-[15px] leading-relaxed text-ink">{step.site}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </Container>
        </section>

        {/* ── ROOM PAGE ANATOMY ────────────────────────────────── */}
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.roomPage.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.roomPage.title}
              </h2>
              <p className="mt-5 text-[16.5px] leading-relaxed text-muted">{content.roomPage.intro}</p>
            </Reveal>

            <div className="mt-12 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
              <Reveal>
                <RoomPageMock mock={content.roomPage.mock} />
              </Reveal>
              <Reveal delay={90}>
                <ol className="grid gap-3">
                  {content.roomPage.callouts.map((callout) => (
                    <li
                      key={callout.key}
                      className="flex gap-4 rounded-[18px] border border-line bg-white p-5"
                    >
                      <span className="hotel-marker shrink-0">{callout.key}</span>
                      <div>
                        <h3 className="text-[16px] font-extrabold text-dark">{callout.title}</h3>
                        <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{callout.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ── SCOPE ────────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.build.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.build.title}
              </h2>
              <p className="mt-5 text-[16.5px] leading-relaxed text-muted">{content.build.intro}</p>
            </Reveal>

            <div className="mt-10 grid gap-x-8 gap-y-1 md:grid-cols-2 lg:grid-cols-3">
              {content.build.items.map((item, index) => (
                <Reveal key={item.title} delay={(index % 3) * 60} className="h-full">
                  <article className="h-full border-t border-line py-6">
                    <h3 className="flex items-start gap-2.5 text-[16.5px] font-extrabold text-dark">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D9A441]" />
                      {item.title}
                    </h3>
                    <p className="mt-2 pl-4 text-[14.5px] leading-relaxed text-muted">{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* ── VISIBILITY: SEO / GEO / AIO ──────────────────────── */}
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.visibility.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.visibility.title}
              </h2>
              <p className="mt-5 text-[16.5px] leading-relaxed text-muted">{content.visibility.intro}</p>
            </Reveal>

            <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
              <Reveal>
                <div className="rounded-[24px] border border-line bg-white p-6 shadow-card md:p-7">
                  <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-purple">
                    {content.visibility.promptsLabel}
                  </p>
                  <ul className="mt-5 grid gap-2.5">
                    {content.visibility.prompts.map((prompt) => (
                      <li key={prompt} className="hotel-prompt">
                        <Search size={15} className="shrink-0 text-brand-purple" aria-hidden />
                        <span>{prompt}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 border-t border-line pt-5 text-[14px] leading-relaxed text-muted">
                    {content.visibility.promptsNote}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={90}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {content.visibility.signals.map((signal) => (
                    <article key={signal.title} className="rounded-[20px] border border-line bg-white p-5">
                      <h3 className="text-[15.5px] font-extrabold text-dark">{signal.title}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-muted">{signal.text}</p>
                    </article>
                  ))}
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ── TECHNOLOGY ───────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.tech.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.tech.title}
              </h2>
              <p className="mt-5 text-[16.5px] leading-relaxed text-muted">{content.tech.intro}</p>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {content.tech.items.map((item, index) => (
                <Reveal key={item.title} delay={(index % 3) * 60} className="h-full">
                  <article className="card-border-glow h-full rounded-[20px] border border-line bg-white p-6">
                    <h3 className="text-[16px] font-extrabold text-dark">{item.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={80}>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {content.tech.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-line bg-surface px-3.5 py-2 text-[13px] font-bold text-dark"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex gap-4 rounded-[20px] border border-[#D9A441]/30 bg-[#D9A441]/[0.07] p-5 md:p-6">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#8A6316]" aria-hidden />
                <p className="text-[15px] leading-relaxed text-ink">{content.tech.honesty}</p>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* ── LEGAL / RELIABILITY ──────────────────────────────── */}
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.legal.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.legal.title}
              </h2>
            </Reveal>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {content.legal.items.map((item, index) => (
                <Reveal key={item.title} delay={(index % 2) * 70} className="h-full">
                  <article className="h-full rounded-[20px] border border-line bg-white p-6">
                    <h3 className="text-[16px] font-extrabold text-dark">{item.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
            <Reveal delay={90}>
              <p className="mt-7 max-w-3xl text-[14.5px] leading-relaxed text-muted">{content.legal.note}</p>
            </Reveal>
          </Container>
        </section>

        {/* ── REFERENCE ────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <Container>
            <Reveal>
              <div className="hotel-night relative overflow-hidden rounded-[28px] p-7 md:p-10">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_0%,rgba(217,164,65,0.20),transparent_40%),radial-gradient(circle_at_0%_100%,rgba(255,79,163,0.18),transparent_38%)]"
                />
                <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                  <div>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#E8C071]">
                      {content.reference.eyebrow}
                    </span>
                    <h2 className="mt-4 text-[clamp(23px,3vw,34px)] font-extrabold leading-tight tracking-[-0.02em] text-white">
                      {content.reference.title}
                    </h2>
                    <p className="mt-4 text-[15.5px] leading-relaxed text-white/70">{content.reference.text}</p>
                    <a
                      href={content.reference.linkHref}
                      className="group mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[0.18] bg-white/[0.08] px-5 py-3 text-[14.5px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/[0.32]"
                    >
                      {content.reference.linkLabel}
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </a>
                  </div>
                  <ul className="grid gap-3">
                    {content.reference.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 rounded-[18px] border border-white/[0.10] bg-white/[0.05] p-4 text-[14.5px] leading-relaxed text-white/80"
                      >
                        <Sparkles size={16} className="mt-0.5 shrink-0 text-[#E8C071]" aria-hidden />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* ── PACKAGES ─────────────────────────────────────────── */}
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.packages.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.packages.title}
              </h2>
              <p className="mt-5 text-[16.5px] leading-relaxed text-muted">{content.packages.intro}</p>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {content.packages.tiers.map((tier, index) => {
                const featured = index === 1;
                return (
                  <Reveal key={tier.name} delay={index * 70} className="h-full">
                    <article
                      className={`flex h-full flex-col rounded-[24px] border bg-white p-6 md:p-7 ${
                        featured
                          ? "border-[#D9A441]/50 shadow-[0_30px_90px_-64px_rgba(184,134,43,0.9)] ring-1 ring-[#D9A441]/25"
                          : "border-line"
                      }`}
                    >
                      <h3 className="text-[18px] font-extrabold text-dark">{tier.name}</h3>
                      <p className="hotel-figure mt-3 text-[26px] font-extrabold text-[#8A6316]">{tier.price}</p>
                      <p className="mt-3 border-b border-line pb-5 text-[14px] leading-relaxed text-muted">
                        {tier.forWhom}
                      </p>
                      <ul className="mt-5 grid gap-2.5">
                        {tier.items.map((item) => (
                          <li key={item} className="flex gap-2.5 text-[14.5px] leading-relaxed text-ink">
                            <Check size={16} className="mt-0.5 shrink-0 text-success" aria-hidden />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                );
              })}
            </div>
            <Reveal delay={100}>
              <p className="mt-7 max-w-3xl text-[13.5px] leading-relaxed text-muted">{content.packages.note}</p>
            </Reveal>
          </Container>
        </section>

        {/* ── EDITORIAL TRUST ──────────────────────────────────── */}
        <section className="bg-white py-16 md:py-20">
          <Container>
            <Reveal>
              <EditorialTrust locale={locale} id="hotel-editorial-trust-title" />
            </Reveal>
          </Container>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="eyebrow">{content.faq.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.faq.title}
              </h2>
            </Reveal>

            <div className="mx-auto mt-10 grid max-w-3xl gap-3">
              {content.faq.items.map((item, index) => (
                <Reveal key={item.q} delay={(index % 3) * 50}>
                  <details className="hotel-faq group rounded-[18px] border border-line bg-white" open={index === 0}>
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 md:p-6">
                      <h3 className="text-[16.5px] font-extrabold leading-snug text-dark">
                        <BrandText text={item.q} />
                      </h3>
                      <span
                        aria-hidden
                        className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[7px] bg-surface text-brand-purple transition-transform group-open:rotate-45 group-open:bg-brand group-open:text-white"
                      >
                        +
                      </span>
                    </summary>
                    <p className="px-5 pb-5 text-[15px] leading-relaxed text-muted md:px-6 md:pb-6">
                      <BrandText text={item.a} />
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* ── RELATED ──────────────────────────────────────────── */}
        <section className="py-16 md:py-20">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.related.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(24px,3.2vw,36px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.related.title}
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {content.related.links.map((link, index) => (
                <Reveal key={link.href} delay={(index % 3) * 60} className="h-full">
                  <a
                    href={link.href}
                    className="group flex h-full flex-col rounded-[20px] border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/30 hover:shadow-[0_22px_70px_-54px_rgba(139,92,246,0.74)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[16.5px] font-extrabold text-dark">{link.label}</h3>
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-purple transition-transform group-hover:translate-x-0.5">
                        <ArrowRight size={15} aria-hidden />
                      </span>
                    </div>
                    <p className="mt-2.5 text-[14px] leading-relaxed text-muted">{link.description}</p>
                  </a>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────── */}
        <section className="pb-20 md:pb-24">
          <Container>
            <Reveal>
              <div className="hotel-night relative overflow-hidden rounded-[28px] p-8 text-center md:p-14">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,164,65,0.22),transparent_40%),radial-gradient(circle_at_88%_100%,rgba(139,92,246,0.26),transparent_38%)]"
                />
                <div className="relative mx-auto max-w-2xl">
                  <h2 className="text-[clamp(25px,3.6vw,44px)] font-extrabold leading-[1.08] tracking-[-0.025em] text-white">
                    {content.final.title}
                  </h2>
                  <p className="mx-auto mt-5 text-[16px] leading-relaxed text-white/65">{content.final.text}</p>
                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <a
                      href={contactHref}
                      className="btn-shine inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5"
                    >
                      {content.final.primary}
                      <ArrowRight size={17} aria-hidden />
                    </a>
                    <a
                      href={auditHref}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.16] bg-white/[0.08] px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/[0.32]"
                    >
                      {content.final.secondary}
                    </a>
                  </div>
                  <p className="mx-auto mt-6 max-w-lg text-[13px] leading-relaxed text-white/45">
                    {content.final.assurance}
                  </p>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </LocaleSlugsProvider>
  );
}

/** Underlines the accent phrase inside the H1 with the brass rule. */
function Accented({ text, accent }: { text: string; accent: string }) {
  const parts = text.split(accent);
  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 ? <span className="hotel-underline">{accent}</span> : null}
        </Fragment>
      ))}
    </>
  );
}

function BookingBarMock({ bar }: { bar: HotelLandingContent["bookingBar"] }) {
  const fields = [
    { label: bar.arrival, value: bar.arrivalValue, Icon: CalendarDays },
    { label: bar.departure, value: bar.departureValue, Icon: CalendarDays },
    { label: bar.guests, value: bar.guestsValue, Icon: Users },
  ];

  return (
    <div className="hotel-night relative overflow-hidden rounded-[28px] p-5 shadow-[0_40px_110px_-60px_rgba(12,20,36,0.9)] md:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(217,164,65,0.22),transparent_42%),radial-gradient(circle_at_100%_100%,rgba(139,92,246,0.22),transparent_40%)]"
      />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D9A441]/35 bg-[#D9A441]/10 px-3 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#E8C071]">
            {bar.badge}
          </span>
          <span className="font-mono text-[11px] text-white/35">saaleweb.de</span>
        </div>

        <div className="mt-5 grid gap-2.5" aria-hidden>
          {fields.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-white/[0.10] bg-white/[0.05] px-4 py-3"
            >
              <Icon size={17} className="shrink-0 text-[#E8C071]" />
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">{label}</p>
                <p className="mt-0.5 text-[14.5px] font-semibold text-white">{value}</p>
              </div>
            </div>
          ))}
          <a
            href={HOTEL_BOOKING_PREVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hotel-brass-card group mt-1 flex min-h-[58px] items-center justify-between gap-4 rounded-2xl px-4 py-3 text-[#241906] outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#101827]"
          >
            <span className="min-w-0">
              <span className="block text-[15px] font-bold">{bar.submit}</span>
              <span className="mt-0.5 block text-[10.5px] font-semibold leading-snug text-[#493514]/70">
                {bar.previewHint}
              </span>
            </span>
            <ExternalLink
              size={17}
              className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/[0.10] pt-5">
          <div>
            <p className="text-[13.5px] text-white/55">{bar.rateLabel}</p>
            <p className="hotel-figure mt-1 text-[26px] font-extrabold text-white">{bar.rateValue}</p>
          </div>
          <p className="max-w-[190px] text-right text-[11.5px] leading-relaxed text-white/35">{bar.rateHint}</p>
        </div>

        <p className="mt-5 flex gap-2.5 rounded-2xl bg-white/[0.05] p-4 text-[13.5px] leading-relaxed text-white/70">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#E8C071]" aria-hidden />
          {bar.note}
        </p>
      </div>
    </div>
  );
}

function RoomPageMock({ mock }: { mock: HotelLandingContent["roomPage"]["mock"] }) {
  return (
    <div className="rounded-[26px] border border-line bg-white p-5 shadow-card md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-purple">
            {mock.category}
          </p>
          <h3 className="mt-2 text-[22px] font-extrabold tracking-[-0.02em] text-dark">{mock.name}</h3>
          <p className="mt-1.5 text-[14px] text-muted">
            {mock.size} · {mock.occupancy}
          </p>
        </div>
        <span className="hotel-marker shrink-0">A</span>
      </div>

      <div className="relative mt-5">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[18px] border border-line bg-surface">
          <Image
            src="/images/industries/hotel-comfort-room.webp"
            alt={mock.imageAlt}
            fill
            sizes="(max-width: 640px) calc(100vw - 80px), (max-width: 1023px) calc(100vw - 112px), 560px"
            className="object-cover"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/25"
          />
        </div>
        <span className="hotel-marker absolute -right-2 -top-2">B</span>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-5">
        <div>
          <p className="hotel-figure text-[24px] font-extrabold text-dark">{mock.price}</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{mock.priceNote}</p>
        </div>
        <span className="hotel-marker shrink-0">C</span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <ul className="flex flex-wrap gap-2">
          {mock.amenities.map((amenity) => (
            <li
              key={amenity}
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-ink"
            >
              {amenity}
            </li>
          ))}
        </ul>
        <span className="hotel-marker shrink-0">D</span>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span
          aria-hidden
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-[14.5px] font-bold text-white"
        >
          {mock.cta}
          <ArrowRight size={16} />
        </span>
        <span className="hotel-marker shrink-0">E</span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4 rounded-[18px] bg-surface p-4">
        <div className="grid gap-1.5 text-[13px] leading-relaxed">
          <span className="text-muted">{mock.cancellation}</span>
          <span className="font-semibold text-[#8A6316]">{mock.perk}</span>
        </div>
        <span className="hotel-marker shrink-0">F</span>
      </div>
    </div>
  );
}
