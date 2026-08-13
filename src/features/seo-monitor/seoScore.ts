import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { detectAiReferrer } from "@/features/analytics/aiTraffic";
import { prisma } from "@/lib/prisma";
import { HERO_LIGHTHOUSE_CACHE_TAG } from "./cache";
import { fetchPageSpeed, type PageSpeedResult } from "./pagespeed";
import { fetchGscSnapshot, type GscSnapshot } from "./searchConsole";
import { keyUrls, runSelfCheck, type SelfCheckResult } from "./selfCheck";

type Component = {
  key: string;
  weight: number;
  score: number | null;
  line: string;
};

const MS_IN_DAY = 24 * 60 * 60 * 1000;

function siteBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://saaleweb.de").replace(/\/+$/, "");
}

function berlinDay(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: process.env.TELEGRAM_REPORT_TIMEZONE || "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function clamp10(value: number): number {
  return Math.max(0, Math.min(10, value));
}

function mark(ok: boolean): string {
  return ok ? "✅" : "⚠️";
}

function percentTrend(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "новое" : "0%";
  const percent = Math.round(((current - previous) / previous) * 100);
  return percent > 0 ? `+${percent}%` : `${percent}%`;
}

async function aiReferrals7d(): Promise<{ current: number; previous: number }> {
  const sum = async (from: Date, to: Date) => {
    const rows = await prisma.$queryRaw<
      { path: string | null; count: number | bigint | null }[]
    >`SELECT referrer AS path, count(DISTINCT COALESCE("visitorHash", id))::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND referrer IS NOT NULL AND referrer <> '' GROUP BY referrer ORDER BY count DESC`;
    return rows.reduce(
      (total, row) => (detectAiReferrer(row.path) ? total + Number(row.count ?? 0) : total),
      0,
    );
  };
  const to = new Date();
  const from = new Date(to.getTime() - 7 * MS_IN_DAY);
  const previousFrom = new Date(from.getTime() - 7 * MS_IN_DAY);
  try {
    // Keep DB work sequential: production intentionally uses one pooled
    // PostgreSQL connection per Node process.
    const current = await sum(from, to);
    const previous = await sum(previousFrom, from);
    return { current, previous };
  } catch {
    return { current: 0, previous: 0 };
  }
}

function errorsComponent(selfCheck: SelfCheckResult): Component {
  const total = selfCheck.checks.length;
  const ok = selfCheck.okCount;
  const failed = selfCheck.checks.filter((check) => !check.ok);
  const detail = failed.length
    ? ` · проблемы: ${failed.map((check) => `${new URL(check.url).pathname} (${check.status || "timeout"})`).join(", ")}`
    : ` · ср. ответ ${selfCheck.averageMs} ms`;
  return {
    key: "errors",
    weight: 20,
    score: total ? clamp10((ok / total) * 10) : null,
    line: `• Ошибки — ${mark(ok === total)} ${ok}/${total} ключевых URL отвечают${detail}`,
  };
}

function cwvComponent(psi: PageSpeedResult): Component {
  if (!psi.available) {
    return {
      key: "cwv",
      weight: 20,
      score: null,
      line: `• Core Web Vitals — ⚙️ недоступно (${psi.error ?? "PSI"})`,
    };
  }

  if (!psi.fieldMetrics.length) {
    return {
      key: "cwv",
      weight: 20,
      score: null,
      line: "• Core Web Vitals — ⚙️ у CrUX пока недостаточно данных реальных пользователей",
    };
  }

  const categoryScores = { FAST: 10, AVERAGE: 5, SLOW: 0, NONE: 0 } as const;
  const score = clamp10(
    psi.fieldMetrics.reduce((sum, metric) => sum + categoryScores[metric.category], 0) /
      psi.fieldMetrics.length,
  );
  const values = psi.fieldMetrics.map((metric) => `${metric.label} ${metric.value}`).join(" · ");
  const allFast = psi.fieldMetrics.every((metric) => metric.category === "FAST");
  return {
    key: "cwv",
    weight: 20,
    score,
    line: `• Core Web Vitals — ${mark(allFast)} ${values} (реальные пользователи)`,
  };
}

function lighthouseComponent(mobile: PageSpeedResult, desktop: PageSpeedResult): Component {
  const score = mobile.available && mobile.performanceScore !== null ? mobile.performanceScore : null;
  const desktopScore =
    desktop.available && desktop.performanceScore !== null ? desktop.performanceScore : null;
  const seoScore = desktop.available && desktop.seoScore !== null ? desktop.seoScore : null;
  const accessibilityScore =
    desktop.available && desktop.accessibilityScore !== null ? desktop.accessibilityScore : null;
  const bestPracticesScore =
    desktop.available && desktop.bestPracticesScore !== null ? desktop.bestPracticesScore : null;
  const details = [
    score === null ? null : `mobile ${score}`,
    desktopScore === null ? null : `desktop ${desktopScore}`,
    seoScore === null ? null : `SEO ${seoScore}`,
    accessibilityScore === null ? null : `Accessibility ${accessibilityScore}`,
    bestPracticesScore === null ? null : `Best Practices ${bestPracticesScore}`,
  ].filter((value): value is string => value !== null);
  return {
    key: "lighthouse",
    weight: 10,
    score: score === null ? null : clamp10(score / 10),
    line:
      score === null
        ? "• PageSpeed — ⚙️ недоступно"
        : `• PageSpeed — ${mark(score >= 90)} ${details.join(" · ")} (главная)`,
  };
}

function indexationComponent(gsc: GscSnapshot): Component {
  if (!gsc.configured) {
    return { key: "indexation", weight: 20, score: null, line: "• Индексация — ⚙️ требует подключения GSC" };
  }
  if (!gsc.indexation) {
    return {
      key: "indexation",
      weight: 20,
      score: null,
      line: `• Индексация — ⚙️ GSC недоступен (${gsc.error ?? "ошибка"})`,
    };
  }
  const { inspected, indexed, problems } = gsc.indexation;
  const detail = problems.length
    ? ` · вне индекса: ${problems.map((problem) => `${new URL(problem.url).pathname} (${problem.verdict})`).join(", ")}`
    : "";
  return {
    key: "indexation",
    weight: 20,
    score: inspected ? clamp10((indexed / inspected) * 10) : null,
    line: `• Индексация — ${mark(indexed === inspected)} ${indexed}/${inspected} ключевых страниц в индексе${detail}`,
  };
}

function ctrComponent(gsc: GscSnapshot): Component {
  if (!gsc.configured) {
    return { key: "ctr", weight: 15, score: null, line: "• CTR — ⚙️ требует подключения GSC" };
  }
  if (!gsc.analytics) {
    return {
      key: "ctr",
      weight: 15,
      score: null,
      line: `• CTR — ⚙️ GSC недоступен (${gsc.error ?? "ошибка"})`,
    };
  }
  const analytics = gsc.analytics;
  const ctrPercent = analytics.ctr * 100;
  const score = analytics.impressions > 0 ? clamp10(ctrPercent / 0.6) : 0;
  return {
    key: "ctr",
    weight: 15,
    score,
    line: `• CTR — ${Math.round(score)}/10 (${ctrPercent.toFixed(1)}% · ${analytics.clicks} кликов · ${analytics.impressions} показов · позиция ${analytics.position.toFixed(1)} за 7 дней)`,
  };
}

function aiComponent(ai: { current: number; previous: number }): Component {
  const { current, previous } = ai;
  const score = current === 0 ? (previous > 0 ? 2 : 0) : current > previous ? 10 : current === previous ? 7 : 5;
  return {
    key: "ai",
    weight: 10,
    score,
    line: `• AI-переходы — ${mark(current > 0)} ${current} уник. посетителей за 7 дней (${percentTrend(current, previous)})`,
  };
}

async function newPagesComponent(selfCheck: SelfCheckResult, day: string): Promise<Component> {
  if (!selfCheck.sitemapOk) {
    return { key: "pages", weight: 5, score: 0, line: "• Новые страницы — ⚠️ sitemap.xml недоступен" };
  }

  let delta: number | null = null;
  try {
    const previous = await prisma.seoDailySnapshot.findFirst({
      where: { day: { lt: day } },
      orderBy: { day: "desc" },
      select: { sitemapUrls: true },
    });
    if (previous) delta = selfCheck.sitemapUrls - previous.sitemapUrls;
  } catch {
    delta = null;
  }

  const deltaText =
    delta === null
      ? ""
      : delta === 0
        ? " (без изменений)"
        : ` (${delta > 0 ? "+" : ""}${delta} к прошлому замеру)`;
  const shrunk = delta !== null && delta < 0;
  return {
    key: "pages",
    weight: 5,
    score: shrunk ? 5 : 10,
    line: `• Новые страницы — ${mark(!shrunk)} ${selfCheck.sitemapUrls} URL в sitemap${deltaText}`,
  };
}

function totalScore(components: Component[]): { score: number; usedWeight: number } {
  const available = components.filter((component) => component.score !== null);
  const usedWeight = available.reduce((sum, component) => sum + component.weight, 0);
  if (!usedWeight) return { score: 0, usedWeight: 0 };
  const weighted = available.reduce(
    (sum, component) => sum + (component.score as number) * component.weight,
    0,
  );
  return { score: Math.round((weighted / usedWeight) * 10), usedWeight };
}

async function readCachedReport(day: string): Promise<string | null> {
  try {
    const snapshot = await prisma.seoDailySnapshot.findUnique({
      where: { day },
      select: { report: true },
    });
    return snapshot?.report ?? null;
  } catch {
    return null;
  }
}

function successfulScore(
  result: PageSpeedResult,
  key: "performanceScore" | "seoScore" | "accessibilityScore" | "bestPracticesScore",
) {
  const value = result.available ? result[key] : null;
  return typeof value === "number" && value >= 0 && value <= 100 ? value : undefined;
}

function cwvPassed(result: PageSpeedResult): boolean | undefined {
  if (!result.available || result.fieldMetrics.length !== 3) return undefined;
  return result.fieldMetrics.every((metric) => metric.category === "FAST");
}

function measuredAt(result: PageSpeedResult): Date | undefined {
  if (!result.available || !result.measuredAt) return undefined;
  const value = new Date(result.measuredAt);
  return Number.isNaN(value.getTime()) ? undefined : value;
}

async function storeSnapshot(
  day: string,
  score: number,
  sitemapUrls: number,
  report: string,
  mobile: PageSpeedResult,
  desktop: PageSpeedResult,
) {
  const lighthouseMobile = successfulScore(mobile, "performanceScore");
  const lighthouseDesktop = successfulScore(desktop, "performanceScore");
  const lighthouseSeo = successfulScore(desktop, "seoScore");
  const lighthouseAccessibility = successfulScore(desktop, "accessibilityScore");
  const lighthouseBestPractices = successfulScore(desktop, "bestPracticesScore");
  const coreWebVitalsPassed = cwvPassed(mobile);
  const hasPublicLighthouseMeasurement =
    lighthouseDesktop !== undefined ||
    lighthouseSeo !== undefined ||
    lighthouseAccessibility !== undefined ||
    lighthouseBestPractices !== undefined;
  const lighthouseMeasuredAt =
    hasPublicLighthouseMeasurement ? (measuredAt(desktop) ?? new Date()) : undefined;

  try {
    await prisma.seoDailySnapshot.upsert({
      where: { day },
      // `undefined` deliberately leaves a previously successful field intact
      // when Google times out or omits a category on a later retry that day.
      update: {
        score,
        sitemapUrls,
        report,
        lighthouseMobile,
        lighthouseDesktop,
        lighthouseSeo,
        lighthouseAccessibility,
        lighthouseBestPractices,
        coreWebVitalsPassed,
        lighthouseMeasuredAt,
      },
      create: {
        day,
        score,
        sitemapUrls,
        report,
        lighthouseMobile,
        lighthouseDesktop,
        lighthouseSeo,
        lighthouseAccessibility,
        lighthouseBestPractices,
        coreWebVitalsPassed,
        lighthouseMeasuredAt,
      },
    });
    if (
      lighthouseDesktop !== undefined ||
      lighthouseSeo !== undefined ||
      lighthouseAccessibility !== undefined ||
      lighthouseBestPractices !== undefined ||
      coreWebVitalsPassed !== undefined
    ) {
      revalidateTag(HERO_LIGHTHOUSE_CACHE_TAG, { expire: 0 });
      for (const path of ["/", "/en", "/ru"]) revalidatePath(path);
    }
    return true;
  } catch (error) {
    console.warn("[seo-score] Snapshot not stored (check the deployed Prisma migration).", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return false;
  }
}

export async function buildSeoScoreReport(options?: { forceFresh?: boolean }): Promise<string> {
  const day = berlinDay();

  if (!options?.forceFresh) {
    const cached = await readCachedReport(day);
    if (cached) return `${cached}\n\n♻️ Кэш за сегодня. Пересчитать: /seo new`;
  }

  const [selfCheck, mobilePsi, desktopPsi, gsc, ai] = await Promise.all([
    runSelfCheck(),
    fetchPageSpeed(`${siteBase()}/`, { strategy: "mobile", categories: ["performance"] }),
    fetchPageSpeed(`${siteBase()}/`, {
      strategy: "desktop",
      categories: ["performance", "seo", "accessibility", "best-practices"],
    }),
    fetchGscSnapshot(keyUrls().slice(0, 6)),
    aiReferrals7d(),
  ]);

  const components: Component[] = [
    indexationComponent(gsc),
    cwvComponent(mobilePsi),
    errorsComponent(selfCheck),
    ctrComponent(gsc),
    await newPagesComponent(selfCheck, day),
    lighthouseComponent(mobilePsi, desktopPsi),
    aiComponent(ai),
  ];

  const { score, usedWeight } = totalScore(components);
  const gscNote = !gsc.configured
    ? ["", "⚙️ GSC не подключён: «Индексация» и «CTR» не учтены в скоре (инструкция: docs/seo-score-setup.md)."]
    : gsc.error
      ? ["", `⚙️ GSC вернул ошибку: ${gsc.error}`]
      : [];
  const topQueries =
    gsc.analytics?.topQueries.length
      ? [
          "",
          "🔎 Топ-запросы за 7 дней:",
          ...gsc.analytics.topQueries.map(
            (row, index) => `${index + 1}. «${row.query}» — ${row.clicks} кл. (позиция ${row.position})`,
          ),
        ]
      : [];

  const report = [
    `🧮 SaaleWeb — SEO Score: ${score}/100`,
    "",
    ...components.map((component) => component.line),
    ...topQueries,
    ...gscNote,
    "",
    `📐 Учтено компонент: ${components.filter((component) => component.score !== null).length}/${components.length} (вес ${usedWeight}/100).`,
  ].join("\n");

  await storeSnapshot(day, score, selfCheck.sitemapUrls, report, mobilePsi, desktopPsi);
  return report;
}
