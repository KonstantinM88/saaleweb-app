"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function parseStat(value: string) {
  const match = value.match(/-?\d+(?:[.,]\d+)?/);
  if (!match || match.index === undefined) return null;

  const numberText = match[0];
  const separator = numberText.includes(",") ? "," : ".";
  const decimals =
    numberText.includes(",") || numberText.includes(".")
      ? numberText.split(/[.,]/)[1]?.length ?? 0
      : 0;

  return {
    target: parseFloat(numberText.replace(",", ".")),
    prefix: value.slice(0, match.index),
    suffix: value.slice(match.index + numberText.length),
    separator,
    decimals,
  };
}

export function CountUp({ value, duration = 1300 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = useMemo(() => parseStat(value), [value]);
  const startValue = parsed
    ? `${parsed.prefix}${(0).toFixed(parsed.decimals).replace(".", parsed.separator)}${parsed.suffix}`
    : value;
  const [display, setDisplay] = useState(startValue);

  useEffect(() => {
    const el = ref.current;
    if (!el || !parsed) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(frame);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const next = (parsed.target * eased)
            .toFixed(parsed.decimals)
            .replace(".", parsed.separator);
          setDisplay(`${parsed.prefix}${next}${parsed.suffix}`);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [duration, parsed, value]);

  return <span ref={ref}>{display}</span>;
}
