import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  GA_MEASUREMENT_ID,
  ensureGtmDataLayer,
  isAdminTrackingPath,
  isGtmConfigured,
} from "./gtm";

type ConsentWindow = Window & {
  __saalewebGoogleConsentInitialized?: boolean;
};

/**
 * Runs from instrumentation-client before React hydration and before the
 * after-hydration GoogleTagManager component. No React-rendered script needed.
 */
export function initializeGoogleConsent(): void {
  if (typeof window === "undefined") return;
  if (!isGtmConfigured() || isAdminTrackingPath(window.location.pathname)) return;

  const consentWindow = window as ConsentWindow;
  if (consentWindow.__saalewebGoogleConsentInitialized) return;
  consentWindow.__saalewebGoogleConsentInitialized = true;

  ensureGtmDataLayer().push({
    ga_measurement_id: GA_MEASUREMENT_ID,
    site_name: "SaaleWeb",
    app_router: true,
  });
  window.gtag =
    window.gtag ||
    ((...args: unknown[]) => {
      ensureGtmDataLayer().push(args);
    });
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });

  try {
    if (window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY) === "granted") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
  } catch {
    // Storage may be unavailable in privacy modes; denied remains the default.
  }
}
