import "server-only";

import { unstable_cache } from "next/cache";
import { HOMEPAGE_CACHE_SECONDS } from "@/features/homepage/cache";
import { prisma } from "@/lib/prisma";
import { HERO_LIGHTHOUSE_CACHE_TAG } from "./cache";

export type PublicLighthouseMetrics = {
  seoScore: number;
  pageSpeed: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  measuredAt: string;
};

/** Reviewed fallback used before the first successful automated measurement. */
export const REVIEWED_LIGHTHOUSE_FALLBACK: PublicLighthouseMetrics = {
  seoScore: 100,
  pageSpeed: 100,
  accessibilityScore: 100,
  bestPracticesScore: 100,
  measuredAt: "2026-08-13",
};

function validScore(value: number | null): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 100;
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? null;
}

function isoDay(value: Date | null): string | null {
  return value && !Number.isNaN(value.getTime()) ? value.toISOString().slice(0, 10) : null;
}

const readCachedLighthouseMetrics = unstable_cache(
  async (): Promise<PublicLighthouseMetrics> => {
    // One compact query is deliberate: Hostinger/Neon use a one-connection
    // pool. Up to 30 rows lets each metric find its latest successful value
    // even if Google temporarily omitted another category on some days.
    const snapshots = await prisma.seoDailySnapshot.findMany({
      where: {
        OR: [
          { lighthouseDesktop: { not: null } },
          { lighthouseSeo: { not: null } },
          { lighthouseAccessibility: { not: null } },
          { lighthouseBestPractices: { not: null } },
        ],
      },
      orderBy: { day: "desc" },
      take: 30,
      select: {
        lighthouseDesktop: true,
        lighthouseSeo: true,
        lighthouseAccessibility: true,
        lighthouseBestPractices: true,
        lighthouseMeasuredAt: true,
      },
    });

    const desktopScores = snapshots
      .map((snapshot) => snapshot.lighthouseDesktop)
      .filter(validScore)
      .slice(0, 3);
    const pageSpeed = median(desktopScores);
    const seoSnapshot = snapshots.find((snapshot) => validScore(snapshot.lighthouseSeo));
    const accessibilitySnapshot = snapshots.find((snapshot) =>
      validScore(snapshot.lighthouseAccessibility),
    );
    const bestPracticesSnapshot = snapshots.find((snapshot) =>
      validScore(snapshot.lighthouseBestPractices),
    );
    const datedSnapshot = snapshots.find((snapshot) => snapshot.lighthouseMeasuredAt !== null);

    return {
      seoScore: seoSnapshot?.lighthouseSeo ?? REVIEWED_LIGHTHOUSE_FALLBACK.seoScore,
      pageSpeed: pageSpeed ?? REVIEWED_LIGHTHOUSE_FALLBACK.pageSpeed,
      accessibilityScore:
        accessibilitySnapshot?.lighthouseAccessibility ??
        REVIEWED_LIGHTHOUSE_FALLBACK.accessibilityScore,
      bestPracticesScore:
        bestPracticesSnapshot?.lighthouseBestPractices ??
        REVIEWED_LIGHTHOUSE_FALLBACK.bestPracticesScore,
      measuredAt:
        isoDay(datedSnapshot?.lighthouseMeasuredAt ?? null) ??
        REVIEWED_LIGHTHOUSE_FALLBACK.measuredAt,
    };
  },
  [HERO_LIGHTHOUSE_CACHE_TAG],
  {
    revalidate: HOMEPAGE_CACHE_SECONDS,
    tags: [HERO_LIGHTHOUSE_CACHE_TAG],
  },
);

export function getPublicLighthouseMetrics(): Promise<PublicLighthouseMetrics> {
  return readCachedLighthouseMetrics().catch(() => REVIEWED_LIGHTHOUSE_FALLBACK);
}
