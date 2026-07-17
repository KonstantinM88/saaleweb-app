"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink, Flag, MapPin, Star } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import type {
  GoogleBusinessReview,
  GoogleBusinessReviewFeed,
} from "@/features/google/googleBusinessReviewTypes";
import { siteConfig } from "@/shared/config/site";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { SectionHeader } from "@/shared/ui/SectionHeader";

type ReviewsApiResponse =
  | { ok: true; feed: GoogleBusinessReviewFeed }
  | { ok: false; error: string };

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function clampRating(rating: number) {
  return Math.min(Math.max(Math.round(rating), 0), 5);
}

function formattedReviewDate(review: GoogleBusinessReview, locale: AppLocale) {
  if (review.relativePublishTime) return review.relativePublishTime;
  if (!review.publishTime) return "";

  const date = new Date(review.publishTime);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

function ReviewStars({ rating, label }: { rating: number; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="flex gap-0.5 text-warning"
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < clampRating(rating);
        return (
          <Star
            key={index}
            size={15}
            fill={filled ? "currentColor" : "none"}
            strokeWidth={filled ? 0 : 1.8}
            aria-hidden="true"
            className={filled ? undefined : "text-line"}
          />
        );
      })}
    </div>
  );
}

function GoogleReviewCard({
  review,
  locale,
}: {
  review: GoogleBusinessReview;
  locale: AppLocale;
}) {
  const t = useTranslations("Testimonials");
  const reviewDate = formattedReviewDate(review, locale);
  const author = (
    <>
      {review.authorPhotoDataUrl ? (
        // The original author avatar is inlined by the no-store server route.
        // This satisfies attribution without a direct browser request to Google.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={review.authorPhotoDataUrl}
          alt=""
          width={44}
          height={44}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-11 w-11 rounded-full border border-line bg-surface object-cover"
        />
      ) : (
        <span className="grid h-11 w-11 place-items-center rounded-full bg-brand text-[15px] font-bold text-white">
          {initials(review.authorName)}
        </span>
      )}
      <span>
        <b className="block text-[14.5px] text-dark">{review.authorName}</b>
        {reviewDate ? (
          <span className="text-[13px] text-muted">{reviewDate}</span>
        ) : null}
      </span>
    </>
  );

  return (
    <figure className="flex h-full flex-col rounded-[20px] border border-line bg-white p-6 shadow-[0_14px_34px_rgba(19,30,52,0.05)]">
      <div className="mb-3.5">
        <ReviewStars
          rating={review.rating}
          label={t("ratingLabel", { rating: review.rating })}
        />
      </div>
      <blockquote className="mb-5 flex-1 whitespace-pre-line text-[15px] leading-7 text-ink">
        {review.text ?? t("ratingOnly", { rating: review.rating })}
      </blockquote>
      {review.isTranslated ? (
        <p className="mb-5 rounded-xl bg-surface px-3 py-2 text-xs leading-5 text-muted">
          {t("translatedReview")}
        </p>
      ) : null}
      <figcaption>
        {review.authorUrl ? (
          <a
            href={review.authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-xl transition hover:text-brand-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/45"
          >
            {author}
          </a>
        ) : (
          <span className="inline-flex items-center gap-3">{author}</span>
        )}
      </figcaption>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 text-xs">
        <a
          href={review.reviewUrl ?? siteConfig.googleBusiness.placeUrl}
          target="_blank"
          rel="noopener noreferrer"
          translate="no"
          className="inline-flex items-center gap-1.5 whitespace-nowrap font-normal text-[#5e5e5e] transition hover:text-[#1f1f1f]"
        >
          Google Maps
          <ExternalLink size={13} aria-hidden="true" />
        </a>
        {review.reportUrl ? (
          <a
            href={review.reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-muted transition hover:text-dark"
          >
            <Flag size={12} aria-hidden="true" />
            {t("reportReview")}
          </a>
        ) : null}
      </div>
    </figure>
  );
}

function GoogleReviewSummary({
  feed,
  locale,
}: {
  feed: GoogleBusinessReviewFeed;
  locale: AppLocale;
}) {
  const t = useTranslations("Testimonials");

  return (
    <Reveal>
      <div className="mb-7 flex flex-col gap-5 rounded-[22px] border border-[#dfe3eb] bg-[linear-gradient(135deg,#ffffff_0%,#f8f5ff_55%,#fff7fb_100%)] p-5 shadow-[0_18px_45px_rgba(63,32,98,0.08)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <div
            aria-hidden="true"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line bg-white text-brand-purple shadow-[0_8px_24px_rgba(66,49,92,0.1)]"
          >
            <MapPin size={23} strokeWidth={1.8} />
          </div>
          <div>
            <span
              translate="no"
              className="whitespace-nowrap text-sm font-normal text-[#5e5e5e]"
            >
              Google Maps
            </span>
            <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-purple">
              {t("googleBadge")}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <strong className="text-xl text-dark">
                {feed.rating.toLocaleString(locale, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
              </strong>
              <ReviewStars
                rating={feed.rating}
                label={t("ratingLabel", { rating: feed.rating })}
              />
              <span className="text-sm text-muted">
                {t("reviewCount", { count: feed.userRatingCount })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <a
            href={siteConfig.googleBusiness.placeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-bold text-dark transition hover:-translate-y-0.5 hover:border-brand-purple/35 hover:text-brand-purple"
          >
            {t("viewProfile")}
            <ExternalLink size={15} aria-hidden="true" />
          </a>
          <a
            href={siteConfig.googleBusiness.reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple px-4 text-sm font-bold text-white shadow-[0_10px_24px_rgba(139,92,246,0.2)] transition hover:-translate-y-0.5"
          >
            {t("leaveReview")}
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

export function TestimonialsClient({
  locale,
  fallbackFeed,
  liveSyncEnabled,
}: {
  locale: AppLocale;
  fallbackFeed: GoogleBusinessReviewFeed;
  liveSyncEnabled: boolean;
}) {
  const t = useTranslations("Testimonials");
  const sectionRef = useRef<HTMLElement>(null);
  const requestedLocaleRef = useRef<string | null>(null);
  const [feed, setFeed] = useState<GoogleBusinessReviewFeed>(fallbackFeed);
  const [usesLiveFeed, setUsesLiveFeed] = useState(false);

  useEffect(() => {
    if (!liveSyncEnabled) return;

    const section = sectionRef.current;
    if (!section) return;

    const loadReviews = () => {
      if (requestedLocaleRef.current === locale) return;
      requestedLocaleRef.current = locale;

      void fetch(`/api/google-business/reviews?locale=${encodeURIComponent(locale)}`, {
        cache: "no-store",
        credentials: "same-origin",
      })
        .then(async (response) => {
          const payload = (await response.json()) as ReviewsApiResponse;
          if (!response.ok || !payload.ok || !payload.feed.reviews.length) {
            throw new Error("google_reviews_unavailable");
          }
          setFeed(payload.feed);
          setUsesLiveFeed(true);
        })
        .catch(() => {
          // Keep the owner-verified local copies visible when Google is
          // unavailable. They retain direct source and write-review links.
          setFeed(fallbackFeed);
          setUsesLiveFeed(false);
        });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadReviews();
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px", threshold: 0.01 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [fallbackFeed, liveSyncEnabled, locale]);

  return (
    <section ref={sectionRef} className="py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />

        <GoogleReviewSummary feed={feed} locale={locale} />
        <div
          className={
            feed.reviews.length > 2
              ? "grid grid-cols-1 items-start gap-5 md:grid-cols-2 xl:grid-cols-3"
              : "grid grid-cols-1 items-start gap-5 md:grid-cols-2"
          }
        >
          {feed.reviews.map((review, index) => (
            <Reveal key={review.id} delay={index * 80}>
              <GoogleReviewCard review={review} locale={locale} />
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-5 text-muted">
          {usesLiveFeed ? t("relevanceNotice") : t("manualReviewNotice")} {t("verificationNotice")}{" "}
          <a
            href="https://support.google.com/contributionpolicy/answer/7422880"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#6D28D9] underline decoration-[#6D28D9]/30 underline-offset-2"
          >
            {t("policyLink")}
          </a>
        </p>

      </Container>
    </section>
  );
}
