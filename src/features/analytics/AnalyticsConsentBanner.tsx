"use client";

import { useEffect, useState } from "react";
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  updateAnalyticsConsent,
  type AnalyticsConsent,
} from "./gtm";

export type AnalyticsConsentLabels = {
  title: string;
  text: string;
  accept: string;
  reject: string;
  settings: string;
  privacy: string;
};

export function AnalyticsConsentBanner({
  labels,
  privacyHref,
}: {
  labels: AnalyticsConsentLabels;
  privacyHref: string;
}) {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setOpen(window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY) === null);
      } catch {
        setOpen(true);
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const choose = (value: AnalyticsConsent) => {
    try {
      window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, value);
    } catch {
      // Consent still applies for the current page even if storage is blocked.
    }
    updateAnalyticsConsent(value);
    setOpen(false);
  };

  if (!ready) return null;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-3 left-3 z-[75] rounded-full border border-line bg-white/90 px-3 py-2 text-[11px] font-bold text-slate-600 shadow-lg backdrop-blur transition hover:border-brand-purple/40 hover:text-brand-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
      >
        {labels.settings}
      </button>
    );
  }

  return (
    <aside
      aria-live="polite"
      aria-label={labels.title}
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-2xl rounded-[22px] border border-white/70 bg-slate-950/[0.96] p-5 text-white shadow-[0_28px_90px_-34px_rgba(15,23,42,0.92)] backdrop-blur-xl sm:bottom-5 sm:p-6"
    >
      <p className="text-base font-extrabold">{labels.title}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-slate-300">{labels.text}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => choose("granted")}
          className="btn-shine min-h-11 rounded-xl bg-brand px-4 py-2.5 text-sm font-extrabold text-white"
        >
          {labels.accept}
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="min-h-11 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
        >
          {labels.reject}
        </button>
        <a
          href={privacyHref}
          className="px-2 py-2 text-xs font-semibold text-slate-300 underline decoration-white/30 underline-offset-4 hover:text-white"
        >
          {labels.privacy}
        </a>
      </div>
    </aside>
  );
}
