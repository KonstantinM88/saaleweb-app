"use client";

/** Public IDs are compiled into the client bundle intentionally. */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? "";
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
export const ANALYTICS_CONSENT_STORAGE_KEY = "saaleweb_analytics_consent";

/** Interactive business events share the same global dataLayer as page_view. */
export const GTM_EVENT_NAMES = [
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
export type GtmLocale = "de" | "en" | "ru";

export type GtmPageViewPayload = {
  event: "page_view";
  page_location: string;
  page_path: string;
  page_title: string;
  page_language: GtmLocale;
};

export type GtmBusinessEventPayload = GtmEventParameters & {
  event: GtmEventName;
  ga_measurement_id: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function isGtmConfigured(): boolean {
  return GTM_ID.startsWith("GTM-") && GA_MEASUREMENT_ID.startsWith("G-");
}

export function ensureGtmDataLayer() {
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

export function isAdminTrackingPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function resolveTrackingLocale(pathname: string, locale?: string): GtmLocale {
  if (locale === "de" || locale === "en" || locale === "ru") return locale;
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/ru" || pathname.startsWith("/ru/")) return "ru";
  return "de";
}

/**
 * Single typed entry point for current and future GTM events. GTM remains the
 * owner of GA4 routing, consent checks and conversion configuration.
 */
export function trackGtmEvent(event: GtmEventName, parameters: GtmEventParameters = {}): void {
  if (!isGtmConfigured() || typeof window === "undefined") return;

  const payload: GtmBusinessEventPayload = {
    ...parameters,
    event,
    ga_measurement_id: GA_MEASUREMENT_ID,
  };
  ensureGtmDataLayer().push(payload);
}

/** Publishes the exact controlled page_view payload consumed by GTM. */
export function trackCurrentPageView(locale?: string): GtmPageViewPayload | null {
  if (!isGtmConfigured() || typeof window === "undefined") return null;
  if (isAdminTrackingPath(window.location.pathname)) return null;

  const payload: GtmPageViewPayload = {
    event: "page_view",
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}`,
    page_title: document.title,
    page_language: resolveTrackingLocale(window.location.pathname, locale),
  };
  ensureGtmDataLayer().push(payload);

  if (process.env.NODE_ENV === "development") {
    console.debug("[GTM] page_view", payload);
  }
  return payload;
}

/** Updates Consent Mode v2 without coupling the UI to GTM internals. */
export function updateAnalyticsConsent(consent: AnalyticsConsent): void {
  if (!isGtmConfigured() || typeof window === "undefined") return;

  ensureGtmDataLayer();
  window.gtag =
    window.gtag ||
    ((...args: unknown[]) => {
      ensureGtmDataLayer().push(args);
    });
  window.gtag("consent", "update", {
    analytics_storage: consent,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}
