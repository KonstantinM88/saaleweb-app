"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { detectAiReferrer } from "./aiTraffic";

function analyticsReferrer(): string | null {
  if (typeof document === "undefined" || typeof window === "undefined") return null;
  const referrer = document.referrer || null;
  const source = new URLSearchParams(window.location.search).get("utm_source")?.trim();
  if (!source) return referrer;

  const candidate = /^https?:\/\//i.test(source) ? source : `https://${source}`;
  return detectAiReferrer(candidate) ? candidate : referrer;
}

/** Fires a first-party page view (no cookies, no IP) on each navigation. */
export function PageViewTracker({ locale }: { locale: string }) {
  const pathname = usePathname();
  const lastTrackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (typeof navigator !== "undefined" && navigator.webdriver) return;
    const trackingKey = `${locale}:${pathname}`;
    if (lastTrackedRef.current === trackingKey) return;
    lastTrackedRef.current = trackingKey;

    const body = JSON.stringify({
      path: pathname,
      locale,
      referrer: analyticsReferrer(),
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
