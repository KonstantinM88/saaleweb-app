import { Fragment } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  Link2,
  Minus,
  Search,
  ShieldCheck,
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
import onebbauBathroom from "@/assets/industry-premium/construction/onebbau-badsanierung-halle.webp";
import onebbauPaving from "@/assets/industry-premium/construction/onebbau-pflasterarbeiten-halle.webp";
import sorgfaltbauCourtyard from "@/assets/industry-premium/construction/sorgfaltbau-innenhofsanierung-halle.webp";
import sorgfaltbauNaturalStone from "@/assets/industry-premium/construction/sorgfaltbau-natursteinarbeiten-halle.webp";
import { InquiryQualityDemo } from "./InquiryQualityDemo";
import type { ConstructionLandingContent, ConstructionProof } from "./types";

const constructionProofAssets = {
  "sorgfaltbau-projects": {
    primary: sorgfaltbauCourtyard,
    secondary: sorgfaltbauNaturalStone,
    primaryPosition: "object-center",
    secondaryPosition: "object-center",
  },
  "onebbau-projects": {
    primary: onebbauPaving,
    secondary: onebbauBathroom,
    primaryPosition: "object-[center_28%]",
    secondaryPosition: "object-center",
  },
} satisfies Record<
  NonNullable<ConstructionProof["media"]>["key"],
  {
    primary: typeof sorgfaltbauCourtyard;
    secondary: typeof sorgfaltbauCourtyard;
    primaryPosition: string;
    secondaryPosition: string;
  }
>;

type Props = {
  content: ConstructionLandingContent;
  locale: AppLocale;
  path: string;
  parent: { name: string; href: Crumb["href"]; path: string };
  homeLabel: string;
  localeSlugs: Phase4SlugMap;
};

export function ConstructionLandingPage({
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

      <main className="bau-page">
        <Breadcrumbs
          items={[
            { name: homeLabel, href: "/" },
            { name: parent.name, href: parent.href },
            { name: content.h1 },
          ]}
        />

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="bau-grid-bg relative overflow-hidden pb-16 pt-8 md:pb-24 md:pt-12">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_4%,rgba(255,79,163,0.08),transparent_32%),radial-gradient(circle_at_92%_0%,rgba(45,108,163,0.14),transparent_34%)]" />
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
                      <Check size={17} className="mt-0.5 shrink-0 text-[#2D6CA3]" aria-hidden />
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
                <InquiryCardMock card={content.heroCard} />
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ── DIRECT ANSWER (GEO / AIO) ────────────────────────── */}
        <section className="border-y border-line bg-white py-12 md:py-16" aria-labelledby="bau-answer">
          <Container>
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
                <div>
                  <span className="eyebrow">{content.answer.eyebrow}</span>
                  <h2
                    id="bau-answer"
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

        {/* ── THE PROBLEM ──────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.problem.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.problem.title}
              </h2>
              <p className="mt-5 text-[16.5px] leading-relaxed text-muted">{content.problem.intro}</p>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {content.problem.items.map((item, index) => (
                <Reveal key={item.title} delay={(index % 3) * 60} className="h-full">
                  <article className="h-full rounded-[20px] border border-line bg-surface p-6">
                    <h3 className="text-[16px] font-extrabold leading-snug text-dark">{item.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={100}>
              <p className="mx-auto mt-8 max-w-3xl border-l-2 border-[#2D6CA3] pl-5 text-[16px] leading-relaxed text-ink">
                {content.problem.conclusion}
              </p>
            </Reveal>
          </Container>
        </section>

        {/* ── SIGNATURE: INQUIRY QUALITY (blueprint sheet) ─────── */}
        <section className="bau-blueprint bau-grid-bg relative overflow-hidden py-16 md:py-24">
          <Container className="relative min-w-0">
            <div className="min-w-0 max-w-3xl">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#2D6CA3]">
                {content.inquiry.eyebrow}
              </span>
              <h2 className="mt-4 text-[clamp(28px,4vw,46px)] font-extrabold leading-[1.06] tracking-[-0.025em] text-[#0C2E4E]">
                {content.inquiry.title}
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-[#40607F]">{content.inquiry.intro}</p>
            </div>

            <div className="mt-10">
              <InquiryQualityDemo copy={content.inquiry} ctaHref={contactHref} />
            </div>
          </Container>
        </section>

        {/* ── URL STRUCTURE ────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.structure.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.structure.title}
              </h2>
              <p className="mt-5 text-[16.5px] leading-relaxed text-muted">{content.structure.intro}</p>
            </Reveal>

            <div className="mt-10 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-6">
              <Reveal className="h-full">
                <article className="h-full rounded-[24px] border border-line bg-surface p-6 md:p-7">
                  <h3 className="text-[17px] font-extrabold text-dark">{content.structure.badTitle}</h3>
                  <p className="mt-1.5 text-[13.5px] text-muted">{content.structure.badNote}</p>
                  <ul className="mt-5 grid gap-2.5">
                    {content.structure.badItems.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[14.5px] leading-relaxed text-muted">
                        <Minus size={16} className="mt-1 shrink-0 text-line" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>

              <Reveal delay={80} className="h-full">
                <article className="h-full rounded-[24px] border border-[#2D6CA3]/25 bg-white p-6 shadow-[0_30px_90px_-64px_rgba(45,108,163,0.9)] md:p-7">
                  <h3 className="text-[17px] font-extrabold text-dark">{content.structure.goodTitle}</h3>
                  <p className="mt-1.5 text-[13.5px] text-muted">{content.structure.goodNote}</p>
                  <ul className="mt-5 grid gap-2">
                    {content.structure.goodItems.map((item) => (
                      <li key={item.slug} className="bau-url">
                        <Link2 size={14} className="shrink-0 text-[#2D6CA3]" aria-hidden />
                        <code className="min-w-0 break-all font-mono text-[13px] text-[#0C2E4E]">
                          <span className="text-[#40607F]/60">{content.structure.urlPrefix}</span>
                          {item.slug}
                        </code>
                        <span className="ml-auto hidden shrink-0 text-[12.5px] text-muted sm:block">
                          {item.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <p className="mx-auto mt-8 max-w-3xl border-l-2 border-[#2D6CA3] pl-5 text-[16px] leading-relaxed text-ink">
                {content.structure.conclusion}
              </p>
            </Reveal>
          </Container>
        </section>

        {/* ── TRUST ────────────────────────────────────────────── */}
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.trust.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.trust.title}
              </h2>
              <p className="mt-5 text-[16.5px] leading-relaxed text-muted">{content.trust.intro}</p>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {content.trust.items.map((item, index) => (
                <Reveal key={item.title} delay={(index % 3) * 60} className="h-full">
                  <article className="card-border-glow h-full rounded-[20px] border border-line bg-white p-6">
                    <h3 className="text-[16px] font-extrabold text-dark">{item.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={90}>
              <div className="mt-8 flex gap-4 rounded-[20px] border border-[#2D6CA3]/25 bg-[#2D6CA3]/[0.06] p-5 md:p-6">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#2D6CA3]" aria-hidden />
                <p className="text-[15px] leading-relaxed text-ink">{content.trust.note}</p>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* ── LIVE PROOF ───────────────────────────────────────── */}
        <section
          id="construction-references"
          className="bau-graphite relative overflow-hidden py-16 md:py-24"
          aria-labelledby="construction-references-title"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_86%_-6%,rgba(45,108,163,0.28),transparent_38%),radial-gradient(circle_at_0%_100%,rgba(255,79,163,0.14),transparent_36%)]"
          />
          <Container className="relative">
            <div className="max-w-3xl">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#7FB6E4]">
                {content.proofs.eyebrow}
              </span>
              <h2
                id="construction-references-title"
                className="mt-4 break-words text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.08] tracking-[-0.025em] text-white"
              >
                {content.proofs.title}
              </h2>
              <p className="mt-5 break-words text-[16px] leading-relaxed text-white/60">
                {content.proofs.intro}
              </p>
            </div>

            <div className="mt-10 grid min-w-0 gap-5 md:grid-cols-2 md:gap-6">
              {content.proofs.items.map((proof) => (
                <article
                  key={proof.name}
                  className="flex h-full min-w-0 flex-col rounded-[24px] border border-white/[0.10] bg-white/[0.04] p-6 md:p-8"
                >
                  {proof.media ? <ConstructionProofGallery media={proof.media} /> : null}

                  <h3 className="break-words text-[clamp(19px,2.2vw,24px)] font-extrabold tracking-[-0.02em] text-white">
                    {proof.name}
                  </h3>
                  <p className="mt-3 break-words text-[15px] leading-relaxed text-white/65">
                    {proof.text}
                  </p>

                  <ul className="mt-5 grid gap-2.5 border-t border-white/[0.10] pt-5">
                    {proof.stats.map((stat) => (
                      <li
                        key={stat}
                        className="flex min-w-0 gap-2.5 break-words text-[14.5px] leading-relaxed text-white/80"
                      >
                        <Check size={16} className="mt-0.5 shrink-0 text-[#7FB6E4]" aria-hidden />
                        {stat}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-3 pt-1">
                    <a
                      href={proof.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#2D6CA3] px-5 py-3 text-[14.5px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#3B82C4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7FB6E4] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
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
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* ── JOURNEY ──────────────────────────────────────────── */}
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
                    className="bau-rail grid gap-5 py-7 md:grid-cols-[auto_1fr] md:gap-8"
                  >
                    <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
                      <span className="bau-figure grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#2D6CA3]/30 bg-[#2D6CA3]/[0.08] text-[15px] font-extrabold text-[#1B4E7A]">
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
        <section className="bg-surface py-16 md:py-24">
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
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2D6CA3]" />
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
        <section className="py-16 md:py-24">
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
                      <li key={prompt} className="bau-prompt">
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

        {/* ── REACHABILITY ─────────────────────────────────────── */}
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{content.reachability.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(27px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-dark">
                {content.reachability.title}
              </h2>
              <p className="mt-5 text-[16.5px] leading-relaxed text-muted">{content.reachability.intro}</p>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {content.reachability.items.map((item, index) => (
                <Reveal key={item.title} delay={(index % 3) * 60} className="h-full">
                  <article className="h-full rounded-[20px] border border-line bg-white p-6">
                    <h3 className="text-[16px] font-extrabold text-dark">{item.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={80}>
              <div className="mt-8 flex gap-4 rounded-[20px] border border-[#2D6CA3]/25 bg-white p-5 md:p-6">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#2D6CA3]" aria-hidden />
                <p className="text-[15px] leading-relaxed text-ink">{content.reachability.honesty}</p>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* ── LEGAL ────────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
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
                  <article className="h-full rounded-[20px] border border-line bg-surface p-6">
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
                          ? "border-[#2D6CA3]/45 shadow-[0_30px_90px_-64px_rgba(45,108,163,0.9)] ring-1 ring-[#2D6CA3]/20"
                          : "border-line"
                      }`}
                    >
                      <h3 className="text-[18px] font-extrabold text-dark">{tier.name}</h3>
                      <p className="bau-figure mt-3 text-[26px] font-extrabold text-[#1B4E7A]">{tier.price}</p>
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
              <EditorialTrust locale={locale} id="construction-editorial-trust-title" />
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
                  <details className="bau-faq group rounded-[18px] border border-line bg-white" open={index === 0}>
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 md:p-6">
                      <h3 className="text-[16.5px] font-extrabold leading-snug text-dark">
                        <BrandText text={item.q} />
                      </h3>
                      <span
                        aria-hidden
                        className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[7px] bg-surface text-brand-purple transition-transform group-open:rotate-45 group-open:bg-brand group-open:text-white motion-reduce:transition-none"
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
                    className="group flex h-full flex-col rounded-[20px] border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/30 hover:shadow-[0_22px_70px_-54px_rgba(139,92,246,0.74)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[16.5px] font-extrabold text-dark">{link.label}</h3>
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-purple transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none">
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
              <div className="bau-graphite relative overflow-hidden rounded-[28px] p-8 text-center md:p-14">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,108,163,0.30),transparent_40%),radial-gradient(circle_at_88%_100%,rgba(255,79,163,0.18),transparent_38%)]"
                />
                <div className="relative mx-auto max-w-2xl">
                  <h2 className="text-[clamp(24px,3.4vw,42px)] font-extrabold leading-[1.08] tracking-[-0.025em] text-white">
                    {content.final.title}
                  </h2>
                  <p className="mx-auto mt-5 text-[16px] leading-relaxed text-white/60">{content.final.text}</p>
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

function ConstructionProofGallery({ media }: { media: NonNullable<ConstructionProof["media"]> }) {
  const assets = constructionProofAssets[media.key];

  return (
    <figure className="group mb-6 min-w-0 overflow-hidden rounded-[18px] border border-white/[0.12] bg-[#091A2B]">
      <div className="grid h-52 grid-cols-[0.9fr_1.1fr] gap-1.5 sm:h-60">
        <div className="relative min-w-0 overflow-hidden">
          <Image
            src={assets.primary}
            alt={media.primaryAlt}
            fill
            sizes="(max-width: 767px) 42vw, (max-width: 1279px) 21vw, 230px"
            className={`object-cover ${assets.primaryPosition} transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
          />
        </div>
        <div className="relative min-w-0 overflow-hidden">
          <Image
            src={assets.secondary}
            alt={media.secondaryAlt}
            fill
            sizes="(max-width: 767px) 50vw, (max-width: 1279px) 25vw, 280px"
            className={`object-cover ${assets.secondaryPosition} transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
          />
        </div>
      </div>
      <figcaption className="break-words border-t border-white/[0.10] px-4 py-3 text-[12.5px] leading-relaxed text-white/60">
        {media.caption}
      </figcaption>
    </figure>
  );
}

/** Underlines the accent phrase inside the H1 with the technical blue rule. */
function Accented({ text, accent }: { text: string; accent: string }) {
  const parts = text.split(accent);
  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 ? <span className="bau-underline">{accent}</span> : null}
        </Fragment>
      ))}
    </>
  );
}

function InquiryCardMock({ card }: { card: ConstructionLandingContent["heroCard"] }) {
  return (
    <div className="bau-inquiry relative overflow-hidden rounded-[28px] p-5 shadow-[0_40px_110px_-64px_rgba(12,46,78,0.55)] md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#2D6CA3]/30 bg-[#2D6CA3]/[0.09] px-3 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#1B4E7A]">
          {card.badge}
        </span>
        <span className="font-mono text-[11px] text-[#40607F]/60">{card.time}</span>
      </div>

      <p className="mt-5 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#2D6CA3]">
        {card.channel}
      </p>

      <dl className="mt-4 grid gap-0">
        {card.fields.map((field) => (
          <div
            key={field.label}
            className="grid gap-1 border-t border-[#2D6CA3]/15 py-3 sm:grid-cols-[112px_1fr] sm:gap-4"
          >
            <dt className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#2D6CA3]">
              {field.label}
            </dt>
            <dd className="text-[14.5px] font-semibold leading-snug text-[#0C2E4E]">{field.value}</dd>
          </div>
        ))}
        <div className="grid gap-1 border-y border-[#2D6CA3]/15 py-3 sm:grid-cols-[112px_1fr] sm:gap-4">
          <dt className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#2D6CA3]">
            {card.photosLabel}
          </dt>
          <dd className="flex items-center gap-2 text-[14.5px] font-semibold leading-snug text-[#0C2E4E]">
            <Camera size={15} className="shrink-0 text-[#2D6CA3]" aria-hidden />
            {card.photosValue}
          </dd>
        </div>
      </dl>

      <p className="mt-5 text-[12.5px] leading-relaxed text-[#40607F]/80">{card.footnote}</p>
    </div>
  );
}
