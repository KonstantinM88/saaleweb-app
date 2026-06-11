import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { AppLocale } from "@/i18n/routing";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { SectionHeader } from "@/shared/ui/SectionHeader";

type StaticItem = { name: string; desc: string };
type Item = { name: string; desc: string; emoji: string; coverImage: string | null };
const emojis = ["🏨", "🍽️", "💇", "🏗️", "🔧", "🩺", "🏠", "⚖️"];

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
    emoji: emojis[i % emojis.length],
    coverImage: null,
  }));
  const dbItems = await getDbIndustries(locale);
  const items = dbItems.length >= fallback.length ? dbItems : fallback;

  return (
    <section id="industries" className="bg-surface py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className="group h-full rounded-2xl border border-line bg-white p-5 text-center transition-all hover:-translate-y-1 hover:bg-dark">
                {item.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.coverImage} alt="" className="mx-auto mb-3 h-12 w-12 rounded-lg object-cover" />
                ) : (
                  <span className="mb-3 block text-2xl">{item.emoji}</span>
                )}
                <h3 className="mb-1 text-[15.5px] font-bold text-dark transition-colors group-hover:text-white">
                  {item.name}
                </h3>
                <p className="text-[12.5px] text-muted transition-colors group-hover:text-gray-300">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
