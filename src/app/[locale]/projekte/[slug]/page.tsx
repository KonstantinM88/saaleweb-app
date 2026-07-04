import type { Metadata } from "next";
import Image from "next/image";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ExternalLink,
  Sparkles,
  Tag,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPathname, Link } from "@/i18n/navigation";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { CaseStudyDetailPage } from "@/widgets/project-detail/CaseStudyDetailPage";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { Reveal } from "@/shared/ui/Reveal";
import { Magnetic } from "@/shared/ui/Magnetic";
import { JsonLd } from "@/shared/seo/JsonLd";
import { breadcrumbSchema, caseStudySchema } from "@/shared/seo/schema";
import { buildMetadata } from "@/shared/seo/metadata";
import { getContactHref } from "@/shared/lib/contactHref";
import { getAuditHref, getHomeHref } from "@/shared/lib/localizedPath";
import { LocaleSlugsProvider } from "@/features/language-switcher/LocaleSlugsContext";

export const revalidate = 300;

type Params = { locale: string; slug: string };
type GalleryItem = {
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};
type CaseDetailCopy = {
  industry: string;
  goal: string;
  result: string;
  performance: string;
};

const externalUrlPattern = /(https?:\/\/[^\s]+)/g;

function extractExternalUrl(parts: Array<string | null | undefined>) {
  for (const part of parts) {
    const match = part?.match(externalUrlPattern)?.[0];
    if (match) return cleanUrl(match);
  }
  return null;
}

function cleanUrl(value: string) {
  return value.replace(/[),.;!?]+$/, "");
}

function displayUrl(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

function isPreviewUrl(value: string) {
  try {
    return new URL(value).hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

export async function generateStaticParams() {
  try {
    const rows = (await prisma.projectTranslation.findMany({
      where: { project: { published: true } },
      select: { locale: true, slug: true },
    })) as { locale: string; slug: string }[];

    return rows.map((row) => ({ locale: row.locale, slug: row.slug }));
  } catch {
    return [];
  }
}

async function getProjectData(locale: AppLocale, slug: string) {
  try {
    const translation = await prisma.projectTranslation.findFirst({
      where: { locale, slug, project: { published: true } },
      include: {
        project: {
          include: {
            translations: true,
            category: { include: { translations: { where: { locale }, take: 1 } } },
            media: { orderBy: { order: "asc" } },
          },
        },
      },
    });
    if (!translation) return null;

    const languages: Record<string, string> = {};
    const slugs: Record<string, string> = {};
    for (const sibling of translation.project.translations) {
      languages[sibling.locale] = getPathname({
        locale: sibling.locale as AppLocale,
        href: {
          pathname: "/projekte/[slug]",
          params: { slug: sibling.slug },
        },
      });
      slugs[sibling.locale] = sibling.slug;
    }

    const media = (translation.project.media ?? []) as GalleryItem[];
    return {
      title: translation.title,
      challenge: translation.challenge,
      solution: translation.solution,
      results: translation.results,
      externalUrl: extractExternalUrl([
        translation.solution,
        translation.results,
        translation.challenge,
      ]),
      tag: translation.project.category?.translations?.[0]?.name ?? "",
      result: translation.project.resultValue,
      year: translation.project.year,
      technologies: translation.project.technologies,
      coverColor: translation.project.coverColor,
      cover: media[0] ?? null,
      gallery: media.slice(1),
      languages,
      slugs,
    };
  } catch {
    return null;
  }
}

async function getNextProject(locale: AppLocale, currentSlug: string) {
  try {
    const rows = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      include: { translations: { where: { locale }, take: 1 } },
    });
    const projects = rows.flatMap((row) => {
      const translation = row.translations[0];
      return translation
        ? [{ slug: translation.slug, title: translation.title }]
        : [];
    });

    if (projects.length < 2) return null;
    const currentIndex = projects.findIndex((project) => project.slug === currentSlug);
    if (currentIndex === -1) return null;

    return projects[(currentIndex + 1) % projects.length];
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const data = await getProjectData(locale, slug);
  if (!data) return {};

  const t = await getTranslations({ locale, namespace: "Projects" });
  return buildMetadata({
    path: `/projekte/${data.slugs.de ?? slug}`,
    locale,
    title: `${data.title} — ${t("label")}`,
    description: data.challenge ?? data.results ?? t("pageLead"),
    eyebrow: data.tag || t("label"),
    languages: data.languages,
    image: data.cover?.url,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const data = await getProjectData(locale, slug);
  if (!data) notFound();

  const t = await getTranslations({ locale, namespace: "Projects" });
  const pages = await getTranslations({ locale, namespace: "Pages" });
  const caseDetails = t.raw("caseDetails") as Record<string, CaseDetailCopy>;
  const detailCopy = caseDetails[slug] ?? caseDetails[data.slugs.de] ?? {
    industry: data.tag || t("label"),
    goal: data.challenge || t("challengeText"),
    result: data.results || t("resultsText"),
    performance: t("performanceNotesText"),
  };
  const nextProject = await getNextProject(locale, slug);
  const path = getPathname({
    locale,
    href: { pathname: "/projekte/[slug]", params: { slug } },
  });
  const projectsPath = getPathname({ locale, href: "/projekte" });
  const homePath = getHomeHref(locale);
  const contactHref = getContactHref(locale);
  const auditHref = getAuditHref(locale);
  const hexCover = data.coverColor?.startsWith("#");
  const externalLinkLabel = data.externalUrl && isPreviewUrl(data.externalUrl)
    ? t("projectPreview")
    : t("liveSite");
  const previewInlineLabel = t("projectPreviewInline");

  const overviewItems = [
    { label: t("industry"), value: detailCopy.industry },
    { label: t("businessGoal"), value: detailCopy.goal },
    { label: t("resultFocus"), value: detailCopy.result },
  ];

  const steps = [
    { label: t("challenge"), body: data.challenge || t("challengeText") },
    { label: t("solution"), body: data.solution || t("solutionText") },
    { label: t("results"), body: data.results || t("resultsText") },
  ];

  const facts = [
    data.result
      ? { icon: "trend", label: t("result"), value: data.result }
      : null,
    data.tag
      ? { icon: "tag", label: t("label"), value: data.tag }
      : null,
    data.year != null
      ? { icon: "calendar", label: t("year"), value: String(data.year) }
      : null,
  ].filter(Boolean) as { icon: "trend" | "tag" | "calendar"; label: string; value: string }[];

  return (
    <LocaleSlugsProvider slugs={data.slugs}>
      <Navbar />
      <JsonLd
        data={[
          caseStudySchema({
            title: data.title,
            description: data.challenge ?? t("challengeText"),
            path,
            locale,
            image: data.cover?.url,
          }),
          breadcrumbSchema([
            { name: pages("home"), path: homePath },
            { name: t("label"), path: projectsPath },
            { name: data.title, path },
          ]),
        ]}
      />

      <CaseStudyDetailPage>
        <Breadcrumbs
          items={[
            { name: pages("home"), href: "/" },
            { name: t("label"), href: "/projekte" },
            { name: data.title },
          ]}
        />

        <section className="relative overflow-hidden pb-8 pt-6 md:pt-10">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(600px 340px at 85% 0%, rgba(139,92,246,0.10), transparent 60%), radial-gradient(520px 320px at 5% 6%, rgba(255,79,163,0.08), transparent 58%)",
              }}
            />
          </div>

          <Container>
            <div className="hero-stagger max-w-3xl">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-purple/20 bg-brand-soft px-3.5 py-1.5 text-[13px] font-bold uppercase tracking-[0.08em] text-[#6D28D9] backdrop-blur-sm">
                  <Sparkles size={14} aria-hidden />
                  {t("caseBadge")}
                </span>
                {data.tag && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-[13px] font-medium text-brand-purple backdrop-blur-sm">
                    <Tag size={14} aria-hidden />
                    {data.tag}
                  </span>
                )}
              </div>
              <h1 className="mt-4 text-[clamp(30px,5vw,54px)] font-bold leading-[1.08] tracking-tight text-dark">
                {data.title}
              </h1>
              <p className="mt-5 max-w-2xl text-[clamp(17px,1.8vw,21px)] text-muted">
                {t("caseIntro")}
              </p>
            </div>
          </Container>
        </section>

        <section className="pb-4">
          <Container>
            <Reveal>
              <ProjectMedia
                item={data.cover}
                title={data.title}
                color={data.coverColor}
                hexColor={Boolean(hexCover)}
                priority
                fit="cover"
                imagePosition="object-top"
                className="aspect-[16/10] rounded-[20px] sm:aspect-[16/9]"
              />
            </Reveal>

            {facts.length > 0 && (
              <Reveal delay={80}>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-purple">
                        {fact.icon === "trend" ? (
                          <TrendingUp size={20} aria-hidden />
                        ) : fact.icon === "calendar" ? (
                          <Calendar size={20} aria-hidden />
                        ) : (
                          <Tag size={20} aria-hidden />
                        )}
                      </span>
                      <div>
                        <div className="text-[12px] uppercase tracking-wide text-muted">
                          {fact.label}
                        </div>
                        <div
                          className={
                            fact.icon === "trend"
                              ? "text-[18px] font-bold text-success"
                              : "text-[16px] font-bold text-dark"
                          }
                        >
                          {fact.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal delay={110}>
              <section className="mt-5 rounded-[22px] border border-line bg-white p-5 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.5)] md:p-6">
                <span className="eyebrow">{t("clientOverview")}</span>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {overviewItems.map((item) => (
                    <article key={item.label} className="rounded-2xl border border-line bg-surface p-4">
                      <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-brand-purple">
                        {item.label}
                      </h2>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-ink">{item.value}</p>
                    </article>
                  ))}
                </div>
              </section>
            </Reveal>
          </Container>
        </section>

        <section className="py-14 md:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <Reveal key={step.label} delay={index * 70}>
                    <section className="rounded-[20px] border border-line bg-white p-6 md:p-8">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand font-mono text-base font-semibold text-white">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h2 className="text-[clamp(19px,2.2vw,24px)] font-bold text-dark">
                          {step.label}
                        </h2>
                      </div>
                      <ProjectRichText text={step.body} previewLinkLabel={previewInlineLabel} />
                    </section>
                  </Reveal>
                ))}

                <Reveal>
                  <section className="rounded-[20px] border border-line bg-surface p-6 md:p-8">
                    <h2 className="text-[clamp(19px,2.2vw,24px)] font-bold text-dark">
                      {t("techFoundation")}
                    </h2>
                    <p className="mt-3 text-[16px] leading-relaxed text-ink">
                      {t("techFoundationText")}
                    </p>
                    {data.technologies.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {data.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    )}
                  </section>
                </Reveal>

                <Reveal>
                  <section className="rounded-[20px] border border-line bg-white p-6 md:p-8">
                    <h2 className="text-[clamp(19px,2.2vw,24px)] font-bold text-dark">
                      {t("performanceNotes")}
                    </h2>
                    <p className="mt-3 text-[16px] leading-relaxed text-ink">
                      {detailCopy.performance || t("performanceNotesText")}
                    </p>
                  </section>
                </Reveal>
              </div>

              <div>
                <Reveal delay={80}>
                  <aside className="sticky top-24 overflow-hidden rounded-[22px] border border-line bg-white p-7 shadow-card">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white">
                      <Sparkles size={22} aria-hidden />
                    </div>
                    <h2 className="text-[20px] font-bold text-dark">{t("ctaTitle")}</h2>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
                      {t("ctaText")}
                    </p>
                    {data.externalUrl && (
                      <a
                        href={data.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-[15px] font-semibold text-dark transition-all hover:-translate-y-0.5 hover:border-brand-purple/50 hover:text-brand-purple hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2"
                      >
                        {externalLinkLabel}
                        <ExternalLink size={16} aria-hidden />
                      </a>
                    )}
                    <div className="mt-5">
                      <Magnetic className="block w-full">
                        <a
                          href={contactHref}
                          className="btn-shine group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,79,163,0.55)] transition-all hover:-translate-y-0.5"
                        >
                          {t("ctaButton")}
                          <ArrowRight
                            size={17}
                            className="transition-transform group-hover:translate-x-1"
                            aria-hidden
                          />
                        </a>
                      </Magnetic>
                    </div>
                    <a
                      href={auditHref}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-[15px] font-semibold text-dark transition-all hover:-translate-y-0.5 hover:border-brand-purple/50 hover:text-brand-purple hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2"
                    >
                      {t("auditButton")}
                      <ArrowRight size={16} aria-hidden />
                    </a>

                    {nextProject && (
                      <Link
                        href={{
                          pathname: "/projekte/[slug]",
                          params: { slug: nextProject.slug },
                        }}
                        className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-5 text-sm transition-colors hover:text-brand-purple"
                      >
                        <span>
                          <span className="block text-[12px] uppercase tracking-wide text-muted">
                            {t("nextProject")}
                          </span>
                          <span className="font-semibold text-dark">{nextProject.title}</span>
                        </span>
                        <ArrowRight
                          size={16}
                          aria-hidden
                          className="shrink-0 text-brand-purple"
                        />
                      </Link>
                    )}
                  </aside>
                </Reveal>
              </div>
            </div>
          </Container>
        </section>

        {data.gallery.length > 0 && (
          <section className="bg-surface py-16 md:py-24">
            <Container>
              <Reveal className="mx-auto mb-10 max-w-[680px] text-center">
                <span className="eyebrow">{t("gallery")}</span>
                <h2 className="mt-4 text-[clamp(24px,3.2vw,38px)] font-bold tracking-tight text-dark">
                  {t("gallery")}
                </h2>
              </Reveal>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {data.gallery.map((item, index) => (
                  <Reveal key={`${item.url}-${index}`} delay={(index % 2) * 70}>
                    <ProjectMedia
                      item={item}
                      title={item.alt ?? data.title}
                      color={null}
                      hexColor={false}
                      className="aspect-[16/10] rounded-[16px]"
                    />
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        )}

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
                    {t("ctaTitle")}
                  </h2>
                  <p className="mx-auto mt-3 max-w-lg text-[16px] text-gray-400">
                    {t("ctaText")}
                  </p>
                  <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <Magnetic>
                      <a
                        href={contactHref}
                        className="btn-shine group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5"
                      >
                        {t("ctaButton")}
                        <ArrowRight
                          size={17}
                          className="transition-transform group-hover:translate-x-1"
                          aria-hidden
                        />
                      </a>
                    </Magnetic>
                    <a
                      href={auditHref}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.15] bg-white/[0.08] px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.12]"
                    >
                      {t("auditButton")}
                      <ArrowRight size={17} aria-hidden />
                    </a>
                  </div>
                  <p className="mx-auto mt-5 max-w-lg text-[13.5px] font-semibold text-gray-300">
                    {t("ctaTrust")}
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/projekte"
                      className="inline-flex items-center gap-1.5 text-[14px] font-medium text-gray-400 transition-colors hover:text-white"
                    >
                      <ArrowLeft size={15} aria-hidden />
                      {t("backToProjects")}
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      </CaseStudyDetailPage>
      <Footer />
    </LocaleSlugsProvider>
  );
}

function ProjectRichText({
  text,
  previewLinkLabel,
}: {
  text: string;
  previewLinkLabel: string;
}) {
  const parts = text.split(externalUrlPattern);

  return (
    <div className="mt-4 whitespace-pre-line text-[16px] leading-relaxed text-ink">
      {parts.map((part, index) => {
        if (!part.match(/^https?:\/\//)) {
          return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
        }

        const href = cleanUrl(part);
        const suffix = part.slice(href.length);
        const label = isPreviewUrl(href) ? previewLinkLabel : displayUrl(href);

        return (
          <Fragment key={`${href}-${index}`}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-brand-purple/20 bg-brand-soft px-2.5 py-1 align-baseline text-[0.95em] font-semibold text-[#6D28D9] transition hover:-translate-y-0.5 hover:border-brand-purple/50 hover:bg-white hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2"
            >
              {label}
              <ExternalLink size={14} aria-hidden />
            </a>
            {suffix}
          </Fragment>
        );
      })}
    </div>
  );
}

function ProjectMedia({
  item,
  title,
  color,
  hexColor,
  priority = false,
  fit = "contain",
  imagePosition = "object-center",
  className,
}: {
  item: GalleryItem | null;
  title: string;
  color: string | null;
  hexColor: boolean;
  priority?: boolean;
  fit?: "contain" | "cover";
  imagePosition?: string;
  className: string;
}) {
  const isLocalImage = item?.url.startsWith("/");
  const imageClassName = `${fit === "cover" ? "object-cover" : "object-contain"} ${imagePosition}`;

  return (
    <div
      className={`relative w-full overflow-hidden border border-line bg-[#fbf7fc] ${className}`}
      style={!item && hexColor ? { background: color ?? undefined } : undefined}
    >
      {item && isLocalImage ? (
        <Image
          src={item.url}
          alt={title}
          fill
          priority={priority}
          sizes="(min-width: 1180px) 1148px, 100vw"
          className={imageClassName}
        />
      ) : item ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.url}
          alt={title}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={`absolute inset-0 h-full w-full ${imageClassName}`}
        />
      ) : (
        <div
          className={
            hexColor
              ? "grid h-full w-full place-items-center"
              : "grid h-full w-full place-items-center bg-brand"
          }
        >
          <span className="px-6 text-center text-2xl font-bold text-white/[0.85]">{title}</span>
        </div>
      )}
    </div>
  );
}
