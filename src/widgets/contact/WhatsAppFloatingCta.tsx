"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/shared/config/site";

const APPEAR_DELAY_MS = 10_000;

export type WhatsAppFloatingCtaLabels = {
  aria: string;
  eyebrow: string;
  title: string;
  prefill: string;
};

function withPrefilledMessage(url: string, message: string): string {
  if (/[?&]text=/.test(url)) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}text=${encodeURIComponent(message)}`;
}

function WhatsAppIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none" aria-hidden focusable="false">
      <path
        d="M16.04 3.2A12.82 12.82 0 0 0 5.15 22.88L3.8 28l5.25-1.27A12.82 12.82 0 1 0 16.04 3.2Z"
        fill="currentColor"
      />
      <path
        d="M11.83 9.55c-.31-.68-.62-.69-.9-.7h-.76c-.27 0-.7.1-1.07.5-.37.4-1.4 1.36-1.4 3.33 0 1.96 1.43 3.86 1.63 4.13.2.27 2.77 4.42 6.83 6.02 3.38 1.33 4.07 1.06 4.8 1 .73-.07 2.38-.97 2.72-1.9.34-.94.34-1.74.24-1.9-.1-.17-.37-.27-.77-.47-.4-.2-2.38-1.17-2.75-1.3-.37-.14-.64-.2-.9.2-.27.4-1.04 1.3-1.27 1.57-.24.27-.47.3-.87.1-.4-.2-1.68-.62-3.2-1.98-1.18-1.05-1.98-2.35-2.22-2.75-.23-.4-.02-.62.18-.82.18-.18.4-.47.6-.7.2-.24.27-.4.4-.67.14-.27.07-.5-.03-.7-.1-.2-.88-2.17-1.26-2.96Z"
        fill="white"
      />
    </svg>
  );
}

export function WhatsAppFloatingCta({ labels }: { labels: WhatsAppFloatingCtaLabels }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
      window.requestAnimationFrame(() => setVisible(true));
    }, APPEAR_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const href = withPrefilledMessage(siteConfig.phone.whatsappUrl, labels.prefill);

  return (
    <a
      aria-label={labels.aria}
      className={`group fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[70] flex items-center gap-3 rounded-full border border-white/35 bg-white/90 p-2 pr-2 text-dark shadow-[0_22px_60px_-26px_rgba(17,24,39,0.55)] backdrop-blur-xl transition duration-500 ease-out hover:-translate-y-1 hover:border-[#25D366]/60 hover:shadow-[0_24px_64px_-24px_rgba(37,211,102,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] motion-reduce:transition-none sm:right-6 sm:p-2.5 sm:pr-4 md:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] md:right-7 ${
        visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
      }`}
      href={href}
      rel="noreferrer"
      target="_blank"
      title={labels.aria}
    >
      <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_16px_34px_-16px_rgba(37,211,102,0.95)] transition group-hover:scale-105">
        <span aria-hidden className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 blur-xl" />
        <span className="relative">
          <WhatsAppIcon />
        </span>
      </span>
      <span className="hidden min-w-0 pr-1 sm:block">
        <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-[#128C7E]">
          {labels.eyebrow}
        </span>
        <span className="mt-0.5 block max-w-[210px] text-sm font-extrabold leading-snug text-dark">
          {labels.title}
        </span>
      </span>
    </a>
  );
}
