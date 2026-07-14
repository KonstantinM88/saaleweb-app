"use client";

import { ANALYTICS_CONSENT_STORAGE_KEY, type AnalyticsConsent } from "./gtm";
import {
  ATTRIBUTION_STORAGE_KEY,
  ATTRIBUTION_STORAGE_VERSION,
  buildAttributionCandidate,
  isStoredAttributionCurrent,
  sanitizeInternalPath,
  updateStoredAttribution,
  type DeviceCategory,
  type LeadAttributionPayload,
  type StoredAttribution,
} from "./attribution";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseStoredAttribution(value: string | null): StoredAttribution | undefined {
  if (!value) return undefined;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed) || parsed.version !== ATTRIBUTION_STORAGE_VERSION) return undefined;
    if (typeof parsed.expiresAt !== "string" || !isRecord(parsed.first) || !isRecord(parsed.last)) {
      return undefined;
    }
    const stored = parsed as StoredAttribution;
    return isStoredAttributionCurrent(stored) ? stored : undefined;
  } catch {
    return undefined;
  }
}

export function readAnalyticsConsent(): AnalyticsConsent | null {
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function clearStoredAttribution(): void {
  try {
    window.localStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
  } catch {
    // Privacy cleanup is best effort when browser storage is unavailable.
  }
}

function readStoredAttribution(): StoredAttribution | undefined {
  try {
    const stored = parseStoredAttribution(window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY));
    if (!stored) window.localStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
    return stored;
  } catch {
    return undefined;
  }
}

function writeStoredAttribution(value: StoredAttribution): boolean {
  try {
    window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Captures a public route only when the existing consent system grants storage. */
export function capturePersistentAttribution(referrer?: string): boolean {
  if (typeof window === "undefined" || window.location.pathname.startsWith("/admin")) return false;
  const consent = readAnalyticsConsent();
  if (consent !== "granted") {
    if (consent === "denied") clearStoredAttribution();
    return false;
  }

  const current = readStoredAttribution();
  const candidate = buildAttributionCandidate({
    href: window.location.href,
    referrer,
    ownHostname: window.location.hostname,
    includeClickIds: true,
  });
  return writeStoredAttribution(updateStoredAttribution(current, candidate));
}

export function detectDeviceCategory(): DeviceCategory {
  if (typeof window === "undefined" || typeof navigator === "undefined") return "unknown";
  const userAgent = navigator.userAgent || "";
  const width = Math.max(window.innerWidth || 0, window.screen?.width || 0);
  if (/ipad|tablet|kindle|silk|playbook/i.test(userAgent) || (/android/i.test(userAgent) && !/mobile/i.test(userAgent))) {
    return "tablet";
  }
  if (/mobile|iphone|ipod|android|windows phone/i.test(userAgent) || (width > 0 && width < 768)) {
    return "mobile";
  }
  return width > 0 ? "desktop" : "unknown";
}

/**
 * Builds the form payload at submit time. Persistent data is never read when
 * consent is absent or denied; that mode receives only request-level context.
 */
export function getLeadAttributionForSubmission(): LeadAttributionPayload {
  const conversionPage = sanitizeInternalPath(window.location.pathname) || "/";
  const deviceCategory = detectDeviceCategory();
  const consent = readAnalyticsConsent();

  if (consent === "granted") {
    const current = readStoredAttribution();
    const candidate = buildAttributionCandidate({
      href: window.location.href,
      // document.referrer is consumed only for a fresh record; on SPA routes it
      // can still point to the original external page and must not rewrite last.
      referrer: current ? undefined : document.referrer,
      ownHostname: window.location.hostname,
      includeClickIds: true,
    });
    const stored = updateStoredAttribution(current, candidate);
    writeStoredAttribution(stored);
    return {
      first: stored.first,
      last: stored.last,
      conversionPage,
      deviceCategory,
      captureMode: "persistent",
    };
  }

  if (consent === "denied") clearStoredAttribution();
  const requestOnly = buildAttributionCandidate({
    href: window.location.href,
    referrer: document.referrer,
    ownHostname: window.location.hostname,
    includeClickIds: false,
  }).touch;
  // Click IDs are deliberately excluded in request_only mode.
  delete requestOnly.gclid;
  delete requestOnly.fbclid;
  delete requestOnly.msclkid;
  return {
    first: requestOnly,
    last: requestOnly,
    conversionPage,
    deviceCategory,
    captureMode: "request_only",
  };
}
