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

/**
 * Counts a number up when it scrolls into view.
 *
 * The final value is what gets server-rendered, so the static HTML always
 * carries the real figure. Crawlers that skip JavaScript (GPTBot, ClaudeBot,
 * PerplexityBot) read the correct number, and Googlebot — which renders in a
 * tall viewport and barely scrolls — keeps the real number for every element
 * it never scrolls to. Zeroing happens inside the IntersectionObserver
 * callback, immediately before the first animation frame, so a human still
 * sees the count-up without a visible flash.
 */
export function CountUp({ value, duration = 1300 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = useMemo(() => parseStat(value), [value]);
  const [display, setDisplay] = useState(value);
  const [lastValue, setLastValue] = useState(value);

  // Adjust state during render when the incoming value changes, rather than in
  // an effect, so no cascading render is scheduled.
  if (lastValue !== value) {
    setLastValue(value);
    setDisplay(value);
  }

  useEffect(() => {
    const el = ref.current;
    if (!el || !parsed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const format = (n: number) =>
      `${parsed.prefix}${n.toFixed(parsed.decimals).replace(".", parsed.separator)}${parsed.suffix}`;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        setDisplay(format(0));
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(progress < 1 ? format(parsed.target * eased) : value);
          if (progress < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [duration, parsed, value]);

  return <span ref={ref}>{display}</span>;
}
