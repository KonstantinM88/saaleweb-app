import { getTranslations, getLocale } from "next-intl/server";
import { unstable_cache } from "next/cache";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import type { AppLocale } from "@/i18n/routing";
import { HOMEPAGE_CACHE_SECONDS, HOMEPAGE_CACHE_TAGS } from "@/features/homepage/cache";
import { Container } from "@/shared/ui/Container";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { CaseStudyCard, type CaseStudyCardLabels, type CaseStudyCardView } from "./CaseStudyCard";

type StaticItem = {
  slug: string;
  name: string;
  badge: string;
  industry: string;
  goal: string;
  solution: string;
  benefits: string[];
  result: string;
};
type Card = {
  slug: string | null;
  title: string;
  result: string;
  cover: { image: string | null; color: string | null; label: string };
};

const covers = [
  "bg-brand",
  "bg-gradient-to-br from-sky-500 to-brand-purple",
  "bg-gradient-to-br from-amber-500 to-brand-pink",
];

const readCachedDbCases = unstable_cache(
  async (locale: AppLocale): Promise<Card[]> => {
    const rows = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      take: 5,
      include: {
        translations: { where: { locale }, take: 1 },
        category: { include: { translations: { where: { locale }, take: 1 } } },
        media: { orderBy: { order: "asc" }, take: 1 },
      },
    });
    return rows.flatMap((row, i) => {
      const tr = row.translations[0];
      if (!tr) return [];
      return {
        slug: tr.slug,
        title: tr.title,
        result: row.resultValue ?? "",
        cover: {
          image: row.media?.[0]?.url ?? null,
          color: row.coverColor ?? covers[i % covers.length],
          label: tr.title,
        },
      } as Card;
    });
  },
  ["homepage-project-cards"],
  {
    revalidate: HOMEPAGE_CACHE_SECONDS,
    tags: [HOMEPAGE_CACHE_TAGS.projects],
  },
);

async function getDbCases(locale: AppLocale): Promise<Card[]> {
  try {
    return await readCachedDbCases(locale);
  } catch {
    return [];
  }
}

export async function CaseStudies() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations({ locale, namespace: "CaseStudies" });
  const tp = await getTranslations({ locale, namespace: "Projects" });
  const labels = t.raw("labels") as CaseStudyCardLabels;
  const fallback = (t.raw("projects") as StaticItem[]).map((item, i) => ({
    ...item,
    title: item.name,
    cover: { image: null, color: covers[i % covers.length], label: item.name },
  }));
  const dbItems = await getDbCases(locale);
  const dbBySlug = new Map(dbItems.flatMap((item) => (item.slug ? [[item.slug, item]] : [])));
  const items: CaseStudyCardView[] = fallback.map((item) => {
    const db = dbBySlug.get(item.slug);
    return {
      slug: db?.slug ?? item.slug,
      title: item.name,
      badge: item.badge,
      industry: item.industry,
      goal: item.goal,
      solution: item.solution,
      benefits: item.benefits,
      result: item.result || db?.result || "",
      cover: db?.cover ?? item.cover,
    };
  });

  return (
    <section id="cases" className="py-16 md:py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
        <p className="mx-auto -mt-3 mb-8 max-w-2xl text-center text-[14px] font-semibold text-muted">
          {t("trustLine")}
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {items.map((item, i) => (
            <CaseStudyCard key={item.slug ?? item.title} item={item} labels={labels} index={i} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/projekte"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-6 py-3 text-sm font-semibold text-dark transition-all hover:-translate-y-0.5 hover:border-brand-purple hover:text-brand-purple"
          >
            {tp("all")} -&gt;
          </Link>
        </div>
      </Container>
    </section>
  );
}
