import { Fragment } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CalendarCheck,
  Check,
  Clock,
  Languages,
  Link2,
  MessageCircleOff,
  Minus,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import salonElenDesktop from "@/assets/industry-premium/beauty/salon-elen-desktop.webp";
import salonElenMobile from "@/assets/industry-premium/beauty/salon-elen-mobile.webp";
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
import { BookingFlowDemo } from "./BookingFlowDemo";
import type { BeautyLandingContent } from "./types";

type Props = {
  content: BeautyLandingContent;
  locale: AppLocale;
  path: string;
  parent: { name: string; href: Crumb["href"]; path: string };
  homeLabel: string;
  localeSlugs: Phase4SlugMap;
};

export function BeautyLandingPage({
  content,
  locale,
  path,
  parent,
  homeLabel,
  localeSlugs,
}: Props) {
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

      <main className="bty-page">
        <Breadcrumbs
          items={[
            { name: homeLabel, href: "/" },
            { name: parent.name, href: parent.href },
            { name: content.h1 },
          ]}
        />

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pb-16 pt-8 md:pb-24 md:pt-12">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_4%,rgba(181,82,122,0.10),transparent_32%),radial-gradient(circle_at_92%_0%,rgba(139,92,246,0.12),transparent_34%),linear-gradient(180deg,#fff_0%,#fdf8fa_100%)]" />
          </div>
          <Container>
            <div className="grid min-w-0 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
              <div className="hero-stagger min-w-0">
                <span className="eyebrow">{content.eyebrow}</span>
                <h1 className="mt-4 break-words text-[clamp(31px,5vw,56px)] font-extrabold leading-[1.06] tracking-[-0.025em] text-dark">
                  <Accented text={content.h1} accent={content.h1Accent} />
                </h1>
                <p className="mt-6 max-w-xl break-words text-[clamp(16.5px,1.7vw,19px)] leading-relaxed text-muted">
                  <BrandText text={content.lead} />
                </p>

                <ul className="mt-7 grid gap-2.5">
                  {content.heroPoints.map((point) => (
                    <li key={point} className="flex min-w-0 items-start gap-2.5 break-words text-[15px] text-ink">
                      <Check size={17} className="mt-0.5 shrink-0 text-[#B5527A]" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Magnetic>
                    <a
                      href={contactHref}
                      className="btn-shine group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(255,79,163,0.72)] transition-all hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      {content.ctaPrimary}
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                        aria-hidden
                      />
                    </a>
                  </Magnetic>
                  <Magnetic>
                    <a
                      href={auditHref}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white px-6 py-3.5 text-[15px] font-semibold text-dark shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-purple hover:text-brand-purple motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      {content.ctaSecondary}
                    </a>
                  </Magnetic>
                </div>
              </div>

              <Reveal direction="zoom" delay={80}>
                <AppointmentCardMock card={content.heroCard} />
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ── DIRECT ANSWER (GEO / AIO) ────────────────────────── */}
        <section className="border-y border-line bg-white py-12 md:py-16" aria-labelledby="bty-answer">
          <Container>
            <Reveal>
              <div className="grid min-w-0 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
                <div className="min-w-0">
                  <span className="eyebrow">{content.answer.eyebrow}</span>
                  <h2
                    id="bty-answer"
                    className="mt-4 break-words text-[clamp(23px,2.9vw,33px)] font-extrabold leading-tight tracking-[-0.02em] text-dark"
                  >
                    {content.answer.question}
                  </h2>
                  <p className="mt-4 break-words text-[16px] leading-relaxed text-ink">
                    <BrandText text={content.answer.text} />
                  </p>
                </div>
                <dl className="grid min-w-0 gap-3 sm:grid-cols-2">
                  {content.answer.facts.map((fact) => (
                    <div key={fact.label} className="min-w-0 rounded-2xl border border-line bg-surface p-4">
                      <dt className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-purple">
                        {fact.label}
                      </dt>
                      <dd className="mt-2 break-words text-[14px] font-semibold leading-relaxed text-ink">
                        <BrandText text={fact.value} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* ── THE PROBLEM ──────────────────────────────────────── */}
        <section className="py-16 md:py-24" aria-labelledby="bty-problem-title">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.problem.eyebrow}</span>
              <h2
                id="bty-problem-title"
                className="mt-4 break-words text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark"
              >
                {content.problem.title}
              </h2>
              <p className="mt-5 break-words text-[16.5px] leading-relaxed text-muted">
                {content.problem.intro}
              </p>
            </Reveal>

            <div className="mt-10 grid min-w-0 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {content.problem.items.map((item, index) => (
                <Reveal key={item.title} delay={(index % 3) * 60} className="h-full">
                  <article className="h-full min-w-0 rounded-[20px] border border-line bg-surface p-6">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#B5527A]/10 text-[#B5527A]">
                      <MessageCircleOff size={19} aria-hidden />
                    </span>
                    <h3 className="mt-4 break-words text-[16px] font-extrabold leading-snug text-dark">
                      {item.title}
                    </h3>
                    <p className="mt-2 break-words text-[14.5px] leading-relaxed text-muted">{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={100}>
              <p className="mx-auto mt-8 max-w-3xl break-words border-l-2 border-[#B5527A] pl-5 text-[16px] leading-relaxed text-ink">
                {content.problem.conclusion}
              </p>
            </Reveal>
          </Container>
        </section>

        {/* ── SIGNATURE: THE BOOKING FLOW ──────────────────────── */}
        <section
          className="bty-night relative overflow-hidden py-16 md:py-24"
          aria-labelledby="bty-booking-title"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_-8%,rgba(181,82,122,0.30),transparent_38%),radial-gradient(circle_at_0%_100%,rgba(139,92,246,0.22),transparent_36%)]"
          />
          <Container className="relative min-w-0">
            <div className="min-w-0 max-w-3xl">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#F0BFCF]">
                {content.booking.eyebrow}
              </span>
              <h2
                id="bty-booking-title"
                className="mt-4 break-words text-[clamp(28px,4vw,46px)] font-extrabold leading-[1.06] tracking-[-0.025em] text-white"
              >
                {content.booking.title}
              </h2>
              <p className="mt-5 break-words text-[16px] leading-relaxed text-white/60">
                {content.booking.intro}
              </p>
            </div>

            <div className="mt-10">
              <BookingFlowDemo copy={content.booking} ctaHref={contactHref} />
            </div>
          </Container>
        </section>

        {/* ── TREATMENT PAGE STRUCTURE ─────────────────────────── */}
        <section className="py-16 md:py-24" aria-labelledby="bty-structure-title">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.structure.eyebrow}</span>
              <h2
                id="bty-structure-title"
                className="mt-4 break-words text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark"
              >
                {content.structure.title}
              </h2>
              <p className="mt-5 break-words text-[16.5px] leading-relaxed text-muted">
                {content.structure.intro}
              </p>
            </Reveal>

            <div className="mt-10 grid min-w-0 gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:gap-6">
              <Reveal className="h-full">
                <article className="h-full min-w-0 rounded-[24px] border border-line bg-surface p-6 md:p-7">
                  <h3 className="break-words text-[17px] font-extrabold text-dark">
                    {content.structure.badTitle}
                  </h3>
                  <p className="mt-1.5 break-words text-[13.5px] text-muted">{content.structure.badNote}</p>
                  <ul className="mt-5 grid gap-2.5">
                    {content.structure.badItems.map((item) => (
                      <li key={item} className="flex gap-2.5 break-words text-[14.5px] leading-relaxed text-muted">
                        <Minus size={16} className="mt-1 shrink-0 text-line" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>

              <Reveal delay={80} className="h-full">
                <article className="h-full min-w-0 rounded-[24px] border border-[#B5527A]/25 bg-white p-6 shadow-[0_30px_90px_-64px_rgba(181,82,122,0.9)] md:p-7">
                  <h3 className="break-words text-[17px] font-extrabold text-dark">
                    {content.structure.goodTitle}
                  </h3>
                  <p className="mt-1.5 break-words text-[13.5px] text-muted">{content.structure.goodNote}</p>
                  <ul className="mt-5 grid gap-2">
                    {content.structure.goodItems.map((item) => (
                      <li key={item.slug} className="bty-url">
                        <Link2 size={14} className="shrink-0 text-[#B5527A]" aria-hidden />
                        <code className="min-w-0 break-all font-mono text-[12.5px] text-[#3A1B2A]">
                          /{item.slug}
                        </code>
                        <span className="ml-auto hidden shrink-0 items-center gap-2 sm:flex">
                          <span className="text-[12.5px] text-muted">{item.label}</span>
                          <span className="bty-figure text-[12.5px] font-bold text-[#B5527A]">{item.price}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <p className="mx-auto mt-8 max-w-3xl break-words border-l-2 border-[#B5527A] pl-5 text-[16px] leading-relaxed text-ink">
                {content.structure.conclusion}
              </p>
            </Reveal>
          </Container>
        </section>

        {/* ── SERVICE CARD ANATOMY ─────────────────────────────── */}
        <section className="bg-surface py-16 md:py-24" aria-labelledby="bty-card-title">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.card.eyebrow}</span>
              <h2
                id="bty-card-title"
                className="mt-4 break-words text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark"
              >
                {content.card.title}
              </h2>
              <p className="mt-5 break-words text-[16.5px] leading-relaxed text-muted">{content.card.intro}</p>
            </Reveal>

            <div className="mt-12 grid min-w-0 gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
              <Reveal>
                <ServiceCardMock mock={content.card.mock} />
              </Reveal>
              <Reveal delay={90}>
                <ol className="grid min-w-0 gap-3">
                  {content.card.callouts.map((callout) => (
                    <li
                      key={callout.key}
                      className="flex min-w-0 gap-4 rounded-[18px] border border-line bg-white p-5"
                    >
                      <span className="bty-marker shrink-0">{callout.key}</span>
                      <div className="min-w-0">
                        <h3 className="break-words text-[16px] font-extrabold text-dark">{callout.title}</h3>
                        <p className="mt-1.5 break-words text-[14.5px] leading-relaxed text-muted">
                          {callout.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ── LIVE PROOF ───────────────────────────────────────── */}
        <section
          id="beauty-references"
          className="bty-night relative overflow-hidden py-16 md:py-24"
          aria-labelledby="bty-proof-title"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_-6%,rgba(181,82,122,0.28),transparent_38%),radial-gradient(circle_at_0%_100%,rgba(255,79,163,0.16),transparent_36%)]"
          />
          <Container className="relative min-w-0">
            <div className="min-w-0 max-w-3xl">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#F0BFCF]">
                {content.proofs.eyebrow}
              </span>
              <h2
                id="bty-proof-title"
                className="mt-4 break-words text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.08] tracking-[-0.025em] text-white"
              >
                {content.proofs.title}
              </h2>
              <p className="mt-5 break-words text-[16px] leading-relaxed text-white/60">
                {content.proofs.intro}
              </p>
            </div>

            <div className="mt-10 grid min-w-0 gap-5">
              {content.proofs.items.map((proof) => (
                <article
                  key={proof.name}
                  className="grid min-w-0 gap-8 rounded-[26px] border border-white/[0.10] bg-white/[0.04] p-5 sm:p-6 md:p-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:gap-10"
                >
                  <div className="min-w-0">
                    <h3 className="break-words text-[clamp(19px,2.2vw,25px)] font-extrabold tracking-[-0.02em] text-white">
                      {proof.name}
                    </h3>
                    <p className="mt-3 break-words text-[15px] leading-relaxed text-white/65">{proof.text}</p>

                    <ul className="mt-6 grid min-w-0 gap-2.5 border-t border-white/[0.10] pt-5">
                      {proof.stats.map((stat) => (
                        <li
                          key={stat}
                          className="flex min-w-0 gap-2.5 break-words text-[14.5px] leading-relaxed text-white/80"
                        >
                          <Check size={16} className="mt-0.5 shrink-0 text-[#F0BFCF]" aria-hidden />
                          {stat}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={proof.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#B5527A] px-5 py-3 text-[14.5px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#C9628C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0BFCF] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                      >
                        {content.proofs.live}
                        <ArrowUpRight
                          size={16}
                          className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                          aria-hidden
                        />
                      </a>
                      {proof.projectHref ? (
                        <a
                          href={proof.projectHref}
                          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[0.18] bg-white/[0.06] px-5 py-3 text-[14.5px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/[0.32] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                        >
                          {content.proofs.caseLabel}
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {proof.media?.key === "salon-elen-projects" ? (
                    <figure className="relative order-first min-w-0 pb-10 sm:pb-14 lg:order-none">
                      <div className="overflow-hidden rounded-[18px] border border-white/[0.14] bg-[#21151c] shadow-[0_28px_70px_rgba(0,0,0,0.32)]">
                        <div className="flex h-8 items-center gap-1.5 border-b border-white/[0.10] bg-white/[0.07] px-3">
                          <span aria-hidden className="h-2 w-2 rounded-full bg-[#FF8CA6]" />
                          <span aria-hidden className="h-2 w-2 rounded-full bg-[#F4C76D]" />
                          <span aria-hidden className="h-2 w-2 rounded-full bg-[#76D8AA]" />
                          <span className="ml-2 truncate font-mono text-[9.5px] text-white/45">
                            permanent-halle.de
                          </span>
                        </div>
                        <div className="relative aspect-[16/9] min-w-0 overflow-hidden bg-[#ead8dc]">
                          <Image
                            src={salonElenDesktop}
                            alt={proof.media.primaryAlt}
                            fill
                            className="object-cover object-top"
                            sizes="(min-width: 1024px) 50vw, 100vw"
                          />
                        </div>
                      </div>

                      <div className="absolute bottom-1 right-3 w-[24%] min-w-[76px] max-w-[126px] overflow-hidden rounded-[17px] border-[4px] border-[#2A1922] bg-[#fdf7f8] shadow-[0_20px_45px_rgba(0,0,0,0.4)] sm:right-5">
                        <div aria-hidden className="absolute left-1/2 top-1 z-10 h-1.5 w-7 -translate-x-1/2 rounded-full bg-[#2A1922]" />
                        <div className="relative aspect-[9/18] overflow-hidden">
                          <Image
                            src={salonElenMobile}
                            alt={proof.media.secondaryAlt}
                            fill
                            className="object-cover object-top"
                            sizes="126px"
                          />
                        </div>
                      </div>

                      <figcaption className="mt-3 max-w-[72%] break-words text-[12.5px] leading-relaxed text-white/45">
                        {proof.media.caption}
                      </figcaption>
                    </figure>
                  ) : null}
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* ── JOURNEY ──────────────────────────────────────────── */}
        <section className="py-16 md:py-24" aria-labelledby="bty-journey-title">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.journey.eyebrow}</span>
              <h2
                id="bty-journey-title"
                className="mt-4 break-words text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark"
              >
                {content.journey.title}
              </h2>
              <p className="mt-5 break-words text-[16.5px] leading-relaxed text-muted">
                {content.journey.intro}
              </p>
            </Reveal>

            <Reveal className="mt-12">
              <ol className="grid min-w-0 gap-0">
                {content.journey.steps.map((step, index) => (
                  <li key={step.phase} className="bty-rail grid min-w-0 gap-5 py-7 md:grid-cols-[auto_1fr] md:gap-8">
                    <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
                      <span className="bty-figure grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#B5527A]/30 bg-[#B5527A]/[0.08] text-[15px] font-extrabold text-[#A2416A]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="break-words text-[17px] font-extrabold tracking-[-0.01em] text-dark md:w-[128px]">
                        {step.phase}
                      </p>
                    </div>
                    <div className="grid min-w-0 gap-5 md:grid-cols-2 md:gap-8">
                      <div className="min-w-0">
                        <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted">
                          {content.journey.guestLabel}
                        </p>
                        <p className="mt-2 break-words text-[15px] leading-relaxed text-muted">{step.guest}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-purple">
                          {content.journey.siteLabel}
                        </p>
                        <p className="mt-2 break-words text-[15px] leading-relaxed text-ink">{step.site}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </Container>
        </section>

        {/* ── SCOPE ────────────────────────────────────────────── */}
        <section className="bg-surface py-16 md:py-24" aria-labelledby="bty-build-title">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.build.eyebrow}</span>
              <h2
                id="bty-build-title"
                className="mt-4 break-words text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark"
              >
                {content.build.title}
              </h2>
              <p className="mt-5 break-words text-[16.5px] leading-relaxed text-muted">{content.build.intro}</p>
            </Reveal>

            <div className="mt-10 grid min-w-0 gap-x-8 gap-y-1 md:grid-cols-2 lg:grid-cols-3">
              {content.build.items.map((item, index) => (
                <Reveal key={item.title} delay={(index % 3) * 60} className="h-full">
                  <article className="h-full min-w-0 border-t border-line py-6">
                    <h3 className="flex items-start gap-2.5 break-words text-[16.5px] font-extrabold text-dark">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B5527A]" />
                      {item.title}
                    </h3>
                    <p className="mt-2 break-words pl-4 text-[14.5px] leading-relaxed text-muted">{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* ── OPTIONAL AI ASSISTANT ───────────────────────────── */}
        <section
          id="beauty-ai-assistant"
          className="relative overflow-hidden border-y border-white/[0.08] bg-[#111827] py-16 md:py-24"
          aria-labelledby="bty-assistant-title"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#B5527A]/20 blur-3xl" />
            <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-brand-purple/20 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="grid min-w-0 gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-12">
              <Reveal className="min-w-0">
                <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#F0BFCF]">
                  <Sparkles size={14} aria-hidden />
                  {content.assistant.eyebrow}
                </span>
                <h2
                  id="bty-assistant-title"
                  className="mt-4 break-words text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.08] tracking-[-0.025em] text-white"
                >
                  {content.assistant.title}
                </h2>
                <p className="mt-5 max-w-2xl break-words text-[16px] leading-relaxed text-white/65">
                  {content.assistant.intro}
                </p>

                <div className="mt-7 rounded-[18px] border border-[#F0BFCF]/20 bg-[#F0BFCF]/[0.07] p-5">
                  <p className="flex min-w-0 gap-3 break-words text-[14px] leading-relaxed text-white/70">
                    <ShieldCheck size={19} className="mt-0.5 shrink-0 text-[#F0BFCF]" aria-hidden />
                    {content.assistant.guardrail}
                  </p>
                </div>

                <p className="mt-5 break-words text-[13.5px] leading-relaxed text-white/45">
                  {content.assistant.pricing}
                </p>

                <div className="mt-7">
                  <Magnetic>
                    <a
                      href={contactHref}
                      className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple px-6 py-3.5 text-center text-[14.5px] font-bold text-white shadow-[0_14px_35px_rgba(255,79,163,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(255,79,163,0.34)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0BFCF] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      {content.assistant.cta}
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                        aria-hidden
                      />
                    </a>
                  </Magnetic>
                </div>
              </Reveal>

              <Reveal delay={90} className="min-w-0">
                <div className="min-w-0 rounded-[28px] border border-white/[0.12] bg-white/[0.07] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:p-6">
                  <div className="flex min-w-0 items-center gap-3 border-b border-white/[0.10] pb-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#F38BB3] to-brand-purple text-white shadow-[0_10px_25px_rgba(181,82,122,0.3)]">
                      <Bot size={22} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-extrabold text-white">SaaleWeb AI</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-white/45">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {content.assistant.eyebrow}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2">
                    {content.assistant.items.map((item, index) => (
                      <article
                        key={item.title}
                        className="min-w-0 rounded-[18px] border border-white/[0.10] bg-[#0B1220]/55 p-4 sm:p-5"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.08] text-[#F0BFCF]">
                          {index === 0 ? <Clock size={18} aria-hidden /> : null}
                          {index === 1 ? <Languages size={18} aria-hidden /> : null}
                          {index === 2 ? <CalendarCheck size={18} aria-hidden /> : null}
                          {index === 3 ? <ShieldCheck size={18} aria-hidden /> : null}
                        </span>
                        <h3 className="mt-4 break-words text-[15.5px] font-extrabold text-white">{item.title}</h3>
                        <p className="mt-2 break-words text-[13.5px] leading-relaxed text-white/55">{item.text}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ── VISIBILITY: SEO / GEO / AIO ──────────────────────── */}
        <section className="py-16 md:py-24" aria-labelledby="bty-visibility-title">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.visibility.eyebrow}</span>
              <h2
                id="bty-visibility-title"
                className="mt-4 break-words text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark"
              >
                {content.visibility.title}
              </h2>
              <p className="mt-5 break-words text-[16.5px] leading-relaxed text-muted">
                {content.visibility.intro}
              </p>
            </Reveal>

            <div className="mt-10 grid min-w-0 gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
              <Reveal>
                <div className="min-w-0 rounded-[24px] border border-line bg-white p-6 shadow-card md:p-7">
                  <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-purple">
                    {content.visibility.promptsLabel}
                  </p>
                  <ul className="mt-5 grid gap-2.5">
                    {content.visibility.prompts.map((prompt) => (
                      <li key={prompt} className="bty-prompt">
                        <Search size={15} className="shrink-0 text-brand-purple" aria-hidden />
                        <span className="min-w-0 break-words">{prompt}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 break-words border-t border-line pt-5 text-[14px] leading-relaxed text-muted">
                    {content.visibility.promptsNote}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={90}>
                <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                  {content.visibility.signals.map((signal) => (
                    <article
                      key={signal.title}
                      className="min-w-0 rounded-[20px] border border-line bg-white p-5"
                    >
                      <h3 className="break-words text-[15.5px] font-extrabold text-dark">{signal.title}</h3>
                      <p className="mt-2 break-words text-[14px] leading-relaxed text-muted">{signal.text}</p>
                    </article>
                  ))}
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ── TRUST ────────────────────────────────────────────── */}
        <section className="bg-surface py-16 md:py-24" aria-labelledby="bty-trust-title">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.trust.eyebrow}</span>
              <h2
                id="bty-trust-title"
                className="mt-4 break-words text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark"
              >
                {content.trust.title}
              </h2>
              <p className="mt-5 break-words text-[16.5px] leading-relaxed text-muted">{content.trust.intro}</p>
            </Reveal>

            <div className="mt-10 grid min-w-0 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {content.trust.items.map((item, index) => (
                <Reveal key={item.title} delay={(index % 3) * 60} className="h-full">
                  <article className="card-border-glow h-full min-w-0 rounded-[20px] border border-line bg-white p-6">
                    <h3 className="break-words text-[16px] font-extrabold text-dark">{item.title}</h3>
                    <p className="mt-2 break-words text-[14.5px] leading-relaxed text-muted">{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={90}>
              <div className="mt-8 flex min-w-0 gap-4 rounded-[20px] border border-[#B5527A]/25 bg-[#B5527A]/[0.06] p-5 md:p-6">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#B5527A]" aria-hidden />
                <p className="break-words text-[15px] leading-relaxed text-ink">{content.trust.note}</p>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* ── LEGAL ────────────────────────────────────────────── */}
        <section className="py-16 md:py-24" aria-labelledby="bty-legal-title">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.legal.eyebrow}</span>
              <h2
                id="bty-legal-title"
                className="mt-4 break-words text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark"
              >
                {content.legal.title}
              </h2>
            </Reveal>

            <div className="mt-9 grid min-w-0 gap-5 md:grid-cols-2">
              {content.legal.items.map((item, index) => (
                <Reveal key={item.title} delay={(index % 2) * 70} className="h-full">
                  <article className="h-full min-w-0 rounded-[20px] border border-line bg-surface p-6">
                    <h3 className="break-words text-[16px] font-extrabold text-dark">{item.title}</h3>
                    <p className="mt-2 break-words text-[14.5px] leading-relaxed text-muted">{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
            <Reveal delay={90}>
              <p className="mt-7 max-w-3xl break-words text-[14.5px] leading-relaxed text-muted">
                {content.legal.note}
              </p>
            </Reveal>
          </Container>
        </section>

        {/* ── PACKAGES ─────────────────────────────────────────── */}
        <section className="bg-surface py-16 md:py-24" aria-labelledby="bty-packages-title">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.packages.eyebrow}</span>
              <h2
                id="bty-packages-title"
                className="mt-4 break-words text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark"
              >
                {content.packages.title}
              </h2>
              <p className="mt-5 break-words text-[16.5px] leading-relaxed text-muted">
                {content.packages.intro}
              </p>
            </Reveal>

            <div className="mt-10 grid min-w-0 gap-5 md:grid-cols-3">
              {content.packages.tiers.map((tier, index) => {
                const featured = index === 1;
                return (
                  <Reveal key={tier.name} delay={index * 70} className="h-full">
                    <article
                      className={`flex h-full min-w-0 flex-col rounded-[24px] border bg-white p-6 md:p-7 ${
                        featured
                          ? "border-[#B5527A]/45 shadow-[0_30px_90px_-64px_rgba(181,82,122,0.9)] ring-1 ring-[#B5527A]/20"
                          : "border-line"
                      }`}
                    >
                      <h3 className="break-words text-[18px] font-extrabold text-dark">{tier.name}</h3>
                      <p className="bty-figure mt-3 text-[26px] font-extrabold text-[#A2416A]">{tier.price}</p>
                      <p className="mt-3 break-words border-b border-line pb-5 text-[14px] leading-relaxed text-muted">
                        {tier.forWhom}
                      </p>
                      <ul className="mt-5 grid gap-2.5">
                        {tier.items.map((item) => (
                          <li
                            key={item}
                            className="flex min-w-0 gap-2.5 break-words text-[14.5px] leading-relaxed text-ink"
                          >
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
              <p className="mt-7 max-w-3xl break-words text-[13.5px] leading-relaxed text-muted">
                {content.packages.note}
              </p>
            </Reveal>
          </Container>
        </section>

        {/* ── EDITORIAL TRUST ──────────────────────────────────── */}
        <section className="bg-white py-16 md:py-20">
          <Container>
            <Reveal>
              <EditorialTrust locale={locale} id="beauty-editorial-trust-title" />
            </Reveal>
          </Container>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="bg-surface py-16 md:py-24" aria-labelledby="bty-faq-title">
          <Container>
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="eyebrow">{content.faq.eyebrow}</span>
              <h2
                id="bty-faq-title"
                className="mt-4 break-words text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark"
              >
                {content.faq.title}
              </h2>
            </Reveal>

            <div className="mx-auto mt-10 grid min-w-0 max-w-3xl gap-3">
              {content.faq.items.map((item, index) => (
                <Reveal key={item.q} delay={(index % 3) * 50}>
                  <details className="bty-faq group min-w-0 rounded-[18px] border border-line bg-white" open={index === 0}>
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 md:p-6">
                      <h3 className="break-words text-[16.5px] font-extrabold leading-snug text-dark">
                        <BrandText text={item.q} />
                      </h3>
                      <span
                        aria-hidden
                        className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[7px] bg-surface text-brand-purple transition-transform group-open:rotate-45 group-open:bg-brand group-open:text-white motion-reduce:transition-none"
                      >
                        +
                      </span>
                    </summary>
                    <p className="break-words px-5 pb-5 text-[15px] leading-relaxed text-muted md:px-6 md:pb-6">
                      <BrandText text={item.a} />
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* ── RELATED ──────────────────────────────────────────── */}
        <section className="py-16 md:py-20" aria-labelledby="bty-related-title">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.related.eyebrow}</span>
              <h2
                id="bty-related-title"
                className="mt-4 break-words text-[clamp(24px,3.2vw,36px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark"
              >
                {content.related.title}
              </h2>
            </Reveal>
            <div className="mt-8 grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {content.related.links.map((link, index) => (
                <Reveal key={link.href} delay={(index % 3) * 60} className="h-full">
                  <a
                    href={link.href}
                    className="group flex h-full min-w-0 flex-col rounded-[20px] border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/30 hover:shadow-[0_22px_70px_-54px_rgba(139,92,246,0.74)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <h3 className="break-words text-[16.5px] font-extrabold text-dark">{link.label}</h3>
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-purple transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none">
                        <ArrowRight size={15} aria-hidden />
                      </span>
                    </div>
                    <p className="mt-2.5 break-words text-[14px] leading-relaxed text-muted">{link.description}</p>
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
              <div className="bty-night relative overflow-hidden rounded-[28px] p-8 text-center md:p-14">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(181,82,122,0.32),transparent_40%),radial-gradient(circle_at_88%_100%,rgba(139,92,246,0.24),transparent_38%)]"
                />
                <div className="relative mx-auto min-w-0 max-w-2xl">
                  <h2 className="break-words text-[clamp(23px,3.2vw,40px)] font-extrabold leading-[1.08] tracking-[-0.025em] text-white">
                    {content.final.title}
                  </h2>
                  <p className="mx-auto mt-5 break-words text-[16px] leading-relaxed text-white/60">
                    {content.final.text}
                  </p>
                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <a
                      href={contactHref}
                      className="btn-shine inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      {content.final.primary}
                      <ArrowRight size={17} aria-hidden />
                    </a>
                    <a
                      href={auditHref}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.16] bg-white/[0.08] px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/[0.32] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      {content.final.secondary}
                    </a>
                  </div>
                  <p className="mx-auto mt-6 max-w-lg break-words text-[13px] leading-relaxed text-white/45">
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

/** Underlines the accent phrase inside the H1 with the rose rule. */
function Accented({ text, accent }: { text: string; accent: string }) {
  const parts = text.split(accent);
  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 ? <span className="bty-underline">{accent}</span> : null}
        </Fragment>
      ))}
    </>
  );
}

function AppointmentCardMock({ card }: { card: BeautyLandingContent["heroCard"] }) {
  const rows = [
    { label: card.stylistLabel, value: card.stylist },
    { label: card.durationLabel, value: card.duration },
    { label: card.priceLabel, value: card.price, accent: true },
  ];

  return (
    <div className="bty-night relative min-w-0 overflow-hidden rounded-[28px] p-5 shadow-[0_40px_110px_-60px_rgba(26,15,30,0.9)] md:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(181,82,122,0.30),transparent_42%),radial-gradient(circle_at_100%_100%,rgba(139,92,246,0.22),transparent_40%)]"
      />
      <div className="relative min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#B5527A]/40 bg-[#B5527A]/[0.16] px-3 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#F0BFCF]">
            <Check size={12} aria-hidden />
            {card.badge}
          </span>
          <span className="font-mono text-[11px] text-white/35">{card.status}</span>
        </div>

        <p className="mt-6 break-words text-[clamp(22px,2.6vw,28px)] font-extrabold leading-tight tracking-[-0.02em] text-white">
          {card.service}
        </p>
        <p className="mt-2 flex items-center gap-2 text-[14.5px] text-[#F0BFCF]">
          <Clock size={15} aria-hidden />
          {card.when}
        </p>

        <dl className="mt-5 grid gap-0">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid gap-1 border-t border-white/[0.10] py-3 sm:grid-cols-[112px_1fr] sm:gap-4"
            >
              <dt className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/40">
                {row.label}
              </dt>
              <dd
                className={`break-words text-[14.5px] font-semibold leading-snug ${
                  row.accent ? "bty-figure text-[#F0BFCF]" : "text-white"
                }`}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 flex min-w-0 gap-2.5 rounded-2xl bg-white/[0.05] p-4 text-[13.5px] leading-relaxed text-white/70">
          <Check size={16} className="mt-0.5 shrink-0 text-[#F0BFCF]" aria-hidden />
          {card.channel}
        </p>
        <p className="mt-4 break-words text-[12px] leading-relaxed text-white/35">{card.footnote}</p>
      </div>
    </div>
  );
}

function ServiceCardMock({ mock }: { mock: BeautyLandingContent["card"]["mock"] }) {
  return (
    <div className="min-w-0 rounded-[26px] border border-line bg-white p-5 shadow-card md:p-6">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#A2416A]">
            {mock.category}
          </p>
          <h3 className="mt-2 break-words text-[22px] font-extrabold tracking-[-0.02em] text-dark">
            {mock.name}
          </h3>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px]">
            <span className="flex items-center gap-1.5 text-muted">
              <Clock size={14} aria-hidden />
              {mock.duration}
            </span>
            <span className="bty-figure text-[18px] font-extrabold text-[#A2416A]">{mock.price}</span>
          </p>
        </div>
        <span className="bty-marker shrink-0">A</span>
      </div>

      <div className="mt-5 flex min-w-0 items-start justify-between gap-4 border-t border-line pt-5">
        <p className="min-w-0 break-words text-[14.5px] leading-relaxed text-muted">{mock.description}</p>
        <span className="bty-marker shrink-0">B</span>
      </div>

      <div className="mt-5 flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#A2416A]">
            {mock.benefitsLabel}
          </p>
          <ul className="mt-2.5 grid gap-1.5">
            {mock.benefits.map((benefit) => (
              <li key={benefit} className="flex min-w-0 gap-2 break-words text-[13.5px] text-ink">
                <Check size={14} className="mt-0.5 shrink-0 text-success" aria-hidden />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <span className="bty-marker shrink-0">C</span>
      </div>

      <div className="mt-5 flex min-w-0 items-start justify-between gap-4 rounded-[16px] bg-surface p-4">
        <div className="min-w-0">
          <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted">
            {mock.aftercareLabel}
          </p>
          <p className="mt-1.5 break-words text-[13.5px] leading-relaxed text-ink">{mock.aftercare}</p>
        </div>
        <span className="bty-marker shrink-0">D</span>
      </div>

      <div className="mt-4 flex min-w-0 items-start justify-between gap-4 rounded-[16px] border border-[#B5527A]/20 bg-[#B5527A]/[0.05] p-4">
        <div className="min-w-0">
          <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#A2416A]">
            {mock.touchupLabel}
          </p>
          <p className="mt-1.5 break-words text-[13.5px] leading-relaxed text-ink">{mock.touchup}</p>
        </div>
        <span className="bty-marker shrink-0">E</span>
      </div>

      <div className="mt-5 flex min-w-0 items-center gap-3">
        <span
          aria-hidden
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-[14.5px] font-bold text-white"
        >
          {mock.cta}
          <ArrowRight size={16} />
        </span>
        <span className="bty-marker shrink-0">F</span>
      </div>
    </div>
  );
}
