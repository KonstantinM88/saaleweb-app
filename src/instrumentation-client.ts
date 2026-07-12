import { initializeGoogleConsent } from "./features/analytics/googleConsent";

// Next.js executes this file after the document loads but before React
// hydration. That guarantees Consent Mode defaults exist before GTM hydrates.
initializeGoogleConsent();
