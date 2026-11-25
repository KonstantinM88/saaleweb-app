import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/shared/ui/Reveal";
import { cn } from "@/shared/lib/cn";
import { ProjectDevices } from "@/shared/ui/ProjectDevices";

export type CaseStudyCardView = {
  slug: string | null;
  title: string;
  badge: string;
  industry: string;
  goal: string;
  solution: string;
  benefits: string[];
  result: string;
  liveSite?: { url: string; label: string };
  report?: { source: string; text: string; url: string; linkLabel: string };
  cover: { image: string | null; mobileImage?: string; domain?: string; color: string | null; label: string };
};

export type CaseStudyCardLabels = {
  industry: string;
  goal: string;
  solution: string;
  benefits: string;
  result: string;
  cta: string;
  desktop: string;
  mobile: string;
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
  // Keep the two projects with owner feedback prominent; the remaining examples
  // stay discoverable without repeating another full image-and-detail block.
  if (index >= 2) {
    const content = <>
      <span className="font-mono text-[11px] font-semibold text-brand-purple">{item.badge}</span>
      <h3 className="mt-2 text-lg font-extrabold leading-tight text-dark">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{item.solution}</p>
      <span className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#6D28D9]">{labels.cta}<ArrowUpRight size={15} aria-hidden /></span>
    </>;
    return <Reveal delay={index * 70} className="h-full lg:col-span-3">
      <article className="flex h-full flex-col rounded-[18px] border border-line bg-white transition hover:border-brand-purple/25">
        {item.slug ? <Link href={{ pathname: "/projekte/[slug]", params: { slug: item.slug } }} prefetch={false} className="block flex-1 rounded-[18px] p-5 outline-hidden focus-visible:ring-2 focus-visible:ring-[#6D28D9]">{content}</Link> : <div className="p-5">{content}</div>}
        {item.liveSite && <a href={item.liveSite.url} target="_blank" rel="noopener noreferrer" className="mx-5 mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#6D28D9] hover:underline">{item.liveSite.label}<ArrowUpRight size={15} aria-hidden /></a>}
      </article>
    </Reveal>;
  }
  const hex = item.cover.color?.startsWith("#");
  const isLocalImage = item.cover.image?.startsWith("/");
  const isLegacyMockup = item.cover.image?.startsWith("/images/cases/");
  const cardClass =
    "card-border-glow group/case relative flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-purple/20 hover:shadow-[0_30px_82px_-48px_rgba(139,92,246,0.6)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-4";

  const inner = (
    <>
      {item.cover.image && item.cover.mobileImage ? <ProjectDevices desktop={item.cover.image} mobile={item.cover.mobileImage} name={item.title} domain={item.cover.domain ?? ""} desktopLabel={labels.desktop} mobileLabel={labels.mobile} /> : <div
        className={cn(
          "relative overflow-hidden",
          isLegacyMockup ? "aspect-[1536/737]" : "aspect-3/2",
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
            sizes={index < 2 ? "(min-width: 1280px) 570px, (min-width: 640px) 50vw, 100vw" : "(min-width: 1280px) 375px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className={cn("object-cover transition-transform duration-700 ease-out group-hover/case:scale-[1.04]", isLegacyMockup ? "object-top" : "object-center")}
          />
        ) : item.cover.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.cover.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover/case:scale-[1.04]"
          />
        ) : (
          <span className="absolute bottom-3.5 left-4 right-4 text-xl font-bold tracking-tight text-white transition-transform duration-700 ease-out group-hover/case:translate-x-1">
            {item.cover.label}
          </span>
        )}
      </div>}

      <div className="flex flex-1 flex-col p-[18px]">
        <span className="mb-3 w-fit rounded-md bg-brand-soft px-2 py-1 font-mono text-[11px] font-semibold text-brand-purple">
          {item.badge}
        </span>
        <h3 className="text-lg font-extrabold leading-tight text-dark">{item.title}</h3>

        <dl className="mt-4 grid gap-3 text-[13.5px]">
          <div>
            <dt className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
              {labels.industry}
            </dt>
            <dd className="mt-1 font-semibold text-ink">{item.industry}</dd>
          </div>
          {index < 2 && <div>
            <dt className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
              {labels.goal}
            </dt>
            <dd className="mt-1 text-muted">{item.goal}</dd>
          </div>}
          <div>
            <dt className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
              {labels.solution}
            </dt>
            <dd className="mt-1 text-muted">{item.solution}</dd>
          </div>
        </dl>

        {index < 2 && item.benefits.length > 0 ? (
          <div className="mt-4 rounded-[14px] border border-emerald-100 bg-emerald-50 p-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
              {labels.benefits}
            </span>
            <ul className="mt-2 grid gap-1.5 text-[12.5px] font-medium leading-snug text-ink">
              {item.benefits.slice(0, 3).map((benefit) => (
                <li key={benefit} className="flex gap-2">
                  <Check
                    size={13}
                    strokeWidth={2.5}
                    aria-hidden
                    className="mt-[2px] shrink-0 text-emerald-700"
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-auto border-t border-line pt-4">
          <div className="min-w-0">
            <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
              {labels.result}
            </span>
            <b className="mt-1 block text-[15px] leading-tight text-emerald-700">{item.result}</b>
          </div>
          <span className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-soft px-3 py-2.5 text-[13px] font-semibold text-brand-purple transition-all duration-300 group-hover/case:bg-brand group-hover/case:text-white">
            {labels.cta} <ArrowUpRight size={14} aria-hidden />
          </span>
        </div>
      </div>
    </>
  );

  return (
    <Reveal delay={index * 70} className={cn("h-full", index < 2 ? "lg:col-span-3" : "lg:col-span-2")}>
      <article className={cardClass}>
      {item.slug ? (
        <Link href={{ pathname: "/projekte/[slug]", params: { slug: item.slug } }} prefetch={false} className="flex flex-1 flex-col outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#6D28D9]">
          {inner}
        </Link>
      ) : (
        <div className="flex flex-1 flex-col">{inner}</div>
      )}
      {item.report && <div className="border-t border-emerald-100 bg-emerald-50 px-[18px] py-4"><p className="text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-800">{item.report.source}</p><p className="mt-2 text-[14px] font-semibold leading-relaxed text-ink">{item.report.text}</p><a href={item.report.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-[#6D28D9] hover:underline">{item.report.linkLabel}<ArrowUpRight size={15} aria-hidden /></a></div>}
      </article>
    </Reveal>
  );
}
