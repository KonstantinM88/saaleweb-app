import { getTranslations, getLocale } from "next-intl/server";
import type { CSSProperties } from "react";
import { prisma } from "@/lib/prisma";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { SectionHeader } from "@/shared/ui/SectionHeader";

type StaticItem = { name: string; desc: string };
type Item = {
  name: string;
  desc: string;
  slug: string;
  emoji: string;
  coverImage: string | null;
};
const emojis = ["🏨", "🍽️", "💇", "🏗️", "🔧", "🩺", "🏠", "⚖️"];
const fallbackSlugs: Record<AppLocale, string[]> = {
  de: ["hotels", "restaurants", "beauty-salons", "bau", "handwerk", "arztpraxen", "immobilien", "kanzleien"],
  en: [
    "hotels",
    "restaurants",
    "beauty-salons",
    "construction",
    "craftsmen",
    "medical-practices",
    "real-estate",
    "law-firms",
  ],
  ru: [
    "oteli",
    "restorany",
    "beauty-salony",
    "stroitelstvo",
    "remeslenniki",
    "medcentry",
    "nedvizhimost",
    "yuristy",
  ],
};

async function getDbIndustries(locale: AppLocale): Promise<Item[]> {
  try {
    const rows = await prisma.industry.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: { translations: { where: { locale }, take: 1 } },
    });
    return rows.flatMap((row, i) => {
      const tr = row.translations[0];
      if (!tr) return [];
      return {
        name: tr.name,
        desc: tr.excerpt ?? "",
        slug: tr.slug,
        emoji: row.emoji || emojis[i % emojis.length],
        coverImage: row.coverImage ?? null,
      };
    });
  } catch {
    return [];
  }
}

export async function Industries() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations({ locale, namespace: "Industries" });
  const fallback = (t.raw("items") as StaticItem[]).map((item, i) => ({
    ...item,
    slug: fallbackSlugs[locale][i],
    emoji: emojis[i % emojis.length],
    coverImage: null,
  }));
  const dbItems = await getDbIndustries(locale);
  const items = dbItems.length >= fallback.length ? dbItems : fallback;

  return (
    <section id="industries" className="bg-surface py-16 md:py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.slug} delay={i * 50} className="h-full">
              <Link
                href={{ pathname: "/branchen/[slug]", params: { slug: item.slug } }}
                aria-label={item.name}
                className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-4"
              >
                <div
                  className="industry-card h-full rounded-2xl border border-line bg-white p-4 text-center transition-all group-hover:-translate-y-1 group-hover:bg-dark sm:p-5"
                  style={{ "--i": i } as CSSProperties}
                >
                  {item.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.coverImage} alt="" className="industry-emoji mx-auto mb-3 h-12 w-12 rounded-lg object-cover" />
                  ) : (
                    <span className="industry-emoji mb-3 block text-2xl">{item.emoji}</span>
                  )}
                  <h3 className="mb-1 text-[15.5px] font-bold text-dark transition-colors group-hover:text-white">
                    {item.name}
                  </h3>
                  <p className="text-[12.5px] text-muted transition-colors group-hover:text-gray-300">
                    {item.desc}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
