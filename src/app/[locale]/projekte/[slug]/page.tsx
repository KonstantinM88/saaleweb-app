import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { prisma } from "@/lib/prisma";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { CtaBanner } from "@/shared/ui/CtaBanner";
import { JsonLd } from "@/shared/seo/JsonLd";
import { caseStudySchema, breadcrumbSchema } from "@/shared/seo/schema";
import { LocaleSlugsProvider } from "@/features/language-switcher/LocaleSlugsContext";

type Params = { locale: string; slug: string };
type GalleryItem = { url: string; alt: string | null };

export async function generateStaticParams() {
  try {
    const rows = (await prisma.projectTranslation.findMany({
      where: { project: { published: true } },
      select: { locale: true, slug: true },
    })) as { locale: string; slug: string }[];
    return rows.map((r) => ({ locale: r.locale, slug: r.slug }));
  } catch {
    return [];
  }
}

async function getProjectData(locale: AppLocale, slug: string) {
  try {
    const tr = await prisma.projectTranslation.findFirst({
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
    if (!tr) return null;

    const languages: Record<string, string> = {};
    const slugs: Record<string, string> = {};
    for (const sib of tr.project.translations) {
      languages[sib.locale] = getPathname({
        locale: sib.locale as AppLocale,
        href: { pathname: "/projekte/[slug]", params: { slug: sib.slug } },
      });
      slugs[sib.locale] = sib.slug;
    }

    const media = (tr.project.media ?? []) as GalleryItem[];
    return {
      title: tr.title as string,
      challenge: (tr.challenge as string | null) ?? null,
      solution: (tr.solution as string | null) ?? null,
      results: (tr.results as string | null) ?? null,
      tag: tr.project.category?.translations?.[0]?.name ?? "",
      result: (tr.project.resultValue as string | null) ?? null,
      year: (tr.project.year as number | null) ?? null,
      technologies: (tr.project.technologies as string[]) ?? [],
      coverColor: (tr.project.coverColor as string | null) ?? null,
      cover: media[0]?.url ?? null,
      gallery: media.slice(1),
      languages,
      slugs,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const data = await getProjectData(locale, slug);
  if (!data) return {};
  return {
    title: data.title,
    description: data.challenge ?? data.results ?? undefined,
    alternates: { languages: data.languages },
    openGraph: data.cover ? { images: [{ url: data.cover }] } : undefined,
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const data = await getProjectData(locale, slug);
  if (!data) notFound();

  const tp = await getTranslations({ locale, namespace: "Projects" });
  const th = await getTranslations({ locale, namespace: "Pages" });
  const path = getPathname({ locale, href: { pathname: "/projekte/[slug]", params: { slug } } });
  const homePath = locale === routing.defaultLocale ? "/" : `/${locale}`;
  const hex = data.coverColor?.startsWith("#");

  const sections = [
    { label: tp("challenge"), body: data.challenge },
    { label: tp("solution"), body: data.solution },
    { label: tp("results"), body: data.results },
  ].filter((s) => s.body);

  return (
    <LocaleSlugsProvider slugs={data.slugs}>
      <Navbar />
      <JsonLd
        data={[
          caseStudySchema({ title: data.title, description: data.challenge ?? undefined, path, locale, image: data.cover }),
          breadcrumbSchema([
            { name: th("home"), path: homePath },
            { name: tp("label"), path: getPathname({ locale, href: "/projekte" }) },
            { name: data.title, path },
          ]),
        ]}
      />
      <main>
        <Breadcrumbs
          items={[{ name: th("home"), href: "/" }, { name: tp("label") }, { name: data.title }]}
        />
        <article className="py-12">
          <Container className="max-w-4xl">
            {data.tag && <span className="eyebrow">{data.tag}</span>}
            <h1 className="mt-4 text-[clamp(30px,5vw,52px)] font-bold leading-tight tracking-tight text-dark">
              {data.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {data.result && (
                <span className="rounded-lg bg-success/10 px-3 py-1.5 text-sm font-bold text-success">
                  {tp("result")}: {data.result}
                </span>
              )}
              {data.year != null && (
                <span className="rounded-lg bg-surface px-3 py-1.5 text-sm font-medium text-muted">
                  {data.year}
                </span>
              )}
            </div>

            {/* Cover */}
            <div
              className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-[18px] border border-line bg-dark"
              style={!data.cover && hex ? { background: data.coverColor ?? undefined } : undefined}
            >
              {data.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.cover} alt={data.title} className="h-full w-full object-cover" />
              ) : (
                <div className={!hex ? "h-full w-full bg-brand" : "h-full w-full"} />
              )}
            </div>

            {/* Challenge / Solution / Results */}
            {sections.length > 0 && (
              <div className="mt-10 space-y-8">
                {sections.map((s) => (
                  <section key={s.label}>
                    <h2 className="text-xl font-bold text-dark">{s.label}</h2>
                    <div className="prose mt-3 max-w-none whitespace-pre-line text-[16px] leading-relaxed text-ink">
                      {s.body}
                    </div>
                  </section>
                ))}
              </div>
            )}

            {/* Technologies */}
            {data.technologies.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold text-dark">{tp("tech")}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery */}
            {data.gallery.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold text-dark">{tp("gallery")}</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {data.gallery.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={img.url}
                      alt={img.alt ?? data.title}
                      className="w-full rounded-[14px] border border-line object-cover"
                    />
                  ))}
                </div>
              </section>
            )}
          </Container>
        </article>
        <CtaBanner />
      </main>
      <Footer />
    </LocaleSlugsProvider>
  );
}
