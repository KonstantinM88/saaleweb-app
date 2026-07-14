"use client";

import { useEffect, useRef } from "react";
import type { ContactState } from "@/features/contact/actions";
import { trackLeadConversion } from "./trackLeadConversion";

/** Tracks accepted leads once, after the server action reports real success. */
export function useTrackFormSuccess(
  state: ContactState,
  source: "homepage_contact" | "contact_page" | "website_audit",
) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (state.status !== "success" || !state.created || !state.conversion || trackedRef.current) return;
    trackedRef.current = true;
    trackLeadConversion(state.conversion, source === "website_audit");
  }, [source, state]);
}
