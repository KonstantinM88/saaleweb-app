import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { ArrowRight, CheckCircle2, MapPin, Star } from "lucide-react";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { ProjectGrid, type ProjectCard } from "@/widgets/projects-page/ProjectGrid";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { Reveal } from "@/shared/ui/Reveal";
import { Magnetic } from "@/shared/ui/Magnetic";
import { TrustMetrics } from "@/shared/ui/TrustMetrics";
import { CtaBanner } from "@/shared/ui/CtaBanner";
import { JsonLd } from "@/shared/seo/JsonLd";
import { breadcrumbSchema, collectionPageSchema, itemListSchema } from "@/shared/seo/schema";
import { buildMetadata } from "@/shared/seo/metadata";
import { getContactHref } from "@/shared/lib/contactHref";

export const revalidate = 300;

type Params = { locale: string };

async function getItems(locale: AppLocale): Promise<ProjectCard[]> {
  try {
    const rows = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      include: {
        translations: { where: { locale }, take: 1 },
        category: { include: { translations: { where: { locale }, take: 1 } } },
        media: { orderBy: { order: "asc" }, take: 1 },
      },
    });

    return rows.flatMap((row) => {
      const translation = row.translations[0];
      if (!translation) return [];

      return [
        {
          slug: translation.slug,
          title: translation.title,
          tag: row.category?.translations?.[0]?.name ?? "",
          result: row.resultValue ?? "",
          cover: {
            image: row.media?.[0]?.url ?? null,
            color: row.coverColor ?? null,
          },
        },
      ];
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "Projects" });
  const languages = Object.fromEntries(
    routing.locales.map((targetLocale) => [
      targetLocale,
      getPathname({ locale: targetLocale, href: "/projekte" }),
    ]),
  );

  return buildMetadata({
    path: "/projekte",
    locale,
    title: t("pageTitle"),
    description: t("pageLead"),
    eyebrow: t("label"),
    languages,
  });
}

export default async function ProjectsIndexPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Projects" });
  const pages = await getTranslations({ locale, namespace: "Pages" });
  const items = await getItems(locale);
  const homePath = locale === routing.defaultLocale ? "/" : `/${locale}`;
  const projectsPath = getPathname({ locale, href: "/projekte" });
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
            { name: pages("home"), path: homePath },
            { name: t("label"), path: projectsPath },
          ]),
          collectionPageSchema({
            name: t("pageTitle"),
            description: t("pageLead"),
            path: projectsPath,
            locale,
          }),
          itemListSchema(
            items.map((item) => ({
              name: item.title,
              description: item.result || item.tag,
              path: `${projectsPath}/${item.slug}`,
            })),
          ),
        ]}
      />

      <main>
        <Breadcrumbs items={[{ name: pages("home"), href: "/" }, { name: t("label") }]} />

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
                maskImage:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, #000 25%, transparent 78%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, #000 25%, transparent 78%)",
              }}
            />
          </div>

          <Container>
            <div className="hero-stagger max-w-3xl">
              <span className="eyebrow">{t("label")}</span>
              <h1 className="mt-4 text-[clamp(32px,5.2vw,58px)] font-bold leading-[1.08] tracking-tight text-dark">
                {t("pageTitle")}
              </h1>
              <p className="mt-5 max-w-2xl text-[clamp(16px,1.7vw,20px)] text-muted">
                {t("pageLead")}
              </p>
              <div className="mt-8">
                <Magnetic>
                  <a
                    href={contactHref}
                    className="btn-shine group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,79,163,0.55)] transition-all hover:-translate-y-0.5"
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
            </div>

            <Reveal delay={120}>
              <div className="mt-12">
                <TrustMetrics items={trust} />
              </div>
            </Reveal>
          </Container>
        </section>

        <section className="border-y border-line bg-white py-12 md:py-16" aria-labelledby="project-proof-title">
          <Container>
            <Reveal>
              <div className="grid gap-7 rounded-[26px] border border-line bg-surface/70 p-6 shadow-sm md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div>
                  <span className="eyebrow">{t("proofEyebrow")}</span>
                  <h2 id="project-proof-title" className="mt-4 text-[clamp(26px,3.5vw,40px)] font-extrabold leading-tight tracking-tight text-dark">
                    {t("proofTitle")}
                  </h2>
                  <p className="mt-4 text-[16px] leading-relaxed text-muted">{t("proofText")}</p>
                </div>

                <ul className="grid gap-3">
                  <ProofItem icon={<CheckCircle2 size={19} aria-hidden />} text={t("proofProjects")} />
                  <ProofItem icon={<Star size={19} aria-hidden />} text={t("proofReviews")} />
                  <ProofItem icon={<MapPin size={19} aria-hidden />} text={t("proofRegion")} />
                </ul>
              </div>
            </Reveal>
          </Container>
        </section>

        <section className="py-12 md:py-16">
          <Container>
            {items.length === 0 ? (
              <p className="mx-auto max-w-md rounded-2xl border border-dashed border-line bg-surface p-10 text-center text-muted">
                {t("empty")}
              </p>
            ) : (
              <ProjectGrid
                items={items}
                allLabel={t("all_")}
                viewLabel={t("viewProject")}
              />
            )}
          </Container>
        </section>

        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}

function ProofItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 text-[15px] font-semibold leading-relaxed text-ink">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-purple">
        {icon}
      </span>
      <span>{text}</span>
    </li>
  );
}
