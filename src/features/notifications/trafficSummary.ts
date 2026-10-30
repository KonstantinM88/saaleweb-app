import { shortCalendarDate } from "@/shared/lib/reportCalendar";

export type TrafficDay = { date: string; views: number; visitors: number };
export type TrafficTotals = { views: number; visitors: number };
export type TelegramTrafficSnapshot = {
  timeZone: string;
  today: TrafficDay;
  yesterday: TrafficDay;
  dayBefore: TrafficDay;
  todayClock: string;
  previousClock: string;
  previousPartial: TrafficTotals;
  days: TrafficDay[];
  week: TrafficTotals;
  previousWeek: TrafficTotals;
};

export function trafficChange(current: number, previous: number): string {
  const difference = current - previous;
  if (difference === 0) return "без изменений";
  const absolute = `${difference > 0 ? "+" : ""}${difference}`;
  if (previous === 0) return `${absolute}, было 0`;
  const percent = Math.round((difference / previous) * 100);
  return `${absolute} / ${percent > 0 ? "+" : ""}${percent}%`;
}

export function trafficCalendarLines(snapshot: TelegramTrafficSnapshot): string[] {
  const { today, yesterday, dayBefore, week, previousWeek, days } = snapshot;
  const comparison = (current: TrafficTotals, previous: TrafficTotals) =>
    `${current.views} просмотров, ≈${current.visitors} посетителей; просмотры: ${trafficChange(current.views, previous.views)}`;
  return [
    "🗓 По календарным дням — собственный счётчик",
    `• Сегодня ${shortCalendarDate(today.date)}, 00:00–${snapshot.todayClock} (неполный день): ${today.views} просмотров, ≈${today.visitors} посетителей.`,
    `  Вчера за сопоставимое время, до ${snapshot.previousClock}: ${snapshot.previousPartial.views} просмотров; изменение: ${trafficChange(today.views, snapshot.previousPartial.views)}.`,
    `• Вчера ${shortCalendarDate(yesterday.date)}: ${comparison(yesterday, dayBefore)} к ${shortCalendarDate(dayBefore.date)}.`,
    `• 7 завершённых дней ${shortCalendarDate(days[7]!.date)}–${shortCalendarDate(yesterday.date)}: ${week.views} просмотров, ${trafficChange(week.views, previousWeek.views)} к предыдущим 7 дням (было ${previousWeek.views}).`,
    "• Посетители — оценка по дневному идентификатору; недельные посетители не равны числу разных людей.",
  ];
}
