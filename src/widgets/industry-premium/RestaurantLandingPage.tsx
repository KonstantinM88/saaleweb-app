import { Fragment } from "react";
import { ArrowRight, ArrowUpRight, Check, FileX2, ShieldCheck, Sparkles, Search } from "lucide-react";
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
import { MenuShowcase } from "./MenuShowcase";
import { RestaurantHeroMedia } from "./RestaurantHeroMedia";
import type { RestaurantLandingContent } from "./types";

type Props = {
  content: RestaurantLandingContent;
  locale: AppLocale;
  path: string;
  parent: { name: string; href: Crumb["href"]; path: string };
  homeLabel: string;
  localeSlugs: Phase4SlugMap;
};

export function RestaurantLandingPage({
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

      <main className="rest-page">
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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_6%,rgba(255,79,163,0.10),transparent_34%),radial-gradient(circle_at_90%_0%,rgba(139,92,246,0.12),transparent_32%),linear-gradient(180deg,#fff_0%,#f7f8fb_100%)]" />
          </div>
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
              <div className="hero-stagger">
                <span className="eyebrow">{content.eyebrow}</span>
                <h1 className="mt-4 text-[clamp(32px,5.2vw,58px)] font-extrabold leading-[1.05] tracking-[-0.025em] text-dark">
                  <Accented text={content.h1} accent={content.h1Accent} />
                </h1>
                <p className="mt-6 max-w-xl text-[clamp(16.5px,1.7vw,19px)] leading-relaxed text-muted">
                  <BrandText text={content.lead} />
                </p>

                <ul className="mt-7 grid gap-2.5">
                  {content.heroPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-[15px] text-ink">
                      <Check size={17} className="mt-0.5 shrink-0 text-[#A33B4E]" aria-hidden />
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
                <DishCardMock
                  card={content.heroCard}
                  videoLabel={content.menu.videoLabel}
                  closeVideoLabel={content.menu.closeVideoLabel}
                  videoUnsupported={content.menu.videoUnsupported}
                />
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ── DIRECT ANSWER (GEO / AIO) ────────────────────────── */}
        <section className="border-y border-line bg-white py-12 md:py-16" aria-labelledby="rest-answer">
          <Container>
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
                <div>
                  <span className="eyebrow">{content.answer.eyebrow}</span>
                  <h2
                    id="rest-answer"
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

        {/* ── THE PDF PROBLEM ──────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.pdfProblem.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.pdfProblem.title}
              </h2>
              <p className="mt-5 text-[16.5px] leading-relaxed text-muted">{content.pdfProblem.intro}</p>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {content.pdfProblem.problems.map((problem, index) => (
                <Reveal key={problem.title} delay={(index % 3) * 60} className="h-full">
                  <article className="h-full rounded-[20px] border border-line bg-surface p-6">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#A33B4E]/10 text-[#A33B4E]">
                      <FileX2 size={19} aria-hidden />
                    </span>
                    <h3 className="mt-4 text-[16px] font-extrabold text-dark">{problem.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{problem.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={100}>
              <p className="mx-auto mt-8 max-w-3xl border-l-2 border-[#A33B4E] pl-5 text-[16px] leading-relaxed text-ink">
                {content.pdfProblem.conclusion}
              </p>
            </Reveal>
          </Container>
        </section>

        {/* ── SIGNATURE: THE DIGITAL MENU ──────────────────────── */}
        <section className="rest-night relative overflow-hidden py-16 md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_-8%,rgba(194,90,110,0.24),transparent_38%),radial-gradient(circle_at_0%_100%,rgba(139,92,246,0.20),transparent_36%)]"
          />
          <Container className="relative">
            <div className="max-w-3xl">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#E3909F]">
                {content.menu.eyebrow}
              </span>
              <h2 className="mt-4 text-[clamp(28px,4vw,46px)] font-extrabold leading-[1.06] tracking-[-0.025em] text-white">
                {content.menu.title}
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-white/60">{content.menu.intro}</p>
            </div>

            <div className="mt-10">
              <MenuShowcase
                categories={content.menu.categories}
                categoriesLabel={content.menu.categoriesLabel}
                allergenLabel={content.menu.allergenLabel}
                demoLabel={content.menu.demoLabel}
                videoLabel={content.menu.videoLabel}
                closeVideoLabel={content.menu.closeVideoLabel}
                videoUnsupported={content.menu.videoUnsupported}
              />
            </div>

            <div className="mt-14">
              <h3 className="text-[clamp(20px,2.5vw,28px)] font-extrabold tracking-[-0.02em] text-white">
                {content.menu.featuresTitle}
              </h3>
              <div className="mt-7 grid gap-x-8 gap-y-1 md:grid-cols-2 lg:grid-cols-4">
                {content.menu.features.map((feature) => (
                  <article key={feature.title} className="border-t border-white/[0.12] py-5">
                    <h4 className="flex items-start gap-2.5 text-[15.5px] font-extrabold text-white">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C25A6E]" />
                      {feature.title}
                    </h4>
                    <p className="mt-2 pl-4 text-[13.5px] leading-relaxed text-white/55">{feature.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── LIVE PROOF: TWO REAL MENUS ───────────────────────── */}
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <Reveal className="max-w-3xl">
              <h2 className="text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.menu.proofTitle}
              </h2>
              <p className="mt-5 text-[16.5px] leading-relaxed text-muted">{content.menu.proofIntro}</p>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-2 md:gap-6">
              {content.menu.proofs.map((proof, index) => (
                <Reveal key={proof.name} delay={index * 80} className="h-full">
                  <article className="flex h-full flex-col rounded-[24px] border border-line bg-white p-6 shadow-card md:p-8">
                    <h3 className="text-[clamp(19px,2.2vw,24px)] font-extrabold tracking-[-0.02em] text-dark">
                      {proof.name}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">{proof.text}</p>

                    <ul className="mt-5 grid gap-2.5 border-t border-line pt-5">
                      {proof.stats.map((stat) => (
                        <li key={stat} className="flex gap-2.5 text-[14.5px] leading-relaxed text-ink">
                          <Check size={16} className="mt-0.5 shrink-0 text-[#A33B4E]" aria-hidden />
                          {stat}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-3 pt-1">
                      <a
                        href={proof.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#7E2A3C] px-5 py-3 text-[14.5px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#96334A]"
                      >
                        {content.menu.proofLive}
                        <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
                      </a>
                      <a
                        href={proof.projectHref}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-[14.5px] font-semibold text-dark transition-all hover:-translate-y-0.5 hover:border-brand-purple hover:text-brand-purple"
                      >
                        {content.menu.proofCase}
                      </a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* ── RESERVATION PATHS ────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.reservation.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.reservation.title}
              </h2>
              <p className="mt-5 text-[16.5px] leading-relaxed text-muted">{content.reservation.intro}</p>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {content.reservation.items.map((item, index) => (
                <Reveal key={item.title} delay={(index % 3) * 60} className="h-full">
                  <article className="card-border-glow h-full rounded-[20px] border border-line bg-white p-6">
                    <h3 className="text-[16px] font-extrabold text-dark">{item.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={80}>
              <div className="mt-8 flex gap-4 rounded-[20px] border border-[#A33B4E]/25 bg-[#A33B4E]/[0.06] p-5 md:p-6">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#A33B4E]" aria-hidden />
                <p className="text-[15px] leading-relaxed text-ink">{content.reservation.honesty}</p>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* ── GUEST JOURNEY ────────────────────────────────────── */}
        <section className="bg-surface py-16 md:py-24">
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
                    className="rest-rail grid gap-5 py-7 md:grid-cols-[auto_1fr] md:gap-8"
                  >
                    <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
                      <span className="rest-figure grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#A33B4E]/30 bg-[#A33B4E]/[0.08] text-[15px] font-extrabold text-[#8E2F43]">
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
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A33B4E]" />
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
                      <li key={prompt} className="rest-prompt">
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

        {/* ── EVENTS ───────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.events.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.events.title}
              </h2>
              <p className="mt-5 text-[16.5px] leading-relaxed text-muted">{content.events.intro}</p>
            </Reveal>

            <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {content.events.items.map((item, index) => (
                <Reveal key={item.title} delay={(index % 3) * 60} className="h-full">
                  <article className="h-full rounded-[20px] border border-line bg-white p-6 shadow-sm">
                    <h3 className="text-[16px] font-extrabold text-dark">{item.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
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

        {/* ── PACKAGES ─────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
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
                          ? "border-[#A33B4E]/45 shadow-[0_30px_90px_-64px_rgba(142,47,67,0.9)] ring-1 ring-[#A33B4E]/20"
                          : "border-line"
                      }`}
                    >
                      <h3 className="text-[18px] font-extrabold text-dark">{tier.name}</h3>
                      <p className="rest-figure mt-3 text-[26px] font-extrabold text-[#8E2F43]">{tier.price}</p>
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
              <EditorialTrust locale={locale} id="restaurant-editorial-trust-title" />
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
                  <details className="rest-faq group rounded-[18px] border border-line bg-white" open={index === 0}>
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
              <div className="rest-night relative overflow-hidden rounded-[28px] p-8 text-center md:p-14">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(194,90,110,0.26),transparent_40%),radial-gradient(circle_at_88%_100%,rgba(139,92,246,0.24),transparent_38%)]"
                />
                <div className="relative mx-auto max-w-2xl">
                  <h2 className="text-[clamp(24px,3.4vw,42px)] font-extrabold leading-[1.08] tracking-[-0.025em] text-white">
                    {content.final.title}
                  </h2>
                  <p className="mx-auto mt-5 text-[16px] leading-relaxed text-white/60">{content.final.text}</p>
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

/** Underlines the accent phrase inside the H1 with the wine-red rule. */
function Accented({ text, accent }: { text: string; accent: string }) {
  const parts = text.split(accent);
  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 ? <span className="rest-underline">{accent}</span> : null}
        </Fragment>
      ))}
    </>
  );
}

function DishCardMock({
  card,
  videoLabel,
  closeVideoLabel,
  videoUnsupported,
}: {
  card: RestaurantLandingContent["heroCard"];
  videoLabel: string;
  closeVideoLabel: string;
  videoUnsupported: string;
}) {
  return (
    <div className="rest-night relative overflow-hidden rounded-[28px] p-5 shadow-[0_40px_110px_-60px_rgba(22,16,15,0.9)] md:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(194,90,110,0.24),transparent_42%),radial-gradient(circle_at_100%_100%,rgba(139,92,246,0.20),transparent_40%)]"
      />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C25A6E]/35 bg-[#C25A6E]/12 px-3 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#E3909F]">
            {card.badge}
          </span>
          <span className="font-mono text-[11px] text-white/30">saaleweb.de</span>
        </div>

        <RestaurantHeroMedia
          image={card.image}
          imageAlt={card.imageAlt}
          video={card.video}
          title={card.name}
          videoLabel={videoLabel}
          closeVideoLabel={closeVideoLabel}
          videoUnsupported={videoUnsupported}
        />

        <p className="mt-5 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#E3909F]">
          {card.category}
        </p>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-[21px] font-extrabold leading-snug tracking-[-0.02em] text-white">{card.name}</h2>
          <p className="rest-figure text-[21px] font-extrabold text-[#E8B4BF]">{card.price}</p>
        </div>
        <p className="mt-2 text-[14px] leading-relaxed text-white/55">{card.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {card.badges.map((badge) => (
            <span key={badge} className="rest-badge">
              {badge}
            </span>
          ))}
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/35">
            {card.allergenLabel}: {card.allergens}
          </span>
        </div>

        <p className="mt-5 flex gap-2.5 rounded-2xl bg-white/[0.05] p-4 text-[12.5px] leading-relaxed text-white/55">
          <Sparkles size={15} className="mt-0.5 shrink-0 text-[#E3909F]" aria-hidden />
          {card.footnote}
        </p>
      </div>
    </div>
  );
}
