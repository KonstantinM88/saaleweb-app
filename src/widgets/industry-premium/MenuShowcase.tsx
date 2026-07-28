"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ImageIcon, Play, X } from "lucide-react";
import type { MenuCategory, MenuDish } from "./types";

type Props = {
  categories: MenuCategory[];
  categoriesLabel: string;
  allergenLabel: string;
  demoLabel: string;
  videoLabel: string;
  closeVideoLabel: string;
  videoUnsupported: string;
};

/**
 * Delta 35 — the signature element of the restaurant landing page.
 *
 * A working miniature of the menu system SaaleWeb actually ships (see the
 * Waldschlösschen and Neue Liebe references): switchable categories, one entry
 * per dish with image slot, badges, allergens and price. Content is example
 * data and labelled as such; the structure is the real one.
 */
export function MenuShowcase({
  categories,
  categoriesLabel,
  allergenLabel,
  demoLabel,
  videoLabel,
  closeVideoLabel,
  videoUnsupported,
}: Props) {
  const [active, setActive] = useState(0);
  const [activeVideo, setActiveVideo] = useState<MenuDish | null>(null);
  const id = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const videoTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!activeVideo) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setActiveVideo(null);
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
      window.requestAnimationFrame(() => videoTriggerRef.current?.focus());
    };
  }, [activeVideo]);

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % categories.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index - 1 + categories.length) % categories.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = categories.length - 1;
    }

    if (next === null) return;

    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="rest-menu overflow-hidden rounded-[28px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] p-5 md:px-7 md:py-6">
        <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-white/45">
          {categoriesLabel}
        </p>
        <span className="rounded-full border border-[#C25A6E]/35 bg-[#C25A6E]/12 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#E3909F]">
          {demoLabel}
        </span>
      </div>

      <div className="border-b border-white/[0.08] px-5 py-4 md:px-7">
        <div role="tablist" aria-label={categoriesLabel} className="flex flex-wrap gap-2">
          {categories.map((category, index) => {
            const selected = index === active;
            return (
              <button
                key={category.name}
                type="button"
                role="tab"
                id={`${id}-tab-${index}`}
                aria-selected={selected}
                aria-controls={`${id}-panel-${index}`}
                tabIndex={selected ? 0 : -1}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                onClick={() => setActive(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`rest-tab min-h-10 rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${
                  selected ? "rest-tab--active" : ""
                }`}
              >
                {category.name}
                <span className="ml-2 font-mono text-[11px] font-bold opacity-60">{category.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Every panel is rendered into the DOM, not just the active one: the
          whole argument of this page is that dishes must exist as crawlable
          text. Inactive panels are hidden, never unmounted. */}
      {categories.map((category, index) => (
        <div
          key={category.name}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={index !== active}
        >
          <div className="p-5 md:p-7">
            <p className="text-[14px] leading-relaxed text-white/50">{category.note}</p>
            <ul className="mt-5 grid gap-3">
              {category.dishes.map((dish) => (
                <li key={dish.name} className="rest-dish flex gap-4 rounded-[20px] p-4">
                  {dish.image && dish.video ? (
                    <button
                      type="button"
                      className="rest-dish-media rest-dish-media--photo rest-dish-media--interactive"
                      aria-label={`${videoLabel}: ${dish.name}`}
                      onClick={(event) => {
                        videoTriggerRef.current = event.currentTarget;
                        setActiveVideo(dish);
                      }}
                    >
                      <Image
                        src={dish.image}
                        alt={dish.imageAlt ?? dish.name}
                        fill
                        sizes="(min-width: 640px) 84px, 72px"
                        className="rounded-[inherit] object-cover"
                      />
                      <Play size={11} className="rest-dish-play" aria-hidden />
                    </button>
                  ) : dish.image ? (
                    <span className="rest-dish-media rest-dish-media--photo">
                      <Image
                        src={dish.image}
                        alt={dish.imageAlt ?? dish.name}
                        fill
                        sizes="(min-width: 640px) 84px, 72px"
                        className="rounded-[inherit] object-cover"
                      />
                    </span>
                  ) : (
                    <span aria-hidden className="rest-dish-media">
                      <ImageIcon size={17} className="text-[#E3909F]" />
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h4 className="text-[15.5px] font-extrabold leading-snug text-white">{dish.name}</h4>
                      <p className="rest-figure shrink-0 text-[15.5px] font-extrabold text-[#E8B4BF]">
                        {dish.price}
                      </p>
                    </div>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/55">{dish.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {dish.badges.map((badge) => (
                        <span key={badge} className="rest-badge">
                          {badge}
                        </span>
                      ))}
                      {dish.allergens ? (
                        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/35">
                          {allergenLabel}: {dish.allergens}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {activeVideo?.video && typeof document !== "undefined"
        ? createPortal(
            <div
              className="rest-video-backdrop"
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setActiveVideo(null);
              }}
            >
              <section
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${id}-video-title`}
                className="rest-video-dialog"
              >
                <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-[#E3909F]">
                      {videoLabel}
                    </p>
                    <h3 id={`${id}-video-title`} className="mt-1 text-[18px] font-extrabold text-white sm:text-[20px]">
                      {activeVideo.name}
                    </h3>
                  </div>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    className="rest-video-close"
                    aria-label={closeVideoLabel}
                    onClick={() => setActiveVideo(null)}
                  >
                    <X size={19} aria-hidden />
                  </button>
                </div>
                <video
                  key={activeVideo.video}
                  className="aspect-[45/34] w-full bg-black object-cover"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  poster={activeVideo.image}
                >
                  <source src={activeVideo.video} type="video/webm" />
                  {videoUnsupported}
                </video>
              </section>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
