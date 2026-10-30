import "server-only";
import { prisma } from "@/lib/prisma";
import { withDatabaseConnectionRetry } from "@/lib/databaseRetry";
import {
  calendarDate, calendarMidnight, reportClock, reportTimeZone, shiftCalendarDate,
} from "@/shared/lib/reportCalendar";
import type { TelegramTrafficSnapshot, TrafficDay } from "./trafficSummary";

type TrafficRow = {
  day: string;
  views: number;
  visitors: number;
  partialViews: number;
  partialVisitors: number;
};

/** One bounded aggregate, awaited separately from the other report DB queries. */
export async function loadTelegramTraffic(now: Date): Promise<TelegramTrafficSnapshot | null> {
  try {
    const timeZone = reportTimeZone();
    const todayKey = calendarDate(now, timeZone);
    const todayStart = calendarMidnight(todayKey, timeZone);
    const yesterdayKey = shiftCalendarDate(todayKey, -1);
    const yesterdayStart = calendarMidnight(yesterdayKey, timeZone);
    const oldestStart = calendarMidnight(shiftCalendarDate(todayKey, -14), timeZone);
    // Match elapsed time, and cap at yesterday's end on a 23/25-hour DST day.
    const previousCutoff = new Date(Math.min(
      yesterdayStart.getTime() + now.getTime() - todayStart.getTime(), todayStart.getTime(),
    ));
    const rows = await withDatabaseConnectionRetry(() => prisma.$queryRaw<TrafficRow[]>`
      SELECT to_char("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE ${timeZone}, 'YYYY-MM-DD') AS day,
        count(*)::int AS views, count(DISTINCT "visitorHash")::int AS visitors,
        (count(*) FILTER (WHERE "createdAt" < ${previousCutoff}))::int AS "partialViews",
        (count(DISTINCT "visitorHash") FILTER (WHERE "createdAt" < ${previousCutoff}))::int AS "partialVisitors"
      FROM "PageView" WHERE "createdAt" >= ${oldestStart} AND "createdAt" < ${now}
        AND path NOT LIKE '/e/%' GROUP BY 1 ORDER BY 1`,
    { operation: "telegram_report:traffic_calendar" });
    const byDate = new Map(rows.map((row) => [row.day, row]));
    const days: TrafficDay[] = Array.from({ length: 15 }, (_, index) => {
      const date = shiftCalendarDate(todayKey, index - 14);
      const row = byDate.get(date);
      return { date, views: Number(row?.views ?? 0), visitors: Number(row?.visitors ?? 0) };
    });
    const sum = (list: TrafficDay[]) => list.reduce((total, day) => ({
      views: total.views + day.views, visitors: total.visitors + day.visitors,
    }), { views: 0, visitors: 0 });
    const previous = byDate.get(yesterdayKey);
    return {
      timeZone, days, today: days[14]!, yesterday: days[13]!, dayBefore: days[12]!,
      todayClock: reportClock(now, timeZone), previousClock: previousCutoff.getTime() === todayStart.getTime() ? "24:00" : reportClock(previousCutoff, timeZone),
      previousPartial: { views: Number(previous?.partialViews ?? 0), visitors: Number(previous?.partialVisitors ?? 0) },
      week: sum(days.slice(7, 14)), previousWeek: sum(days.slice(0, 7)),
    };
  } catch {
    console.warn("[telegram-report] Calendar traffic unavailable; keeping the base report.");
    return null;
  }
}
