"use client";

import { useEffect, useRef, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import type { HeroMetrics } from "./liveMetrics";

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

/**
 * Counts up from zero once, on entering the viewport.
 *
 * `target` is the initial state, so the server-rendered HTML carries the real
 * figure. Non-rendering AI crawlers read the truth; Googlebot keeps the truth
 * for anything below its viewport. Reduced motion skips the animation.
 */
function useCountUp(target: number, run: boolean, duration = 900) {
  const [value, setValue] = useState(target);
  const animated = useRef(false);

  useEffect(() => {
    if (!run || animated.current) return;
    animated.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The first frame resolves to 0 on its own, so the count-up starts from
    // zero without a synchronous setState in the effect body.
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, run, duration]);

  return value;
}

/** Pointer-follow 3D tilt. Disabled for touch devices and reduced motion. */
function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(1100px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return ref;
}

function Ring({ value, run }: { value: number; run: boolean }) {
  const v = useCountUp(value, run);
  return (
    <div
      aria-hidden
      className="absolute right-3.5 top-3.5 grid h-[46px] w-[46px] place-items-center rounded-full"
      style={{ background: `conic-gradient(#FF4FA3 ${v}%, #eef0f4 0)` }}
    >
      <div className="grid h-[34px] w-[34px] place-items-center rounded-full bg-white text-[11px] font-bold text-dark">
        {v}
      </div>
    </div>
  );
}

export function Dashboard({ metrics }: { metrics: HeroMetrics }) {
  const t = useTranslations("Hero.metrics");
  const tf = useTranslations("Hero.floats");
  const format = useFormatter();
  const { ref, inView } = useInView<HTMLDivElement>();
  const tiltRef = useTilt<HTMLDivElement>();

  const seo = useCountUp(metrics.seoScore, inView);
  const speed = useCountUp(metrics.pageSpeed, inView);
  const accessibility = useCountUp(metrics.accessibilityScore, inView);
  const bestPractices = useCountUp(metrics.bestPracticesScore, inView);
  const measuredAt = format.dateTime(new Date(`${metrics.measuredAt}T12:00:00Z`), {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div ref={ref} className="dash-enter relative">
      <div
        ref={tiltRef}
        className="relative transition-transform duration-300 ease-out will-change-transform [transform-style:preserve-3d]"
      >
        <div className="absolute -top-4 right-0 z-10 [transform:translateZ(46px)] sm:-right-4 sm:-top-5">
          <div className="flex animate-bob items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13px] font-semibold shadow-card motion-reduce:animate-none">
            <span aria-hidden className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-white">
              ⚡
            </span>
            {tf("a", { score: metrics.pageSpeed })}
          </div>
        </div>
        <div className="absolute -bottom-4 left-0 z-10 [transform:translateZ(46px)] sm:-bottom-5 sm:-left-5">
          <div className="flex animate-bob items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13px] font-semibold shadow-card [animation-delay:0.4s] motion-reduce:animate-none">
            <span aria-hidden className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-white">
              ✓
            </span>
            {tf("b")}
          </div>
        </div>

        <div className="overflow-hidden rounded-[22px] border border-line bg-white shadow-lift">
          <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3.5">
            <div aria-hidden className="flex gap-1.5">
              <i className="block h-2.5 w-2.5 rounded-full bg-[#e2e6ec]" />
              <i className="block h-2.5 w-2.5 rounded-full bg-[#e2e6ec]" />
              <i className="block h-2.5 w-2.5 rounded-full bg-[#e2e6ec]" />
            </div>
            <span className="rounded-lg border border-line bg-white px-3 py-[5px] font-mono text-xs text-muted">
              saaleweb.de
            </span>
            <span aria-hidden className="w-7" />
          </div>

          <div className="p-5">
            <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Metric
                label={t("seoScore")}
                value={seo}
                ring={<Ring value={metrics.seoScore} run={inView} />}
                trend={`▲ ${t("seoTrend")}`}
              />
              <Metric
                label={t("pageSpeed")}
                value={speed}
                ring={<Ring value={metrics.pageSpeed} run={inView} />}
                trend={`▲ ${t("pageSpeedTrend")}`}
              />
            </div>

            <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Metric
                label={t("accessibility")}
                value={accessibility}
                ring={<Ring value={metrics.accessibilityScore} run={inView} />}
                trend={`▲ ${t("accessibilityTrend")}`}
              />
              <Metric
                label={t("bestPractices")}
                value={bestPractices}
                ring={<Ring value={metrics.bestPracticesScore} run={inView} />}
                trend={`▲ ${t("bestPracticesTrend")}`}
              />
            </div>

            <p className="mt-3.5 break-words text-[11px] leading-relaxed text-muted">
              {t("source")} · {measuredAt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  text,
  suffix,
  trend,
  pill,
  ring,
}: {
  label: string;
  value?: number;
  text?: string;
  suffix?: string;
  trend?: string;
  pill?: string;
  ring?: React.ReactNode;
}) {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-[14px] border border-line bg-white p-4">
      {ring}
      <div className="mb-2 break-words text-xs font-medium text-muted">{label}</div>
      <div
        className={`break-words font-bold leading-tight tracking-tight text-dark ${
          text ? "text-[22px]" : "text-[30px] leading-none"
        }`}
      >
        {text ?? value}
        {suffix && <small className="text-[15px] font-semibold text-muted">{suffix}</small>}
      </div>
      {trend && <div className="mt-1.5 break-words text-xs font-semibold text-emerald-700">{trend}</div>}
      {pill && (
        <div className="mt-3 inline-flex max-w-full items-center break-words rounded-md bg-brand-soft px-2.5 py-1 font-mono text-[11px] font-semibold text-brand-purple">
          {pill}
        </div>
      )}
    </div>
  );
}
