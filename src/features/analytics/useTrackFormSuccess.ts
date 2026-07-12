"use client";

import { useEffect, useRef } from "react";
import { trackGtmEvent } from "./gtm";

/** Tracks accepted leads once, after the server action reports real success. */
export function useTrackFormSuccess(
  status: "idle" | "success" | "error",
  source: "homepage_contact" | "contact_page" | "website_audit",
) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (status !== "success" || trackedRef.current) return;
    trackedRef.current = true;
    trackGtmEvent("form_submit", { form_source: source });
    if (source === "website_audit") {
      trackGtmEvent("audit_request", { form_source: source });
    }
  }, [source, status]);
}
