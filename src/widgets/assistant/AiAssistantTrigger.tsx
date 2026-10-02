"use client";

import type { AppLocale } from "@/i18n/routing";
import { trackGtmEvent } from "@/features/analytics/gtm";
import { BrandMonogram } from "@/shared/ui/BrandLogo";
import type { AiAssistantWidgetLabels } from "./AiAssistantWidget";

export function AiAssistantTrigger({
  locale,
  labels,
  pageScrolled,
  logoNudge = false,
  loading = false,
  onPrepare,
  onOpen,
}: {
  locale: AppLocale;
  labels: AiAssistantWidgetLabels;
  pageScrolled: boolean;
  logoNudge?: boolean;
  loading?: boolean;
  onPrepare?: () => void;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        trackGtmEvent("ai_assistant_open", {
          page_path: window.location.pathname,
          widget_locale: locale,
        });
        onOpen();
      }}
      disabled={loading}
      onPointerEnter={onPrepare}
      onFocus={onPrepare}
      className={`assistant-glass-trigger pointer-events-auto group ml-auto flex self-end items-center gap-3 rounded-full p-1.5 pr-3 text-white transition duration-500 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple motion-reduce:transition-none sm:pr-4 ${
        pageScrolled ? "assistant-glass-trigger--scrolled" : ""
      }`}
      aria-label={labels.open}
      aria-expanded={false}
      aria-busy={loading}
    >
      <span
        className={`assistant-glass-orb relative z-[2] grid h-12 w-12 shrink-0 place-items-center rounded-full transition duration-500 group-hover:scale-105 sm:h-13 sm:w-13 ${
          logoNudge ? "assistant-logo-nudge" : ""
        }`}
      >
        <span aria-hidden className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-brand-purple/15" />
        <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full sm:h-10 sm:w-10" aria-hidden="true">
          <BrandMonogram className="h-full w-full" />
        </span>
      </span>
      <span className="relative z-[2] hidden min-w-0 pr-1 text-left sm:block">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-fuchsia-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.85)]" aria-hidden />
          {labels.badge}
        </span>
        <span className="mt-0.5 block max-w-[210px] text-sm font-extrabold leading-snug text-white">
          {labels.open}
        </span>
      </span>
    </button>
  );
}
