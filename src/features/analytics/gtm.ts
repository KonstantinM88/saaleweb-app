"use client";

import { sendGTMEvent } from "@next/third-parties/google";

/** Public IDs are compiled into the client bundle intentionally. */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? "";
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
export const ANALYTICS_CONSENT_STORAGE_KEY = "saaleweb_analytics_consent";

export const GTM_EVENT_NAMES = [
  "page_view",
  "form_submit",
  "phone_click",
  "email_click",
  "telegram_click",
  "whatsapp_click",
  "booking_click",
  "audit_request",
  "scroll_depth",
  "outbound_link",
  "ai_assistant_open",
] as const;

export type GtmEventName = (typeof GTM_EVENT_NAMES)[number];
export type GtmEventValue = string | number | boolean | null | undefined;
export type GtmEventParameters = Record<string, GtmEventValue>;
export type AnalyticsConsent = "granted" | "denied";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function isGtmConfigured(): boolean {
  return GTM_ID.startsWith("GTM-") && GA_MEASUREMENT_ID.startsWith("G-");
}

/**
 * Single typed entry point for current and future GTM events. GTM remains the
 * owner of GA4 routing, consent checks and conversion configuration.
 */
export function trackGtmEvent(event: GtmEventName, parameters: GtmEventParameters = {}): void {
  if (!isGtmConfigured() || typeof window === "undefined") return;

  sendGTMEvent({
    event,
    ga_measurement_id: GA_MEASUREMENT_ID,
    ...parameters,
  });
}

export function trackCurrentPageView(): void {
  if (typeof window === "undefined") return;
  trackGtmEvent("page_view", {
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}`,
    page_title: document.title,
    page_language: document.documentElement.lang || undefined,
  });
}

/** Updates Consent Mode v2 without coupling the UI to GTM internals. */
export function updateAnalyticsConsent(consent: AnalyticsConsent): void {
  if (!isGtmConfigured() || typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });
  window.gtag("consent", "update", {
    analytics_storage: consent,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}
