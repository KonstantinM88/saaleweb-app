"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { BrandText } from "@/shared/ui/BrandText";
import { cn } from "@/shared/lib/cn";

export type QA = { q: string; a: string };

/**
 * `initialVisible` keeps long lists short: the remaining items stay in the
 * DOM (hidden with `hidden`, so the text remains in the server HTML) until
 * the visitor asks for more.
 */
export function FaqAccordion({
  items,
  initialVisible,
  moreLabel,
  lessLabel,
}: {
  items: QA[];
  initialVisible?: number;
  moreLabel?: string;
  lessLabel?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [expanded, setExpanded] = useState(false);
  const limit = initialVisible && initialVisible < items.length ? initialVisible : items.length;
  const hiddenCount = items.length - limit;

  return (
    <div className="mx-auto grid max-w-[780px] gap-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        const collapsed = !expanded && i >= limit;
        return (
          <div
            key={i}
            hidden={collapsed}
            className="overflow-hidden rounded-[14px] border border-line bg-white"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-[22px] py-5 text-left text-base font-semibold text-dark"
            >
              <span>
                <BrandText text={item.q} />
              </span>
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-[7px] transition-all",
                  open ? "rotate-45 bg-brand text-white" : "bg-surface text-brand-purple",
                )}
              >
                <Plus size={16} />
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-[22px] pb-5 text-[15px] text-muted">
                  <BrandText text={item.a} />
                </p>
              </div>
            </div>
          </div>
        );
      })}
      {hiddenCount > 0 && moreLabel ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mx-auto mt-2 inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-2.5 text-[14px] font-bold text-dark transition hover:border-brand-purple hover:text-brand-purple"
        >
          {expanded ? lessLabel ?? moreLabel : `${moreLabel} (${hiddenCount})`}
        </button>
      ) : null}
    </div>
  );
}
