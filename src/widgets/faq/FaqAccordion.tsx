"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { BrandText } from "@/shared/ui/BrandText";
import { cn } from "@/shared/lib/cn";

export type QA = { q: string; a: string };

export function FaqAccordion({ items }: { items: QA[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto grid max-w-[780px] gap-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={i} className="overflow-hidden rounded-[14px] border border-line bg-white">
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
    </div>
  );
}
