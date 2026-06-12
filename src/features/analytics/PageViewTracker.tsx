"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Fires a first-party page view (no cookies, no IP) on each navigation. */
export function PageViewTracker({ locale }: { locale: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (typeof navigator !== "undefined" && navigator.webdriver) return;
    const body = JSON.stringify({
      path: pathname,
      locale,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    });
    try {
      const blob = new Blob([body], { type: "application/json" });
      if (typeof navigator !== "undefined" && navigator.sendBeacon?.("/api/track", blob)) return;
    } catch {
      // fall through to fetch
    }
    fetch("/api/track", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});
  }, [pathname, locale]);

  return null;
}
