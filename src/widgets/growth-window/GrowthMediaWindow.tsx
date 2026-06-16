"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";

const videoSrc = "/images/sections/premium-saas-technology.webm";
const posterSrc = "/images/sections/premium-saas-technology.webp";

export function GrowthMediaWindow({
  imageAlt,
  metric,
  status,
  badges,
}: {
  imageAlt: string;
  metric: string;
  status: string;
  badges: string[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const allowMotionRef = useRef(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    allowMotionRef.current = !reducedMotion;
    if (reducedMotion) return;

    const play = () => {
      void video.play().catch(() => {
        // Browser autoplay policies can still reject playback in edge cases.
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible) {
          play();
        } else {
          video.pause();
        }
      },
      { threshold: 0.38, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  function handlePointerEnter() {
    setIsHovered(true);
    if (!allowMotionRef.current) return;
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => {});
  }

  function handlePointerLeave() {
    setIsHovered(false);
    if (!isVisible) {
      videoRef.current?.pause();
    }
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "group relative min-h-[440px] overflow-hidden rounded-[28px] border border-line bg-dark shadow-[0_46px_120px_-62px_rgba(17,24,39,0.9)] transition-all duration-700 sm:min-h-[520px] md:min-h-[680px] md:rounded-[36px]",
        isVisible && "shadow-[0_60px_140px_-70px_rgba(139,92,246,0.75)]",
        isHovered && "border-brand-purple/50",
      )}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <video
        ref={videoRef}
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1400ms] ease-out",
          isVisible ? "scale-[1.025]" : "scale-100",
          isHovered && "scale-[1.055]",
        )}
        aria-label={imageAlt}
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterSrc}
      >
        <source src={videoSrc} type="video/webm" />
      </video>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_30%,rgba(255,79,163,0.10),transparent_34%),linear-gradient(180deg,rgba(17,24,39,0.08)_0%,rgba(17,24,39,0.02)_42%,rgba(17,24,39,0.44)_100%)] transition-opacity duration-700 group-hover:opacity-80" />

      <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3 rounded-full border border-white/20 bg-dark/40 px-4 py-3 text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl md:left-6 md:right-6 md:top-6">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-pink" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-purple" />
        </div>
        <span className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-white/60 sm:inline">
          SaaleWeb Growth OS
        </span>
        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
          {metric}
        </span>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 md:bottom-6 md:left-6 md:right-6">
        <div className="flex flex-wrap gap-2 md:gap-3">
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/20 bg-dark/50 px-3 py-2 text-xs font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl transition-transform duration-500 md:px-4 md:text-sm md:group-hover:-translate-y-1"
            >
              {badge}
            </span>
          ))}
        </div>
        <div className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-[0_18px_45px_-22px_rgba(255,79,163,0.9)] transition-transform duration-500 md:group-hover:-translate-y-1">
          <span className="h-2 w-2 rounded-full bg-white" />
          {status}
        </div>
      </div>
    </div>
  );
}
