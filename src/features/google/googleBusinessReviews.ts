import "server-only";

import type { AppLocale } from "@/i18n/routing";
import { siteConfig } from "@/shared/config/site";
import type {
  GoogleBusinessReview,
  GoogleBusinessReviewFeed,
} from "./googleBusinessReviewTypes";

const GOOGLE_PLACES_BASE_URL = "https://places.googleapis.com/v1";

type GoogleLocalizedText = {
  text?: unknown;
  languageCode?: unknown;
};

type GoogleAuthorAttribution = {
  displayName?: unknown;
  uri?: unknown;
  photoUri?: unknown;
};

type GoogleReviewPayload = {
  name?: unknown;
  relativePublishTimeDescription?: unknown;
  text?: GoogleLocalizedText;
  originalText?: GoogleLocalizedText;
  rating?: unknown;
  authorAttribution?: GoogleAuthorAttribution;
  publishTime?: unknown;
  flagContentUri?: unknown;
  googleMapsUri?: unknown;
};

type GooglePlacePayload = {
  id?: unknown;
  displayName?: GoogleLocalizedText;
  rating?: unknown;
  userRatingCount?: unknown;
  reviews?: unknown;
};

type GoogleTextSearchPayload = {
  places?: unknown;
};

type ParsedGoogleBusinessReview = GoogleBusinessReview & {
  authorPhotoSourceUrl?: string;
};

type ParsedGoogleBusinessReviewFeed = Omit<GoogleBusinessReviewFeed, "reviews"> & {
  reviews: ParsedGoogleBusinessReview[];
};

function readString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;

  const normalized = value.replace(/\u0000/g, "").trim();
  return normalized ? normalized.slice(0, maxLength) : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function clampRating(value: number | undefined): number {
  return Math.min(Math.max(value ?? 0, 0), 5);
}

function safeGoogleUrl(value: unknown): string | undefined {
  const candidate = readString(value, 2_000);
  if (!candidate) return undefined;

  try {
    const url = new URL(candidate);
    const hostname = url.hostname.toLowerCase();
    const isGoogleHost =
      hostname === "google.com" ||
      hostname.endsWith(".google.com") ||
      hostname === "googleusercontent.com" ||
      hostname.endsWith(".googleusercontent.com") ||
      hostname === "g.page";

    return url.protocol === "https:" && isGoogleHost ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function localizedText(value: GoogleLocalizedText | undefined): {
  text?: string;
  languageCode?: string;
} {
  return {
    text: readString(value?.text, 5_000),
    languageCode: readString(value?.languageCode, 24),
  };
}

function parseReview(value: unknown, index: number): ParsedGoogleBusinessReview | null {
  if (!value || typeof value !== "object") return null;

  const review = value as GoogleReviewPayload;
  const original = localizedText(review.originalText);
  const localized = localizedText(review.text);
  const authorName =
    readString(review.authorAttribution?.displayName, 200) ?? "Google Maps user";
  const publishTime = readString(review.publishTime, 64);
  const id =
    readString(review.name, 500) ??
    `${authorName.toLowerCase().replace(/\s+/g, "-")}-${publishTime ?? index}`;

  return {
    id,
    authorName,
    authorUrl: safeGoogleUrl(review.authorAttribution?.uri),
    authorPhotoSourceUrl: safeGoogleUrl(review.authorAttribution?.photoUri),
    rating: clampRating(readNumber(review.rating)),
    text: localized.text ?? original.text,
    languageCode: localized.languageCode ?? original.languageCode,
    publishTime,
    relativePublishTime: readString(review.relativePublishTimeDescription, 120),
    reviewUrl: safeGoogleUrl(review.googleMapsUri),
    reportUrl: safeGoogleUrl(review.flagContentUri),
    isTranslated: Boolean(
      localized.text && original.text && localized.text !== original.text,
    ),
  };
}

function parsePlace(value: unknown): ParsedGoogleBusinessReviewFeed | null {
  if (!value || typeof value !== "object") return null;

  const place = value as GooglePlacePayload;
  const placeId = readString(place.id, 255);
  const placeName = localizedText(place.displayName).text;
  const rating = clampRating(readNumber(place.rating));
  const userRatingCount = Math.max(Math.round(readNumber(place.userRatingCount) ?? 0), 0);

  if (!placeId || !placeName || placeName.toLowerCase() !== siteConfig.name.toLowerCase()) {
    return null;
  }

  const reviews = Array.isArray(place.reviews)
    ? place.reviews.flatMap((review, index) => {
        const parsed = parseReview(review, index);
        return parsed ? [parsed] : [];
      })
    : [];

  return {
    placeId,
    placeName,
    rating,
    userRatingCount,
    reviews,
  };
}

async function inlineAuthorPhoto(sourceUrl: string | undefined): Promise<string | undefined> {
  if (!sourceUrl) return undefined;

  try {
    const response = await fetch(sourceUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(4_000),
    });
    if (!response.ok || !safeGoogleUrl(response.url)) return undefined;

    const contentType = response.headers.get("content-type")?.split(";")[0]?.trim();
    if (!contentType || !["image/jpeg", "image/png", "image/webp"].includes(contentType)) {
      return undefined;
    }

    const declaredLength = Number(response.headers.get("content-length") ?? 0);
    if (declaredLength > 150_000) return undefined;

    const bytes = await response.arrayBuffer();
    if (bytes.byteLength === 0 || bytes.byteLength > 150_000) return undefined;

    return `data:${contentType};base64,${Buffer.from(bytes).toString("base64")}`;
  } catch {
    return undefined;
  }
}

async function withInlineAuthorPhotos(
  feed: ParsedGoogleBusinessReviewFeed,
): Promise<GoogleBusinessReviewFeed> {
  const reviews = await Promise.all(
    feed.reviews.map(async ({ authorPhotoSourceUrl, ...review }) => ({
      ...review,
      authorPhotoDataUrl: await inlineAuthorPhoto(authorPhotoSourceUrl),
    })),
  );

  return { ...feed, reviews };
}

function googlePlacesApiKey(): string | null {
  // A dedicated key is preferred. The PageSpeed key fallback keeps existing
  // deployments compatible when the same Google Cloud project enables Places.
  return (
    process.env.GOOGLE_PLACES_API_KEY?.trim() ||
    process.env.PAGESPEED_API_KEY?.trim() ||
    null
  );
}

function configuredPlaceId(): string | null {
  const value =
    process.env.GOOGLE_BUSINESS_PLACE_ID?.trim() || siteConfig.googleBusiness.placeId;
  return value && /^[A-Za-z0-9_-]{8,255}$/.test(value) ? value : null;
}

async function safeErrorCode(response: Response): Promise<string | undefined> {
  try {
    const payload = (await response.json()) as {
      error?: { status?: unknown; code?: unknown };
    };

    return (
      readString(payload.error?.status, 80) ??
      (typeof payload.error?.code === "number" ? String(payload.error.code) : undefined)
    );
  } catch {
    return undefined;
  }
}

async function requestPlaceDetails(apiKey: string, placeId: string, locale: AppLocale) {
  const params = new URLSearchParams({
    languageCode: locale,
    regionCode: "DE",
  });
  const response = await fetch(
    `${GOOGLE_PLACES_BASE_URL}/places/${encodeURIComponent(placeId)}?${params}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,reviews",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    },
  );

  if (!response.ok) {
    console.warn("[google-reviews] Place Details request failed.", {
      status: response.status,
      code: await safeErrorCode(response),
    });
    return null;
  }

  return parsePlace(await response.json());
}

async function searchBusinessPlace(apiKey: string, locale: AppLocale) {
  const response = await fetch(`${GOOGLE_PLACES_BASE_URL}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.rating,places.userRatingCount,places.reviews",
    },
    body: JSON.stringify({
      textQuery: `${siteConfig.name}, ${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.locality}`,
      languageCode: locale,
      regionCode: "DE",
      pageSize: 1,
      locationBias: {
        circle: {
          center: {
            latitude: siteConfig.googleBusiness.latitude,
            longitude: siteConfig.googleBusiness.longitude,
          },
          radius: 1_000,
        },
      },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    console.warn("[google-reviews] Text Search request failed.", {
      status: response.status,
      code: await safeErrorCode(response),
    });
    return null;
  }

  const payload = (await response.json()) as GoogleTextSearchPayload;
  if (!Array.isArray(payload.places)) return null;

  return payload.places.map(parsePlace).find(Boolean) ?? null;
}

export function hasGoogleBusinessReviewCredentials() {
  return Boolean(googlePlacesApiKey());
}

/**
 * Loads current review content without application-level caching. Google Maps
 * Platform content has strict storage/caching rules; only the public Place ID
 * may be retained. Call this from a lazy public endpoint rather than during
 * homepage prerendering so the request does not affect LCP or static builds.
 */
export async function getGoogleBusinessReviewFeed(
  locale: AppLocale,
): Promise<GoogleBusinessReviewFeed | null> {
  const apiKey = googlePlacesApiKey();
  if (!apiKey) return null;

  try {
    const placeId = configuredPlaceId();
    const feed = placeId
      ? await requestPlaceDetails(apiKey, placeId, locale)
      : await searchBusinessPlace(apiKey, locale);
    return feed ? withInlineAuthorPhotos(feed) : null;
  } catch (error) {
    console.warn("[google-reviews] Review synchronization failed.", {
      reason: error instanceof Error ? error.name : "unknown_error",
    });
    return null;
  }
}
