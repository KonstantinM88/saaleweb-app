"use client";

/**
 * Delta 31 — lightweight click/interaction events on top of the existing
 * first-party cookieless analytics. Events are stored as PageView rows with
 * a synthetic "/e/<name>" path (visible in the admin analytics), so no new
 * tables, libraries or consent requirements are introduced.
 */
export type LocalSeoEvent =
  | "click_phone"
  | "click_email"
  | "click_google_maps"
  | "click_directions"
  | "click_google_business_profile"
  | "click_google_review"
  | "load_google_maps"
  | "form_submit"
  | "audit_request";

export function trackEvent(name: LocalSeoEvent, locale: string): void {
  try {
    const body = JSON.stringify({
      path: `/e/${name}`,
      locale,
      referrer: typeof window !== "undefined" ? window.location.pathname : null,
    });
    const blob = new Blob([body], { type: "application/json" });
    if (typeof navigator !== "undefined" && navigator.sendBeacon?.("/api/track", blob)) return;
    fetch("/api/track", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});
  } catch {
    // analytics must never break the UI
  }
}
