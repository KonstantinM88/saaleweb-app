"use client";

import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/cn";
import type { TocItem } from "@/shared/lib/markdown";

export function Toc({ items, title }: { items: TocItem[]; title: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.1 },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label={title} className="text-sm">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.1em] text-muted">{title}</p>
      <ul className="space-y-2 border-l border-line">
        {items.map((item) => (
          <li key={item.id} className={item.depth === 3 ? "pl-7" : "pl-4"}>
            <a
              href={`#${item.id}`}
              className={cn(
                "-ml-px block border-l-2 py-0.5 transition-colors",
                active === item.id
                  ? "border-brand-pink font-medium text-brand-purple"
                  : "border-transparent text-muted hover:text-ink",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
