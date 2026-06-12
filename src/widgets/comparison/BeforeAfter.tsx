"use client";

import { useEffect, useRef, useState } from "react";

export function BeforeAfter({ beforeLabel, afterLabel }: { beforeLabel: string; afterLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const interacted = useRef(false);
  const dragging = useRef(false);
  const [pos, setPos] = useState(50);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      if (interacted.current) return;
      setPos(50 + Math.sin((now - start) / 1400) * 12);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const setFromClientX = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(96, Math.max(4, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full cursor-ew-resize select-none overflow-hidden rounded-[20px] border border-line bg-white shadow-card sm:aspect-[16/9]"
      style={{ touchAction: "none" }}
      onPointerDown={(event) => {
        interacted.current = true;
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        setFromClientX(event.clientX);
      }}
      onPointerMove={(event) => {
        if (dragging.current) setFromClientX(event.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      <div className="absolute inset-0 bg-[#ece9e0]">
        <div className="flex h-[12%] items-center gap-2 bg-[#cfcabc] px-[3%]">
          <span className="h-[46%] w-[10%] rounded-sm bg-[#8e8a7d]" />
          <span className="ml-auto h-[26%] w-[8%] rounded-sm bg-[#a39e8f]" />
          <span className="h-[26%] w-[8%] rounded-sm bg-[#a39e8f]" />
          <span className="h-[26%] w-[8%] rounded-sm bg-[#a39e8f]" />
        </div>
        <div className="flex h-[8%] items-center bg-[#e7c84f]/70 px-[3%]">
          <span className="h-[30%] w-[55%] rounded-sm bg-[#9c8b3a]/70" />
        </div>
        <div className="grid h-[80%] grid-cols-[1.5fr_1fr] gap-[3%] p-[4%]">
          <div className="space-y-[5%]">
            <span className="block h-[7%] w-[70%] rounded-sm bg-[#b4af9f]" />
            <span className="block h-[4%] w-full rounded-sm bg-[#c9c4b4]" />
            <span className="block h-[4%] w-[92%] rounded-sm bg-[#c9c4b4]" />
            <span className="block h-[4%] w-[96%] rounded-sm bg-[#c9c4b4]" />
            <span className="block h-[4%] w-[40%] rounded-sm bg-[#7d9ec9] underline" />
            <span className="block h-[4%] w-[88%] rounded-sm bg-[#c9c4b4]" />
            <span className="block h-[4%] w-[60%] rounded-sm bg-[#c9c4b4]" />
            <span className="mt-[4%] inline-block h-[9%] w-[34%] rounded-sm border-2 border-[#8e8a7d] bg-[#d6d1c2]" />
          </div>
          <div className="relative rounded-sm border-2 border-[#b4af9f] bg-[#dcd7c8]">
            <span className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(45deg,transparent_48%,#b4af9f_48%,#b4af9f_52%,transparent_52%),linear-gradient(-45deg,transparent_48%,#b4af9f_48%,#b4af9f_52%,transparent_52%)]" />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-white" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <div className="flex h-[12%] items-center gap-2 border-b border-line bg-white/90 px-[3%]">
          <span className="grid aspect-square h-[46%] place-items-center rounded-md bg-brand text-[9px] font-extrabold text-white">
            S
          </span>
          <span className="ml-auto h-[22%] w-[7%] rounded-full bg-surface" />
          <span className="h-[22%] w-[7%] rounded-full bg-surface" />
          <span className="h-[42%] w-[11%] rounded-md bg-brand" />
        </div>
        <div className="relative h-[42%] overflow-hidden bg-gradient-to-br from-brand-pink to-brand-purple px-[4%] py-[3%]">
          <span className="block h-[16%] w-[44%] rounded-md bg-white/90" />
          <span className="mt-[2%] block h-[16%] w-[30%] rounded-md bg-white/60" />
          <span className="mt-[3%] inline-block h-[18%] w-[18%] rounded-full bg-white" />
          <span className="absolute -right-[6%] -top-[20%] h-[120%] w-[34%] rounded-full bg-white/15 blur-xl" />
        </div>
        <div className="grid h-[46%] grid-cols-3 gap-[3%] p-[4%]">
          {[0, 1, 2].map((card) => (
            <div key={card} className="rounded-xl border border-line bg-white p-[8%] shadow-card">
              <span className="block aspect-square w-[34%] rounded-lg bg-brand-soft" />
              <span className="mt-[10%] block h-[8%] w-[80%] rounded-sm bg-ink/70" />
              <span className="mt-[6%] block h-[6%] w-full rounded-sm bg-line" />
              <span className="mt-[5%] block h-[6%] w-[70%] rounded-sm bg-line" />
            </div>
          ))}
        </div>
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-md bg-dark/70 px-2.5 py-1 font-mono text-[11px] font-semibold text-white backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-md bg-brand px-2.5 py-1 font-mono text-[11px] font-semibold text-white">
        {afterLabel}
      </span>

      <div
        className="absolute inset-y-0 z-10 w-[2.5px] bg-white shadow-[0_0_12px_rgba(17,24,39,0.35)]"
        style={{ left: `${pos}%` }}
      >
        <button
          type="button"
          role="slider"
          aria-label={`${beforeLabel} / ${afterLabel}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              interacted.current = true;
              setPos((current) => Math.min(96, Math.max(4, current + (event.key === "ArrowLeft" ? -4 : 4))));
            }
          }}
          className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-brand text-[13px] font-bold text-white shadow-lift outline-none ring-white/60 focus-visible:ring-4"
        >
          &lt;&gt;
        </button>
      </div>
    </div>
  );
}
