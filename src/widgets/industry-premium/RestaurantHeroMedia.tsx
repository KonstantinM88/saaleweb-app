"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";

type Props = {
  image: string;
  imageAlt: string;
  video: string;
  title: string;
  videoLabel: string;
  closeVideoLabel: string;
  videoUnsupported: string;
};

/**
 * Real hero media for the restaurant landing page.
 *
 * The optimized photo is the initial, LCP-friendly surface. The WebM clip is
 * mounted only after an explicit user action, so the hero demonstrates the
 * video-menu capability without downloading video during the initial render.
 */
export function RestaurantHeroMedia({
  image,
  imageAlt,
  video,
  title,
  videoLabel,
  closeVideoLabel,
  videoUnsupported,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  function closeVideo() {
    setIsPlaying(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <div className="relative mt-5 aspect-[45/34] overflow-hidden rounded-[20px] border border-white/[0.14] bg-[#120d0d]">
      {isPlaying ? (
        <>
          <video
            className="h-full w-full bg-black object-cover"
            controls
            autoPlay
            playsInline
            preload="metadata"
            poster={image}
            aria-label={`${videoLabel}: ${title}`}
          >
            <source src={video} type="video/webm" />
            {videoUnsupported}
          </video>
          <button
            type="button"
            onClick={closeVideo}
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/65 text-white shadow-lg backdrop-blur-md transition-colors hover:border-[#E3909F] hover:bg-[#8E2F43]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E3909F]"
            aria-label={closeVideoLabel}
          >
            <X size={18} aria-hidden />
          </button>
        </>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsPlaying(true)}
          className="group relative block h-full w-full overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#E3909F]"
          aria-label={`${videoLabel}: ${title}`}
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 42vw, (min-width: 640px) 80vw, calc(100vw - 64px)"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(12,7,8,0.72)_100%)]"
          />
          <span className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <span className="max-w-[75%] rounded-full border border-white/20 bg-black/50 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/90 backdrop-blur-md sm:text-[10.5px]">
              {videoLabel}
            </span>
            <span
              aria-hidden
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/55 bg-[#8E2F43]/90 text-white shadow-[0_10px_28px_rgba(0,0,0,0.32)] backdrop-blur-md transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
            >
              <Play size={17} className="translate-x-px fill-current" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
