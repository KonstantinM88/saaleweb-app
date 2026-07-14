"use client";

import { useCallback, useRef } from "react";
import { getLeadAttributionForSubmission } from "./attribution.client";

function createSubmissionId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** Keeps one submission UUID across validation/network retries of one form attempt. */
export function useLeadAttributionSubmission() {
  const submissionIdRef = useRef<string | undefined>(undefined);
  const submissionInputRef = useRef<HTMLInputElement>(null);
  const attributionInputRef = useRef<HTMLInputElement>(null);

  const values = useCallback(() => {
    submissionIdRef.current ||= createSubmissionId();
    let attribution = "";
    try {
      attribution = JSON.stringify(getLeadAttributionForSubmission());
    } catch {
      // Attribution must never prevent a voluntary form submission. The
      // server will create its request-only direct fallback when this is empty.
    }
    return {
      submissionId: submissionIdRef.current,
      attribution,
    };
  }, []);

  const prepareSubmission = useCallback(() => {
    const prepared = values();
    if (submissionInputRef.current) submissionInputRef.current.value = prepared.submissionId;
    if (attributionInputRef.current) attributionInputRef.current.value = prepared.attribution;
  }, [values]);

  const enrichFormData = useCallback(
    (formData: FormData) => {
      const prepared = values();
      formData.set("submissionId", prepared.submissionId);
      formData.set("attribution", prepared.attribution);
      return formData;
    },
    [values],
  );

  return {
    submissionInputRef,
    attributionInputRef,
    prepareSubmission,
    enrichFormData,
  };
}
