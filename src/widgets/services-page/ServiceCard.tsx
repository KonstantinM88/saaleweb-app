import { Check, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/shared/ui/Reveal";
import { serviceMeta } from "./serviceMeta";

export type ServiceCardData = {
  name: string;
  slug: string;
  metaSlug: string;
  excerpt: string | null;
  coverImage: string | null;
};

export function ServiceCard({
  item,
  index,
  locale,
  outcomesLabel,
  moreLabel,
}: {
  item: ServiceCardData;
  index: number;
  locale: string;
  outcomesLabel: string;
  moreLabel: string;
}) {
  const meta = serviceMeta(item.metaSlug, index);
  const Icon = meta.icon;
  const outcomes = meta.outcomes(locale);

  return (
    <Reveal delay={(index % 3) * 90} className="h-full">
      <Link
        href={{ pathname: "/leistungen/[slug]", params: { slug: item.slug } }}
        className="card-border-glow group flex h-full flex-col rounded-[20px] border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift sm:p-7"
      >
        <div className="mb-5 grid h-12 w-12 place-items-center rounded-[14px] bg-brand-soft text-brand-purple transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
          {item.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.coverImage} alt="" className="h-full w-full rounded-[14px] object-cover" />
          ) : (
            <Icon size={24} aria-hidden />
          )}
        </div>

        <h3 className="text-[19px] font-bold text-dark transition-colors group-hover:text-brand-purple">
          {item.name}
        </h3>
        {item.excerpt && <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{item.excerpt}</p>}

        <div className="mt-5 border-t border-line pt-4">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
            {outcomesLabel}
          </p>
          <ul className="space-y-2">
            {outcomes.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-[14px] text-ink">
                <Check size={15} className="mt-[3px] shrink-0 text-success" aria-hidden />
                {o}
              </li>
            ))}
          </ul>
        </div>

        <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-purple">
          {moreLabel}
          <ArrowRight
            size={15}
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </Link>
    </Reveal>
  );
}
