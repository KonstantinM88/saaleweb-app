"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ATTRIBUTION_CONSENT_EVENT,
  type AttributionCaptureMode,
} from "./attribution";
import {
  capturePersistentAttribution,
  clearStoredAttribution,
  readAnalyticsConsent,
} from "./attribution.client";
import { ANALYTICS_CONSENT_STORAGE_KEY } from "./gtm";

type ConsentEvent = CustomEvent<{ consent?: AttributionCaptureMode | "granted" | "denied" }>;

/** Global public-route capture; renders no UI and never runs in /admin. */
export function AttributionCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialReferrerRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    initialReferrerRef.current = document.referrer || undefined;
  }, []);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const consent = readAnalyticsConsent();
    if (consent === "denied") {
      clearStoredAttribution();
      return;
    }
    if (consent !== "granted") return;
    const captured = capturePersistentAttribution(initialReferrerRef.current);
    if (captured) initialReferrerRef.current = undefined;
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleConsent = (event: Event) => {
      const consent = (event as ConsentEvent).detail?.consent;
      if (consent === "denied") {
        clearStoredAttribution();
        return;
      }
      if (consent === "granted") {
        const captured = capturePersistentAttribution(initialReferrerRef.current);
        if (captured) initialReferrerRef.current = undefined;
      }
    };
    window.addEventListener(ATTRIBUTION_CONSENT_EVENT, handleConsent);
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== ANALYTICS_CONSENT_STORAGE_KEY) return;
      if (event.newValue === "denied" || event.newValue === null) {
        clearStoredAttribution();
      } else if (event.newValue === "granted") {
        const captured = capturePersistentAttribution(initialReferrerRef.current);
        if (captured) initialReferrerRef.current = undefined;
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(ATTRIBUTION_CONSENT_EVENT, handleConsent);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return null;
}
