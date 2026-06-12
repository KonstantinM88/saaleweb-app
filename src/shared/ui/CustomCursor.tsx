"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wrap = wrapRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!wrap || !dot || !ring) return;

    document.documentElement.classList.add("custom-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let px = mx;
    let py = my;
    let lastAngle = 0;
    let raf = 0;

    const onMove = (event: MouseEvent) => {
      mx = event.clientX;
      my = event.clientY;
      wrap.classList.remove("is-hidden");

      const target = event.target as Element | null;
      wrap.classList.toggle(
        "is-hover",
        Boolean(target?.closest("a,button,[role='button'],label,summary,.magnetic")),
      );
      wrap.classList.toggle(
        "is-text",
        Boolean(target?.closest("input,textarea,select,[contenteditable='true']")),
      );
    };
    const onDown = () => wrap.classList.add("is-down");
    const onUp = () => wrap.classList.remove("is-down");
    const onLeave = () => wrap.classList.add("is-hidden");

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      const vx = mx - px;
      const vy = my - py;
      px = mx;
      py = my;

      const speed = Math.min(Math.hypot(vx, vy), 40);
      if (speed > 1.5) lastAngle = (Math.atan2(vy, vx) * 180) / Math.PI;
      const stretch = 1 + speed * 0.009;
      const tiltX = Math.max(-16, Math.min(16, -vy * 0.55));
      const tiltY = Math.max(-16, Math.min(16, vx * 0.55));

      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      ring.style.transform =
        `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) ` +
        `perspective(460px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) ` +
        `rotate(${lastAngle.toFixed(1)}deg) scaleX(${stretch.toFixed(3)}) scaleY(${(1 / stretch).toFixed(3)})`;

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className="cursor-layer is-hidden">
      <div ref={ringRef} className="cursor-ring">
        <div className="cursor-ring-core" />
      </div>
      <div ref={dotRef} className="cursor-dot">
        <div className="cursor-dot-core" />
      </div>
    </div>
  );
}
