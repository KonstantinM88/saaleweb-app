import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/shared/ui/Reveal";
import { IndustryGlyph } from "./IndustryGlyph";

export type IndustryCardData = {
  name: string;
  slug: string;
  canonicalSlug: string;
  excerpt: string | null;
  coverImage: string | null;
};

export function IndustryCard({
  item,
  index,
  moreLabel,
}: {
  item: IndustryCardData;
  index: number;
  moreLabel: string;
}) {
  return (
    <Reveal delay={(index % 3) * 80} className="h-full">
      <Link
        href={{ pathname: "/branchen/[slug]", params: { slug: item.slug } }}
        className="card-border-glow group flex h-full flex-col rounded-[20px] border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift sm:p-7"
      >
        <div className="mb-5 grid h-12 w-12 place-items-center overflow-hidden rounded-[14px] bg-brand-soft text-brand-purple transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
          {item.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.coverImage} alt="" className="h-full w-full rounded-[14px] object-cover" />
          ) : (
            <IndustryGlyph slug={item.canonicalSlug} name={item.name} size={24} />
          )}
        </div>
        <h2 className="text-[19px] font-bold text-dark transition-colors group-hover:text-brand-purple">
          {item.name}
        </h2>
        {item.excerpt && <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">{item.excerpt}</p>}
        <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-purple">
          {moreLabel}
          <ArrowRight size={15} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </Link>
    </Reveal>
  );
}
