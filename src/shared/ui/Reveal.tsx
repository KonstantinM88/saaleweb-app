"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";

type Direction = "up" | "left" | "right" | "zoom";

const hidden: Record<Direction, string> = {
  up: "translate-y-7 opacity-0 blur-[6px]",
  left: "-translate-x-8 opacity-0 blur-[6px]",
  right: "translate-x-8 opacity-0 blur-[6px]",
  zoom: "scale-[0.94] opacity-0 blur-[6px]",
};

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Note: with prefers-reduced-motion the global CSS disables transitions,
    // so the flip below is instant — no special-casing needed here.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        shown ? "translate-x-0 translate-y-0 scale-100 opacity-100 blur-0" : hidden[direction],
        className,
      )}
    >
      {children}
    </div>
  );
}
