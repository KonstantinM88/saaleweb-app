import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { AppLocale } from "@/i18n/routing";
import { Container } from "@/shared/ui/Container";

type StaticItem = { title: string; desc: string };
type Item = { title: string; desc: string; icon: string };
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
      return { title: tr.name, desc: tr.excerpt ?? "", icon: row.icon || icons[i % icons.length] };
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
  }));
  const dbItems = await getDbServices(locale);
  const items = dbItems.length >= fallback.length ? dbItems : fallback;

  return (
    <section id="services" className="bg-surface py-24">
      <Container>
        <div className="mx-auto mb-14 max-w-[680px] text-center">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2 className="mt-4 text-[clamp(28px,4vw,46px)] font-bold tracking-tight text-dark">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-[clamp(16px,1.6vw,19px)] text-muted">
            {t("lead")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <article
              key={i}
              className="rounded-[18px] border border-line bg-white p-7 transition-all hover:-translate-y-1 hover:border-transparent hover:shadow-card"
            >
              <div className="mb-[18px] grid h-[46px] w-[46px] place-items-center rounded-[13px] bg-brand-soft text-brand-purple">
                {item.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-dark">{item.title}</h3>
              <p className="text-[14.5px] text-muted">{item.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-purple">
                {t("more")} →
              </span>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
