import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import type { AppLocale } from "@/i18n/routing";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { cn } from "@/shared/lib/cn";

type StaticItem = { tag: string; title: string; desc: string; result: string; name: string };
type Card = {
  slug: string | null;
  tag: string;
  title: string;
  desc: string;
  result: string;
  cover: { image: string | null; color: string | null; label: string };
};

const covers = [
  "bg-brand",
  "bg-gradient-to-br from-sky-500 to-brand-purple",
  "bg-gradient-to-br from-amber-500 to-brand-pink",
];

async function getDbCases(locale: AppLocale): Promise<Card[]> {
  try {
    const rows = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      take: 4,
      include: {
        translations: { where: { locale }, take: 1 },
        category: { include: { translations: { where: { locale }, take: 1 } } },
        media: { orderBy: { order: "asc" }, take: 1 },
      },
    });
    return rows.flatMap((row, i) => {
      const tr = row.translations[0];
      if (!tr) return [];
      const tag = row.category?.translations?.[0]?.name ?? "";
      return {
        slug: tr.slug,
        tag,
        title: tr.title,
        desc: tr.challenge ?? tr.results ?? "",
        result: row.resultValue ?? "",
        cover: {
          image: row.media?.[0]?.url ?? null,
          color: row.coverColor ?? covers[i % covers.length],
          label: tr.title,
        },
      } as Card;
    });
  } catch {
    return [];
  }
}

export async function CaseStudies() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations({ locale, namespace: "CaseStudies" });
  const tp = await getTranslations({ locale, namespace: "Projects" });
  const fallback: Card[] = (t.raw("items") as StaticItem[]).map((item, i) => ({
    slug: null,
    tag: item.tag,
    title: item.title,
    desc: item.desc,
    result: item.result,
    cover: { image: null, color: covers[i % covers.length], label: item.name },
  }));
  const dbItems = await getDbCases(locale);
  const items = dbItems.length >= fallback.length ? dbItems : fallback;

  return (
    <section id="cases" className="py-16 md:py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item, i) => {
            const hex = item.cover.color?.startsWith("#");
            const isLocalImage = item.cover.image?.startsWith("/");
            const inner = (
              <>
                <div
                  className={cn(
                    "relative aspect-[3/2] overflow-hidden",
                    item.cover.image ? "bg-[#fbf7fc]" : !hex ? item.cover.color ?? "bg-brand" : undefined,
                  )}
                  style={!item.cover.image && hex ? { background: item.cover.color ?? undefined } : undefined}
                >
                  {item.cover.image && isLocalImage ? (
                    <Image
                      src={item.cover.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1280px) 278px, (min-width: 640px) 50vw, 100vw"
                      className="object-contain object-center"
                    />
                  ) : item.cover.image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.cover.image}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-contain object-center"
                      />
                    </>
                  ) : (
                    <span className="absolute bottom-3.5 left-4 text-xl font-bold tracking-tight text-white">
                      {item.cover.label}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-[18px]">
                  {item.tag && (
                    <span className="mb-2.5 w-fit rounded-md bg-brand-soft px-2 py-1 font-mono text-[11px] font-semibold text-brand-purple">
                      {item.tag}
                    </span>
                  )}
                  <h3 className="mb-1.5 text-lg font-bold text-dark">{item.title}</h3>
                  <p className="text-sm text-muted">{item.desc}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-line pt-3.5">
                    <b className="text-[22px] text-emerald-700">{item.result}</b>
                    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-purple">
                      {t("link")} <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </>
            );
            const cardClass =
              "flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white transition-all hover:-translate-y-1.5 hover:border-transparent hover:shadow-lift";
            return (
              <Reveal key={i} delay={i * 80}>
                {item.slug ? (
                  <Link href={{ pathname: "/projekte/[slug]", params: { slug: item.slug } }} className={cardClass}>
                    {inner}
                  </Link>
                ) : (
                  <article className={cardClass}>{inner}</article>
                )}
              </Reveal>
            );
          })}
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
