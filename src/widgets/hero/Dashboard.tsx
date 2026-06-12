"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

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

function useCountUp(target: number, run: boolean, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
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
      className="absolute right-3.5 top-3.5 grid h-[46px] w-[46px] place-items-center rounded-full"
      style={{ background: `conic-gradient(#FF4FA3 ${v}%, #eef0f4 0)` }}
    >
      <div className="grid h-[34px] w-[34px] place-items-center rounded-full bg-white text-[11px] font-bold text-dark">
        {v}
      </div>
    </div>
  );
}

const bars = [28, 40, 36, 58, 64, 80, 76, 100];

export function Dashboard() {
  const t = useTranslations("Hero.metrics");
  const tf = useTranslations("Hero.floats");
  const { ref, inView } = useInView<HTMLDivElement>();
  const tiltRef = useTilt<HTMLDivElement>();

  const seo = useCountUp(98, inView);
  const speed = useCountUp(100, inView);
  const ai = useCountUp(92, inView);
  const leads = useCountUp(47, inView);

  return (
    <div ref={ref} className="dash-enter relative">
      <div
        ref={tiltRef}
        className="relative transition-transform duration-300 ease-out will-change-transform [transform-style:preserve-3d]"
      >
        <div className="absolute -top-4 right-0 z-10 [transform:translateZ(46px)] sm:-right-4 sm:-top-5">
          <div className="flex animate-bob items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13px] font-semibold shadow-card">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-white">↑</span>
            {tf("a")}
          </div>
        </div>
        <div className="absolute -bottom-4 left-0 z-10 [transform:translateZ(46px)] sm:-bottom-5 sm:-left-5">
          <div className="flex animate-bob items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13px] font-semibold shadow-card [animation-delay:0.4s]">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-white">★</span>
            {tf("b")}
          </div>
        </div>

        <div className="overflow-hidden rounded-[22px] border border-line bg-white shadow-lift">
          <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3.5">
            <div className="flex gap-1.5">
              <i className="block h-2.5 w-2.5 rounded-full bg-[#e2e6ec]" />
              <i className="block h-2.5 w-2.5 rounded-full bg-[#e2e6ec]" />
              <i className="block h-2.5 w-2.5 rounded-full bg-[#e2e6ec]" />
            </div>
            <span className="rounded-lg border border-line bg-white px-3 py-[5px] font-mono text-xs text-muted">
              saaleweb.de/dashboard
            </span>
            <span className="w-7" />
          </div>

          <div className="p-5">
            <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Metric label="SEO Score" value={seo} ring={<Ring value={98} run={inView} />} trend={`▲ ${t("seoTrend")}`} />
              <Metric label="PageSpeed" value={speed} ring={<Ring value={100} run={inView} />} trend="▲ Core Web Vitals" />
            </div>
            <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Metric label={t("aiVisibility")} value={ai} suffix="%" pill="ChatGPT · Gemini · Claude" />
              <Metric label={t("leads")} value={leads} trend="▲ +212 %" />
            </div>

            <div className="rounded-[14px] border border-line bg-white p-4">
              <div className="mb-3.5 flex justify-between text-xs font-medium text-muted">
                <span>{t("growth")}</span>
                <b className="text-[13px] text-dark">Q1 → Q4</b>
              </div>
              <div className="flex h-[74px] items-end gap-2.5">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md bg-brand opacity-90 transition-[height] duration-1000 ease-out"
                    style={{ height: inView ? `${h}%` : 0, transitionDelay: `${i * 70}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  suffix,
  trend,
  pill,
  ring,
}: {
  label: string;
  value: number;
  suffix?: string;
  trend?: string;
  pill?: string;
  ring?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[14px] border border-line bg-white p-4">
      {ring}
      <div className="mb-2 text-xs font-medium text-muted">{label}</div>
      <div className="text-[30px] font-bold leading-none tracking-tight text-dark">
        {value}
        {suffix && <small className="text-[15px] font-semibold text-muted">{suffix}</small>}
      </div>
      {trend && <div className="mt-1.5 text-xs font-semibold text-success">{trend}</div>}
      {pill && (
        <div className="mt-3 inline-flex items-center rounded-md bg-brand-soft px-2.5 py-1 font-mono text-[11px] font-semibold text-brand-purple">
          {pill}
        </div>
      )}
    </div>
  );
}
