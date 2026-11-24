"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { ANALYTICS_CONSENT_STORAGE_KEY, isGtmConfigured } from "@/features/analytics/gtm";
import { ATTRIBUTION_CONSENT_EVENT } from "@/features/analytics/attribution";

export type MobileCtaBarLabels = { consult: string; whatsapp: string };

const SHOW_AFTER_PX = 480;

/**
 * Phone-only sticky action bar for the homepage. It appears once the visitor
 * has scrolled past the hero, waits until the consent banner is answered so
 * the two never stack, and hides while the closing contact block is on
 * screen. The AI assistant launcher moves up via `body:has(...)` in
 * globals.css while the bar is visible.
 */
export function MobileCtaBar({
  labels,
  contactHref,
  whatsappHref,
}: {
  labels: MobileCtaBarLabels;
  contactHref: string;
  whatsappHref: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [consentDecided, setConsentDecided] = useState(false);
  const [consentBannerOpen, setConsentBannerOpen] = useState(false);
  const [contactInView, setContactInView] = useState(false);

  useEffect(() => {
    const readConsent = (event?: Event) => {
      let decided = !isGtmConfigured();
      try {
        const stored = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
        decided ||= stored === "granted" || stored === "denied";
      } catch {
        // An explicit choice still works when browser storage is unavailable.
      }
      const choice = event instanceof CustomEvent ? event.detail?.consent : undefined;
      setConsentDecided(decided || choice === "granted" || choice === "denied");
    };
    // Observe the actual banner, including a later reopening from settings.
    // Its first hydration render is empty; absence at that moment is not consent.
    const observer = new MutationObserver(() => {
      setConsentBannerOpen(Boolean(document.querySelector("[data-analytics-consent-banner]")));
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timer = window.setTimeout(() => {
      readConsent();
      setConsentBannerOpen(Boolean(document.querySelector("[data-analytics-consent-banner]")));
    }, 0);
    window.addEventListener(ATTRIBUTION_CONSENT_EVENT, readConsent);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener(ATTRIBUTION_CONSENT_EVENT, readConsent);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setScrolled(window.scrollY > SHOW_AFTER_PX));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const target = document.getElementById("contact");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setContactInView(entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  const visible = scrolled && consentDecided && !consentBannerOpen && !contactInView;

  return (
    <div
      data-mobile-cta={visible ? "visible" : "hidden"}
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/92 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-16px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur-md transition-transform duration-300 ease-out md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div className="grid grid-cols-[1.4fr_1fr] gap-2">
        <a
          href={contactHref}
          tabIndex={visible ? 0 : -1}
          className="btn-shine inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-[14.5px] font-bold text-white"
        >
          <Send size={16} aria-hidden />
          {labels.consult}
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-[14.5px] font-bold text-emerald-800"
        >
          <MessageCircle size={16} aria-hidden />
          {labels.whatsapp}
        </a>
      </div>
    </div>
  );
}
