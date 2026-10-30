/** Calendar dates are shifted as dates, never as fixed 24-hour instants. */
export function reportTimeZone(): string {
  const requested = process.env.TELEGRAM_REPORT_TIMEZONE || "Europe/Berlin";
  try {
    new Intl.DateTimeFormat("en", { timeZone: requested }).format();
    return requested;
  } catch {
    return "Europe/Berlin";
  }
}

export function calendarDate(now: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function shiftCalendarDate(day: string, days: number): string {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function calendarMidnight(day: string, timeZone: string): Date {
  const target = Date.parse(`${day}T00:00:00Z`);
  let instant = target;
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  });
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const parts = formatter.formatToParts(new Date(instant));
    const get = (type: string) => parts.find((part) => part.type === type)?.value;
    const local = Date.parse(`${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}Z`);
    const correction = target - local;
    if (correction === 0) return new Date(instant);
    instant += correction;
  }
  throw new Error("Unable to resolve report calendar midnight");
}

export function shortCalendarDate(day: string): string {
  return `${day.slice(8, 10)}.${day.slice(5, 7)}`;
}

export function reportClock(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(date);
}
