/**
 * Homepage CMS data changes rarely and must not wake the serverless database
 * on every short ISR cycle. Admin actions invalidate only the affected tag.
 */
export const HOMEPAGE_CACHE_SECONDS = 86_400;

export const HOMEPAGE_CACHE_TAGS = {
  projects: "homepage-projects-v1",
  industries: "homepage-industries-v1",
  pricing: "homepage-pricing-v1",
  faq: "homepage-faq-v1",
} as const;

export type HomepageCacheTag = (typeof HOMEPAGE_CACHE_TAGS)[keyof typeof HOMEPAGE_CACHE_TAGS];
