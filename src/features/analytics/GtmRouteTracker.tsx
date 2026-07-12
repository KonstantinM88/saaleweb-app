"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackCurrentPageView } from "./gtm";

/** Sends one controlled page_view for the initial render and each App Router URL change. */
export function GtmRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrlRef = useRef<string | null>(null);
  const query = searchParams.toString();

  useEffect(() => {
    const url = query ? `${pathname}?${query}` : pathname;
    if (!pathname || lastUrlRef.current === url) return;
    lastUrlRef.current = url;

    // Let Next.js finish updating route metadata before reading document.title.
    const frame = window.requestAnimationFrame(trackCurrentPageView);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, query]);

  return null;
}
