// src/widgets/testimonials/Testimonials.tsx
import type { AppLocale } from "@/i18n/routing";
import { getVerifiedGoogleReviewFallback } from "@/features/google/googleBusinessReviewFallback";
import { hasGoogleBusinessReviewCredentials } from "@/features/google/googleBusinessReviews";
import { TestimonialsClient } from "./TestimonialsClient";

export function Testimonials({ locale }: { locale: AppLocale }) {
  return (
    <TestimonialsClient
      key={locale}
      locale={locale}
      fallbackFeed={getVerifiedGoogleReviewFallback(locale)}
      liveSyncEnabled={hasGoogleBusinessReviewCredentials()}
    />
  );
}
