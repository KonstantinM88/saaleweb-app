"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";

export type ProjectCard = {
  slug: string;
  title: string;
  tag: string;
  result: string;
  cover: { image: string | null; color: string | null };
};

const fallbackCovers = [
  "bg-brand",
  "bg-gradient-to-br from-sky-500 to-brand-purple",
  "bg-gradient-to-br from-amber-500 to-brand-pink",
  "bg-gradient-to-br from-emerald-500 to-brand-purple",
];

function fallbackCover(slug: string) {
  const index = Array.from(slug).reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return fallbackCovers[index % fallbackCovers.length];
}

function ProjectCover({ item }: { item: ProjectCard }) {
  const hex = item.cover.color?.startsWith("#");
  const colorClass = !hex ? item.cover.color ?? fallbackCover(item.slug) : undefined;
  const isLocalImage = item.cover.image?.startsWith("/");

  return (
    <div
      className={cn(
        "relative aspect-[3/2] overflow-hidden",
        item.cover.image ? "bg-[#fbf7fc]" : colorClass,
      )}
      style={!item.cover.image && hex ? { background: item.cover.color ?? undefined } : undefined}
    >
      {item.cover.image && isLocalImage ? (
        <Image
          src={item.cover.image}
          alt={item.title}
          fill
          sizes="(min-width: 1024px) 370px, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : item.cover.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.cover.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <span className="absolute bottom-4 left-4 right-4 text-xl font-bold leading-tight tracking-tight text-white">
          {item.title}
        </span>
      )}

      <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/[0.92] text-dark opacity-0 shadow-card transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <ArrowUpRight size={17} aria-hidden />
      </span>
    </div>
  );
}

export function ProjectGrid({
  items,
  allLabel,
  viewLabel,
}: {
  items: ProjectCard[];
  allLabel: string;
  viewLabel: string;
}) {
  const tags = useMemo(() => {
    const uniqueTags = new Set<string>();
    items.forEach((item) => item.tag && uniqueTags.add(item.tag));
    return Array.from(uniqueTags);
  }, [items]);

  const [activeTag, setActiveTag] = useState<string | null>(null);
  const filteredItems = activeTag
    ? items.filter((item) => item.tag === activeTag)
    : items;

  return (
    <div>
      {tags.length > 1 && (
        <div
          role="group"
          aria-label={allLabel}
          className="mb-8 flex flex-wrap gap-2"
        >
          <FilterChip
            label={allLabel}
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {tags.map((tag) => (
            <FilterChip
              key={tag}
              label={tag}
              active={activeTag === tag}
              onClick={() => setActiveTag(tag)}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Link
            key={item.slug}
            href={{ pathname: "/projekte/[slug]", params: { slug: item.slug } }}
            className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2"
          >
            <ProjectCover item={item} />
            <div className="flex flex-1 flex-col p-[18px]">
              {item.tag && (
                <span className="mb-2.5 w-fit rounded-md bg-brand-soft px-2 py-1 font-mono text-[11px] font-semibold text-brand-purple">
                  {item.tag}
                </span>
              )}
              <h2 className="text-lg font-bold text-dark transition-colors group-hover:text-brand-purple">
                {item.title}
              </h2>
              <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                {item.result ? (
                  <b className="text-[22px] leading-none text-emerald-700">{item.result}</b>
                ) : (
                  <span />
                )}
                <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#6D28D9]">
                  {viewLabel}
                  <ArrowUpRight size={14} aria-hidden />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2",
        active
          ? "border-transparent bg-dark text-white"
          : "border-line bg-white text-ink hover:border-brand-purple hover:text-brand-purple",
      )}
    >
      {label}
    </button>
  );
}
