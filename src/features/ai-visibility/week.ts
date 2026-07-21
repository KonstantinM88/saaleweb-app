const WEEK_PATTERN = /^(\d{4})-W(\d{2})$/;
const BERLIN_CALENDAR = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Berlin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function getBerlinCalendarDate(value: Date): Date {
  const parts = Object.fromEntries(
    BERLIN_CALENDAR.formatToParts(value)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
}

export function getIsoWeekId(value = new Date()): string {
  const date = getBerlinCalendarDate(value);
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const year = date.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

export function isIsoWeekId(value: string): boolean {
  const match = WEEK_PATTERN.exec(value);
  if (!match) return false;
  const shifted = shiftIsoWeek(value, 0);
  return shifted === value;
}

export function shiftIsoWeek(value: string, amount: number): string {
  const match = WEEK_PATTERN.exec(value);
  if (!match) return getIsoWeekId();
  const year = Number(match[1]);
  const week = Number(match[2]);
  if (week < 1 || week > 53) return getIsoWeekId();

  const januaryFourth = new Date(Date.UTC(year, 0, 4));
  const januaryFourthDay = januaryFourth.getUTCDay() || 7;
  const monday = new Date(januaryFourth);
  monday.setUTCDate(januaryFourth.getUTCDate() - januaryFourthDay + 1 + (week - 1 + amount) * 7);
  return getIsoWeekId(monday);
}
