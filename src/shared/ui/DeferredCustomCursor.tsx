"use client";

import { useEffect, useState, type ComponentType } from "react";

/**
 * Touch devices never need the decorative cursor. Desktop users download it
 * only after their first pointer movement instead of during page hydration.
 */
export function DeferredCustomCursor() {
  const [Cursor, setCursor] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let active = true;
    const load = () => {
      void import("./CustomCursor").then((module) => {
        if (active) setCursor(() => module.CustomCursor);
      });
    };

    window.addEventListener("pointermove", load, { once: true, passive: true });
    return () => {
      active = false;
      window.removeEventListener("pointermove", load);
    };
  }, []);

  return Cursor ? <Cursor /> : null;
}
