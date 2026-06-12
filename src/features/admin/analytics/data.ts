import { prisma } from "@/lib/prisma";

export type DayPoint = { day: string; count: number };
export type DashboardAnalytics = {
  rangeDays: number;
  viewsTotal: number;
  uniqueTotal: number;
  leadsTotal: number;
  viewsSeries: DayPoint[];
  uniqueSeries: DayPoint[];
  leadsSeries: DayPoint[];
  topPaths: { path: string; count: number }[];
  leadsNew: number;
  leadsAllTime: number;
};

function sinceDate(days: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (days - 1));
  return d;
}

function fillSeries(rows: DayPoint[], days: number): DayPoint[] {
  const map = new Map(rows.map((r) => [r.day, Number(r.count)]));
  const start = sinceDate(days);
  const out: DayPoint[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    out.push({ day: key, count: map.get(key) ?? 0 });
  }
  return out;
}

export async function getDashboardAnalytics(rangeDays = 30): Promise<DashboardAnalytics> {
  const since = sinceDate(rangeDays);
  const fallback: DashboardAnalytics = {
    rangeDays,
    viewsTotal: 0,
    uniqueTotal: 0,
    leadsTotal: 0,
    viewsSeries: fillSeries([], rangeDays),
    uniqueSeries: fillSeries([], rangeDays),
    leadsSeries: fillSeries([], rangeDays),
    topPaths: [],
    leadsNew: 0,
    leadsAllTime: 0,
  };

  try {
    const [
      viewsRows,
      uniqueRows,
      leadsRows,
      topPaths,
      viewsTotal,
      uniqueTotalRows,
      leadsTotal,
      leadsNew,
      leadsAllTime,
    ] =
      await Promise.all([
        prisma.$queryRaw<DayPoint[]>`SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${since} GROUP BY 1 ORDER BY 1`,
        prisma.$queryRaw<DayPoint[]>`SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day, count(DISTINCT "visitorHash")::int AS count FROM "PageView" WHERE "createdAt" >= ${since} AND "visitorHash" IS NOT NULL GROUP BY 1 ORDER BY 1`,
        prisma.$queryRaw<DayPoint[]>`SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day, count(*)::int AS count FROM "Lead" WHERE "createdAt" >= ${since} GROUP BY 1 ORDER BY 1`,
        prisma.$queryRaw<{ path: string; count: number }[]>`SELECT path, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${since} GROUP BY path ORDER BY count DESC LIMIT 8`,
        prisma.pageView.count({ where: { createdAt: { gte: since } } }),
        prisma.$queryRaw<{ count: number }[]>`SELECT count(DISTINCT "visitorHash")::int AS count FROM "PageView" WHERE "createdAt" >= ${since} AND "visitorHash" IS NOT NULL`,
        prisma.lead.count({ where: { createdAt: { gte: since } } }),
        prisma.lead.count({ where: { status: "NEW" } }),
        prisma.lead.count(),
      ]);

    return {
      rangeDays,
      viewsTotal: Number(viewsTotal),
      uniqueTotal: Number(uniqueTotalRows[0]?.count ?? 0),
      leadsTotal: Number(leadsTotal),
      viewsSeries: fillSeries(viewsRows, rangeDays),
      uniqueSeries: fillSeries(uniqueRows, rangeDays),
      leadsSeries: fillSeries(leadsRows, rangeDays),
      topPaths: topPaths.map((t) => ({ path: t.path, count: Number(t.count) })),
      leadsNew: Number(leadsNew),
      leadsAllTime: Number(leadsAllTime),
    };
  } catch {
    return fallback;
  }
}
