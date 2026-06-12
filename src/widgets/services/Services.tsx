import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { AppLocale } from "@/i18n/routing";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { SectionHeader } from "@/shared/ui/SectionHeader";

type StaticItem = { title: string; desc: string };
type Item = { title: string; desc: string; icon: string; coverImage: string | null };
const icons = ["⌘", "↗", "⌖", "✦", "⟳", "⚡", "☁", "⛭", "◎"];

async function getDbServices(locale: AppLocale): Promise<Item[]> {
  try {
    const rows = await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: { translations: { where: { locale }, take: 1 } },
    });
    return rows.flatMap((row, i) => {
      const tr = row.translations[0];
      if (!tr) return [];
      return { title: tr.name, desc: tr.excerpt ?? "", icon: row.icon || icons[i % icons.length], coverImage: row.coverImage ?? null };
    });
  } catch {
    return [];
  }
}

export async function Services() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations({ locale, namespace: "Services" });
  const fallback = (t.raw("items") as StaticItem[]).map((item, i) => ({
    ...item,
    icon: icons[i % icons.length],
    coverImage: null,
  }));
  const dbItems = await getDbServices(locale);
  const items = dbItems.length >= fallback.length ? dbItems : fallback;

  return (
    <section id="services" className="bg-surface py-16 md:py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={i} delay={(i % 3) * 90} className="h-full">
              <article className="card-border-glow group h-full rounded-[18px] border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card">
                <div className="mb-[18px] grid h-[46px] w-[46px] place-items-center overflow-hidden rounded-[13px] bg-brand-soft text-brand-purple transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  {item.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.coverImage} alt="" className="h-full w-full object-cover" />
                  ) : (
                    item.icon
                  )}
                </div>
                <h3 className="mb-2 text-lg font-bold text-dark">{item.title}</h3>
                <p className="text-[14.5px] text-muted">{item.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-purple">
                  {t("more")}{" "}
                  <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
