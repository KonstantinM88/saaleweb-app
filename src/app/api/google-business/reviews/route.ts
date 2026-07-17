import { NextResponse } from "next/server";
import {
  getGoogleBusinessReviewFeed,
  hasGoogleBusinessReviewCredentials,
} from "@/features/google/googleBusinessReviews";
import { isAppLocale, routing } from "@/i18n/routing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  Pragma: "no-cache",
} as const;

export async function GET(request: Request) {
  const requestedLocale = new URL(request.url).searchParams.get("locale") ?? "";
  const locale = isAppLocale(requestedLocale) ? requestedLocale : routing.defaultLocale;

  if (!hasGoogleBusinessReviewCredentials()) {
    return NextResponse.json(
      { ok: false, error: "google_places_not_configured" },
      { status: 503, headers: noStoreHeaders },
    );
  }

  const feed = await getGoogleBusinessReviewFeed(locale);
  if (!feed) {
    return NextResponse.json(
      { ok: false, error: "google_reviews_unavailable" },
      { status: 502, headers: noStoreHeaders },
    );
  }

  return NextResponse.json(
    { ok: true, feed },
    {
      headers: noStoreHeaders,
    },
  );
}
