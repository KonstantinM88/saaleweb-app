import "server-only";
import sharp from "sharp";
import { shortCalendarDate } from "@/shared/lib/reportCalendar";
import { trafficChange, type TelegramTrafficSnapshot } from "./trafficSummary";

const escape = (value: string | number) => String(value).replace(/[&<>"']/g, (char) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!);

export function trafficChartSvg(snapshot: TelegramTrafficSnapshot): string {
  const text = (x: number, y: number, content: string | number, size = 24, color = "#475569", weight = 400, anchor = "start") =>
    `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}" text-anchor="${anchor}">${escape(content)}</text>`;
  const { today, yesterday, dayBefore, week, previousWeek } = snapshot;
  const card = (x: number, title: string, value: number, subtitle: string, comparison: string) =>
    `<rect x="${x}" y="160" width="352" height="202" rx="22" fill="white" stroke="#e2e8f0"/>
     ${text(x + 22, 196, title, 24, "#334155", 600)}
     ${text(x + 22, 254, value, 52, "#0f172a", 700)}
     ${text(x + 22, 292, subtitle, 22)}
     ${text(x + 22, 332, comparison, 21, "#6d28d9", 600)}`;
  const days = snapshot.days.slice(7);
  const maximum = Math.max(1, ...days.flatMap((day) => [day.views, day.visitors]));
  const tick = Math.max(1, Math.ceil(maximum / 4));
  const scale = tick * 4;
  const baseline = 802;
  const height = 300;
  const grids = Array.from({ length: 5 }, (_, index) => {
    const y = baseline - index * height / 4;
    return `<line x1="88" y1="${y}" x2="1144" y2="${y}" stroke="#e2e8f0"/>${text(68, y + 7, index * tick, 20, "#64748b", 400, "end")}`;
  }).join("");
  const bars = days.map((day, index) => {
    const x = 152 + index * 132;
    const partial = index === days.length - 1;
    const viewsHeight = day.views / scale * height;
    const visitorsHeight = day.visitors / scale * height;
    const weekday = partial ? "сегодня*" : new Intl.DateTimeFormat("ru-RU", { weekday: "short", timeZone: "UTC" }).format(new Date(`${day.date}T12:00:00Z`));
    return `${partial ? `<rect x="${x - 58}" y="477" width="116" height="414" rx="14" fill="#eef2ff"/><line x1="${x - 66}" y1="477" x2="${x - 66}" y2="882" stroke="#94a3b8" stroke-dasharray="6 6"/>` : ""}
      <rect x="${x - 35}" y="${baseline - viewsHeight}" width="32" height="${viewsHeight}" rx="4" fill="${partial ? "#a5b4fc" : "#6d28d9"}"/>
      <rect x="${x + 5}" y="${baseline - visitorsHeight}" width="26" height="${visitorsHeight}" rx="4" fill="#0f766e"/>
      ${text(x - 19, baseline - viewsHeight - 13, day.views, 22, "#6d28d9", 700, "middle")}
      ${text(x + 18, baseline - visitorsHeight - 13, day.visitors, 20, "#0f766e", 600, "middle")}
      ${text(x, 841, weekday, partial ? 20 : 23, "#334155", 600, "middle")}
      ${text(x, 875, shortCalendarDate(day.date), 22, "#64748b", 400, "middle")}`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1060" viewBox="0 0 1200 1060">
    <rect width="1200" height="1060" fill="#f8fafc"/>
    <rect width="1200" height="130" fill="#0f172a"/>
    <g font-family="Arial, DejaVu Sans, sans-serif">
      ${text(48, 59, "SaaleWeb · Трафик сайта", 40, "#ffffff", 700)}
      ${text(48, 100, `Собственный счётчик · ${snapshot.timeZone} · ${shortCalendarDate(today.date)} ${snapshot.todayClock}`, 23, "#cbd5e1")}
      ${card(48, `Сегодня* · ${shortCalendarDate(today.date)}`, today.views, `просмотров до ${snapshot.todayClock}`, `Вчера до ${snapshot.previousClock}: ${snapshot.previousPartial.views}`)}
      ${card(424, `Вчера · ${shortCalendarDate(yesterday.date)}`, yesterday.views, `просмотров · ${shortCalendarDate(dayBefore.date)}: ${dayBefore.views}`, trafficChange(yesterday.views, dayBefore.views))}
      ${card(800, "7 завершённых дней", week.views, `просмотров · ранее: ${previousWeek.views}`, trafficChange(week.views, previousWeek.views))}
      ${text(48, 420, "Динамика за неделю и неполный сегодняшний день", 29, "#0f172a", 700)}
      <rect x="48" y="444" width="17" height="17" rx="3" fill="#6d28d9"/>${text(77, 459, "Просмотры", 22)}
      <rect x="274" y="444" width="17" height="17" rx="3" fill="#0f766e"/>${text(303, 459, "Посетители ≈", 22)}
      ${grids}${bars}
      <rect x="48" y="922" width="1104" height="100" rx="18" fill="white" stroke="#e2e8f0"/>
      ${text(70, 958, "* Сегодня показана только прошедшая часть дня; не сравнивайте с полными сутками.", 22)}
      ${text(70, 994, "Посетители — дневная оценка. Эти числа не смешиваются с данными GA4.", 22)}
    </g></svg>`;
}

export async function renderTelegramTrafficChart(snapshot: TelegramTrafficSnapshot): Promise<Buffer | null> {
  try {
    const png = await sharp(Buffer.from(trafficChartSvg(snapshot))).png().toBuffer();
    if (png.length > 5 * 1024 * 1024) throw new Error("Chart exceeds photo size budget");
    return png;
  } catch {
    console.warn("[telegram-report] Traffic chart rendering failed; keeping the text report.");
    return null;
  }
}
