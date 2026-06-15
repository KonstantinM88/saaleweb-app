"use client";

import Image from "next/image";
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
      <Image
        src="/images/comparison/old-fashioned.webp"
        alt=""
        fill
        sizes="(min-width: 768px) 860px, calc(100vw - 32px)"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <Image
          src="/images/comparison/premium-modern.webp"
          alt=""
          fill
          sizes="(min-width: 768px) 860px, calc(100vw - 32px)"
          draggable={false}
          className="h-full w-full object-cover"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_32%),linear-gradient(180deg,rgba(17,24,39,0.08),rgba(17,24,39,0.18))]"
      />

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
