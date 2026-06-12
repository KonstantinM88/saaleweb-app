"use client";

import { useEffect, useState } from "react";

/** Thin gradient reading-progress bar (mounted at the bottom edge of the navbar). */
export function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        setP(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <span
      aria-hidden
      className="absolute bottom-[-1px] left-0 z-10 block h-[2px] rounded-r-full bg-brand"
      style={{ width: `${p * 100}%` }}
    />
  );
}
