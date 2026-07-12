"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  isAdminTrackingPath,
  trackCurrentPageView,
  type GtmLocale,
} from "./gtm";

/** Sends one controlled page_view for the initial render and each App Router URL change. */
export function GtmRouteTracker({ locale }: { locale: GtmLocale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrlRef = useRef<string | null>(null);
  const query = searchParams.toString();

  useEffect(() => {
    if (!pathname || isAdminTrackingPath(pathname)) return;
    const scheduledPath = query ? `${pathname}?${query}` : pathname;

    // Wait one frame so App Router metadata has updated before document.title is read.
    // The ref is deliberately updated inside the frame: Strict Mode may cancel the
    // first effect frame before replaying it, and marking it earlier would lose the
    // initial page_view entirely.
    const frame = window.requestAnimationFrame(() => {
      const currentPath = `${window.location.pathname}${window.location.search}`;
      if (currentPath !== scheduledPath || isAdminTrackingPath(window.location.pathname)) return;

      const canonicalTrackingUrl = `${window.location.origin}${currentPath}`;
      if (lastUrlRef.current === canonicalTrackingUrl) return;
      lastUrlRef.current = canonicalTrackingUrl;
      trackCurrentPageView(locale);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [locale, pathname, query]);

  return null;
}
