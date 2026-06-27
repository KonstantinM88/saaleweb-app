import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/shared/ui/Reveal";
import { cn } from "@/shared/lib/cn";

export type CaseStudyCardView = {
  slug: string | null;
  title: string;
  badge: string;
  industry: string;
  goal: string;
  solution: string;
  result: string;
  cover: { image: string | null; color: string | null; label: string };
};

export type CaseStudyCardLabels = {
  industry: string;
  goal: string;
  solution: string;
  result: string;
  cta: string;
};

export function CaseStudyCard({
  item,
  labels,
  index,
}: {
  item: CaseStudyCardView;
  labels: CaseStudyCardLabels;
  index: number;
}) {
  const hex = item.cover.color?.startsWith("#");
  const isLocalImage = item.cover.image?.startsWith("/");
  const cardClass =
    "card-border-glow group/case relative flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-purple/20 hover:shadow-[0_30px_82px_-48px_rgba(139,92,246,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-4";

  const inner = (
    <>
      <div
        className={cn(
          "relative aspect-[3/2] overflow-hidden",
          item.cover.image ? "bg-[#fbf7fc]" : !hex ? item.cover.color ?? "bg-brand" : undefined,
        )}
        style={!item.cover.image && hex ? { background: item.cover.color ?? undefined } : undefined}
      >
        <span
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,79,163,0.10),transparent_34%),radial-gradient(circle_at_90%_18%,rgba(139,92,246,0.12),transparent_30%)] opacity-0 transition-opacity duration-500 group-hover/case:opacity-100"
        />
        {item.cover.image && isLocalImage ? (
          <Image
            src={item.cover.image}
            alt={item.title}
            fill
            sizes="(min-width: 1280px) 220px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain object-center transition-transform duration-700 ease-out group-hover/case:scale-[1.04]"
          />
        ) : item.cover.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.cover.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain object-center transition-transform duration-700 ease-out group-hover/case:scale-[1.04]"
          />
        ) : (
          <span className="absolute bottom-3.5 left-4 right-4 text-xl font-bold tracking-tight text-white transition-transform duration-700 ease-out group-hover/case:translate-x-1">
            {item.cover.label}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-[18px]">
        <span className="mb-3 w-fit rounded-md bg-brand-soft px-2 py-1 font-mono text-[11px] font-semibold text-brand-purple">
          {item.badge}
        </span>
        <h3 className="text-lg font-extrabold leading-tight text-dark">{item.title}</h3>

        <dl className="mt-4 grid gap-3 text-[13.5px]">
          <div>
            <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
              {labels.industry}
            </dt>
            <dd className="mt-1 font-semibold text-ink">{item.industry}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
              {labels.goal}
            </dt>
            <dd className="mt-1 text-muted">{item.goal}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
              {labels.solution}
            </dt>
            <dd className="mt-1 text-muted">{item.solution}</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
          <div>
            <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
              {labels.result}
            </span>
            <b className="mt-1 block text-[15px] leading-tight text-emerald-700">{item.result}</b>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-brand-purple">
            {labels.cta} <ArrowUpRight size={14} aria-hidden />
          </span>
        </div>
      </div>
    </>
  );

  return (
    <Reveal delay={index * 70} className="h-full">
      {item.slug ? (
        <Link href={{ pathname: "/projekte/[slug]", params: { slug: item.slug } }} className={cardClass}>
          {inner}
        </Link>
      ) : (
        <article className={cardClass}>{inner}</article>
      )}
    </Reveal>
  );
}
