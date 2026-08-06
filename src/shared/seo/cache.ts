/** Shared cache tag for admin-managed SEO metadata overrides. */
export const SEO_OVERRIDE_CACHE_TAG = "seo-page-overrides";

// Admin actions invalidate this tag immediately. The daily fallback prevents
// otherwise unchanged metadata from waking the autosuspended database hourly.
export const SEO_OVERRIDE_CACHE_SECONDS = 86_400;
