import "server-only";

import { detectAiReferrer } from "@/features/analytics/aiTraffic";
import {
  fetchGa4Snapshot,
  type Ga4Snapshot,
} from "@/features/analytics/googleAnalytics";
import { prisma } from "@/lib/prisma";
import type { LeadNotification } from "./mailer";
import { sendTelegramAdminMessage } from "./telegram";

type CountRow = { count: number | bigint | null };
type PathCountRow = { path: string | null; count: number | bigint | null };
type LocaleCountRow = { locale: string | null; count: number | bigint | null };
type StatusCountRow = { status: string | null; count: number | bigint | null };
type LabelCount = { label: string; count: number };
type LabelDeltaCount = { label: string; count: number; previousCount: number };
type ReferrerBreakdown = {
  directTotal: number;
  previousDirectTotal: number;
  searchTotal: number;
  previousSearchTotal: number;
  searchCounts: LabelDeltaCount[];
  externalTotal: number;
  previousExternalTotal: number;
  externalCounts: LabelDeltaCount[];
};
type AiTrafficSummary = {
  botTotal: number;
  previousBotTotal: number;
  botCounts: LabelCount[];
  botPaths: LabelCount[];
  botTrackingUnavailable: boolean;
  referralTotal: number;
  previousReferralTotal: number;
  referralCounts: LabelDeltaCount[];
};

const MS_IN_DAY = 24 * 60 * 60 * 1000;
const MS_IN_WEEK = 7 * MS_IN_DAY;
const SYNTHETIC_EVENT_PATH_PATTERN = "/e/%";

function countValue(rows: CountRow[]): number {
  return Number(rows[0]?.count ?? 0);
}

async function countRealPageViews(from: Date, to: Date): Promise<number> {
  const rows = await prisma.$queryRaw<CountRow[]>`SELECT count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND path NOT LIKE ${SYNTHETIC_EVENT_PATH_PATTERN}`;
  return countValue(rows);
}

async function countRealUniqueVisitors(from: Date, to: Date): Promise<number> {
  const rows = await prisma.$queryRaw<CountRow[]>`SELECT count(DISTINCT "visitorHash")::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND path NOT LIKE ${SYNTHETIC_EVENT_PATH_PATTERN} AND "visitorHash" IS NOT NULL`;
  return countValue(rows);
}

async function queryTopRealPages(from: Date, to: Date, limit: number): Promise<PathCountRow[]> {
  return prisma.$queryRaw<PathCountRow[]>`SELECT path, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND path NOT LIKE ${SYNTHETIC_EVENT_PATH_PATTERN} GROUP BY path ORDER BY count DESC LIMIT ${limit}`;
}

async function queryRealPageLocales(from: Date, to: Date): Promise<LocaleCountRow[]> {
  return prisma.$queryRaw<LocaleCountRow[]>`SELECT locale, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND path NOT LIKE ${SYNTHETIC_EVENT_PATH_PATTERN} GROUP BY locale ORDER BY count DESC`;
}

async function queryTopRealReferrers(from: Date, to: Date, limit: number): Promise<PathCountRow[]> {
  return prisma.$queryRaw<PathCountRow[]>`SELECT COALESCE(NULLIF(referrer, ''), 'Прямой заход') AS path, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND path NOT LIKE ${SYNTHETIC_EVENT_PATH_PATTERN} GROUP BY 1 ORDER BY count DESC LIMIT ${limit}`;
}

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://saaleweb.de").replace(/\/+$/, "");
}

function formatDateTime(date: Date): string {
  const timeZone = process.env.TELEGRAM_REPORT_TIMEZONE || "Europe/Berlin";
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      timeZone,
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Europe/Berlin",
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  }
}

function formatDelta(value: number): string {
  if (value > 0) return `+${value}`;
  return String(value);
}

/** "+37%", "−12%", "новое" (рост с нуля) или "0%" — динамика к прошлому периоду. */
function formatPercentDelta(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "новое" : "0%";
  const percent = Math.round(((current - previous) / previous) * 100);
  if (percent > 0) return `+${percent}%`;
  return `${percent}%`;
}

function formatDecimal(value: number, maximumFractionDigits = 1): string {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: maximumFractionDigits,
    maximumFractionDigits,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatInteger(value: number): string {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0,
  );
}

function formatRate(value: number): string {
  return `${formatDecimal(value * 100)}%`;
}

function formatConversion(leads: number, uniqueVisitors: number): string {
  if (uniqueVisitors <= 0) return "0,0%";
  return `${formatDecimal((leads / uniqueVisitors) * 100)}%`;
}

function formatDuration(seconds: number): string {
  const totalSeconds = Math.max(0, Math.round(Number.isFinite(seconds) ? seconds : 0));
  const minutes = Math.floor(totalSeconds / 60);
  const remainder = totalSeconds % 60;
  return minutes > 0 ? `${minutes} мин ${remainder} сек` : `${remainder} сек`;
}

function formatGa4Delta(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "новое" : "0%";
  const percent = ((current - previous) / previous) * 100;
  const prefix = percent > 0 ? "+" : "";
  return `${prefix}${formatDecimal(percent)}%`;
}

function referrerHost(value?: string | null): string | null {
  if (!value) return null;
  try {
    const host = new URL(value).hostname.toLowerCase();
    return host.startsWith("www.") ? host.slice(4) : host;
  } catch {
    return null;
  }
}

const SEARCH_ENGINES: { label: string; pattern: RegExp }[] = [
  { label: "Google", pattern: /(^|\.)google\.[a-z.]+$/i },
  { label: "Bing", pattern: /(^|\.)bing\.com$/i },
  { label: "DuckDuckGo", pattern: /(^|\.)duckduckgo\.com$/i },
  { label: "Yandex", pattern: /(^|\.)yandex\.[a-z]+$/i },
  { label: "Ecosia", pattern: /(^|\.)ecosia\.org$/i },
  { label: "Brave Search", pattern: /(^|\.)search\.brave\.com$/i },
  { label: "Startpage", pattern: /(^|\.)startpage\.com$/i },
  { label: "Qwant", pattern: /(^|\.)qwant\.com$/i },
];

function detectSearchEngine(host: string): string | null {
  const engine = SEARCH_ENGINES.find((item) => item.pattern.test(host));
  return engine?.label ?? null;
}

function ownHost(): string {
  try {
    return new URL(siteUrl()).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "saaleweb.de";
  }
}

function sourceLabel(source?: string | null): string {
  const labels: Record<string, string> = {
    contact_page: "страница контактов",
    homepage_contact: "форма на главной",
    website_audit: "аудит сайта",
    ai_assistant: "AI-ассистент",
  };
  return source ? labels[source] ?? source : "-";
}

function localeLabel(locale?: string | null): string {
  if (locale === "de") return "немецкий";
  if (locale === "en") return "английский";
  if (locale === "ru") return "русский";
  return locale || "-";
}

function leadStatusLabel(status?: string | null): string {
  const labels: Record<string, string> = {
    NEW: "новая",
    CONTACTED: "контакт установлен",
    QUALIFIED: "квалифицирована",
    WON: "выиграна",
    LOST: "закрыта / отказ",
  };
  return status ? labels[status] ?? status : "-";
}

function trimText(value?: string | null, maxLength = 120): string {
  const clean = value?.replace(/\s+/g, " ").trim();
  if (!clean) return "-";
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1)}…`;
}

function line(label: string, value?: string | null): string | undefined {
  const clean = value?.trim();
  return clean ? `${label}: ${clean}` : undefined;
}

function topCountLines(items: LabelCount[], emptyText: string): string[] {
  if (items.length === 0) return [`• ${emptyText}`];
  return items.map((item, index) => `${index + 1}. ${item.label} — ${item.count}`);
}

/** Строки с абсолютной динамикой источника: «1. Perplexity — 15 (+6)». */
function topDeltaLines(items: LabelDeltaCount[], emptyText: string): string[] {
  if (items.length === 0) return [`• ${emptyText}`];
  return items.map(
    (item, index) =>
      `${index + 1}. ${item.label} — ${item.count} (${formatDelta(item.count - item.previousCount)})`,
  );
}

async function loadAiBotTraffic(from: Date, to: Date, previousFrom: Date, previousTo: Date) {
  try {
    const [botTotal, previousBotTotal, botRows, pathRows] = await Promise.all([
      prisma.aiBotVisit.count({ where: { createdAt: { gte: from, lt: to } } }),
      prisma.aiBotVisit.count({ where: { createdAt: { gte: previousFrom, lt: previousTo } } }),
      prisma.$queryRaw<PathCountRow[]>`SELECT bot AS path, count(*)::int AS count FROM "AiBotVisit" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} GROUP BY bot ORDER BY count DESC LIMIT 5`,
      prisma.$queryRaw<PathCountRow[]>`SELECT path, count(*)::int AS count FROM "AiBotVisit" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} GROUP BY path ORDER BY count DESC LIMIT 5`,
    ]);

    return {
      botTotal: Number(botTotal),
      previousBotTotal: Number(previousBotTotal),
      botCounts: botRows.map((row) => ({ label: row.path || "AI-бот", count: Number(row.count ?? 0) })),
      botPaths: pathRows.map((row) => ({ label: row.path || "/", count: Number(row.count ?? 0) })),
      botTrackingUnavailable: false,
    };
  } catch (error) {
    console.warn("[telegram-report] AI bot traffic query skipped.", {
      message: error instanceof Error ? error.message : "Unknown AI bot analytics error",
    });
    return {
      botTotal: 0,
      previousBotTotal: 0,
      botCounts: [],
      botPaths: [],
      botTrackingUnavailable: true,
    };
  }
}

async function queryReferrerRows(from: Date, to: Date): Promise<PathCountRow[]> {
  return prisma.$queryRaw<PathCountRow[]>`SELECT referrer AS path, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND path NOT LIKE ${SYNTHETIC_EVENT_PATH_PATTERN} AND referrer IS NOT NULL AND referrer <> '' GROUP BY referrer ORDER BY count DESC LIMIT 400`;
}

async function queryAiReferrerRows(from: Date, to: Date): Promise<PathCountRow[]> {
  return prisma.$queryRaw<PathCountRow[]>`SELECT referrer AS path, count(DISTINCT COALESCE("visitorHash", id))::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND path NOT LIKE ${SYNTHETIC_EVENT_PATH_PATTERN} AND referrer IS NOT NULL AND referrer <> '' GROUP BY referrer ORDER BY count DESC`;
}

function aiCountsByLabel(rows: PathCountRow[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of rows) {
    const label = detectAiReferrer(row.path);
    if (!label) continue;
    map.set(label, (map.get(label) ?? 0) + Number(row.count ?? 0));
  }
  return map;
}

async function loadAiReferralTraffic(from: Date, to: Date, previousFrom: Date, previousTo: Date) {
  try {
    const [rows, previousRows] = await Promise.all([
      queryAiReferrerRows(from, to),
      queryAiReferrerRows(previousFrom, previousTo),
    ]);
    const current = aiCountsByLabel(rows);
    const previous = aiCountsByLabel(previousRows);

    const labels = new Set([...current.keys(), ...previous.keys()]);
    const referralCounts = [...labels]
      .map((label) => ({
        label,
        count: current.get(label) ?? 0,
        previousCount: previous.get(label) ?? 0,
      }))
      .filter((item) => item.count > 0 || item.previousCount > 0)
      .sort((a, b) => b.count - a.count || b.previousCount - a.previousCount)
      .slice(0, 8);

    return {
      referralTotal: [...current.values()].reduce((sum, value) => sum + value, 0),
      previousReferralTotal: [...previous.values()].reduce((sum, value) => sum + value, 0),
      referralCounts,
    };
  } catch (error) {
    console.warn("[telegram-report] AI referral query skipped.", {
      message: error instanceof Error ? error.message : "Unknown AI referral analytics error",
    });
    return {
      referralTotal: 0,
      previousReferralTotal: 0,
      referralCounts: [],
    };
  }
}

/**
 * Полная картина источников: прямые заходы, поисковики, переходы с других
 * сайтов (сгруппированы по хосту, без собственного домена и AI-источников —
 * те считаются отдельно в AI-блоке).
 */
async function loadReferrerBreakdown(
  from: Date,
  to: Date,
  previousFrom: Date,
  previousTo: Date,
): Promise<ReferrerBreakdown> {
  const empty: ReferrerBreakdown = {
    directTotal: 0,
    previousDirectTotal: 0,
    searchTotal: 0,
    previousSearchTotal: 0,
    searchCounts: [],
    externalTotal: 0,
    previousExternalTotal: 0,
    externalCounts: [],
  };

  try {
    const [rows, previousRows, directRows, previousDirectRows] = await Promise.all([
      queryReferrerRows(from, to),
      queryReferrerRows(previousFrom, previousTo),
      prisma.$queryRaw<CountRow[]>`SELECT count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND path NOT LIKE ${SYNTHETIC_EVENT_PATH_PATTERN} AND (referrer IS NULL OR referrer = '')`,
      prisma.$queryRaw<CountRow[]>`SELECT count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${previousFrom} AND "createdAt" < ${previousTo} AND path NOT LIKE ${SYNTHETIC_EVENT_PATH_PATTERN} AND (referrer IS NULL OR referrer = '')`,
    ]);

    const own = ownHost();
    const classify = (source: PathCountRow[]) => {
      const search = new Map<string, number>();
      const external = new Map<string, number>();
      for (const row of source) {
        const count = Number(row.count ?? 0);
        const host = referrerHost(row.path);
        if (!host || host === own || host.endsWith(`.${own}`) || host === "localhost") continue;
        if (detectAiReferrer(row.path)) continue; // считается в AI-блоке
        const engine = detectSearchEngine(host);
        if (engine) {
          search.set(engine, (search.get(engine) ?? 0) + count);
        } else {
          external.set(host, (external.get(host) ?? 0) + count);
        }
      }
      return { search, external };
    };

    const current = classify(rows);
    const previous = classify(previousRows);
    const sum = (map: Map<string, number>) =>
      [...map.values()].reduce((total, value) => total + value, 0);
    const toDeltaList = (
      currentMap: Map<string, number>,
      previousMap: Map<string, number>,
      limit: number,
    ): LabelDeltaCount[] =>
      [...new Set([...currentMap.keys(), ...previousMap.keys()])]
        .map((label) => ({
          label,
          count: currentMap.get(label) ?? 0,
          previousCount: previousMap.get(label) ?? 0,
        }))
        .filter((item) => item.count > 0 || item.previousCount > 0)
        .sort((a, b) => b.count - a.count || b.previousCount - a.previousCount)
        .slice(0, limit);

    return {
      directTotal: countValue(directRows),
      previousDirectTotal: countValue(previousDirectRows),
      searchTotal: sum(current.search),
      previousSearchTotal: sum(previous.search),
      searchCounts: toDeltaList(current.search, previous.search, 5),
      externalTotal: sum(current.external),
      previousExternalTotal: sum(previous.external),
      externalCounts: toDeltaList(current.external, previous.external, 6),
    };
  } catch (error) {
    console.warn("[telegram-report] Referrer breakdown query skipped.", {
      message: error instanceof Error ? error.message : "Unknown referrer analytics error",
    });
    return empty;
  }
}

async function loadAiTraffic(from: Date, to: Date, previousFrom: Date, previousTo: Date): Promise<AiTrafficSummary> {
  const [botTraffic, referralTraffic] = await Promise.all([
    loadAiBotTraffic(from, to, previousFrom, previousTo),
    loadAiReferralTraffic(from, to, previousFrom, previousTo),
  ]);

  return {
    ...botTraffic,
    ...referralTraffic,
  };
}

export async function sendLeadTelegramNotification(lead: LeadNotification): Promise<boolean> {
  const adminUrl = `${siteUrl()}/admin/leads`;
  const message = [
    "🟣 Новая заявка SaaleWeb",
    "",
    line("📌 Источник", sourceLabel(lead.source)),
    line("🌐 Язык", localeLabel(lead.locale)),
    line("👤 Имя", lead.name),
    line("✉️ E-mail", lead.email),
    line("📞 Телефон", lead.phone),
    line("🏢 Компания", lead.company),
    line("🧩 Тип проекта", lead.projectType),
    line("💶 Бюджет", lead.budget),
    line("🔗 Сайт", lead.projectWebsite),
    "",
    "💬 Сообщение:",
    lead.message?.trim() || "-",
    "",
    `⚙️ Админка: ${adminUrl}`,
  ]
    .filter((part): part is string => Boolean(part))
    .join("\n");

  return sendTelegramAdminMessage(message);
}

function ga4UnavailableText(snapshot: Ga4Snapshot): string {
  if (!snapshot.configured) {
    return "Интеграция не настроена: проверь GA4_PROPERTY_ID и Google service account.";
  }
  if (snapshot.errorCode === "ga4_no_data") return "За выбранный период в GA4 пока нет данных.";
  return "Google Analytics временно недоступен; собственная аналитика продолжает работать.";
}

function ga4DailyLines(snapshot: Ga4Snapshot): string[] {
  if (!snapshot.available) {
    return ["📈 GA4 — завершённый календарный день", `• ${ga4UnavailableText(snapshot)}`];
  }

  const leader = snapshot.channels[0];
  return [
    "📈 GA4 — завершённый календарный день",
    "• Данные с учётом Consent Mode; не равны first-party статистике.",
    `• Активные пользователи GA4: ${formatInteger(snapshot.totals.activeUsers)} (${formatGa4Delta(snapshot.totals.activeUsers, snapshot.previousTotals.activeUsers)})`,
    `• Сессии: ${formatInteger(snapshot.totals.sessions)} (${formatGa4Delta(snapshot.totals.sessions, snapshot.previousTotals.sessions)})`,
    `• Вовлечённость: ${formatRate(snapshot.totals.engagementRate)}`,
    `• Среднее время сессии: ${formatDuration(snapshot.totals.averageSessionDuration)}`,
    `• Главный канал: ${leader ? `${trimText(leader.channel, 60)} — ${formatInteger(leader.sessions)}` : "данных пока нет"}`,
  ];
}

function ga4WeeklyLines(snapshot: Ga4Snapshot): string[] {
  if (!snapshot.available) {
    return ["📈 GA4 — 7 завершённых дней", `• ${ga4UnavailableText(snapshot)}`];
  }

  const leader = snapshot.channels[0];
  const landing = snapshot.landingPages[0];
  return [
    "📈 GA4 — 7 завершённых дней",
    "• Данные с учётом Consent Mode; не равны first-party статистике.",
    `• Активные пользователи GA4: ${formatInteger(snapshot.totals.activeUsers)} (${formatGa4Delta(snapshot.totals.activeUsers, snapshot.previousTotals.activeUsers)})`,
    `• Сессии: ${formatInteger(snapshot.totals.sessions)} (${formatGa4Delta(snapshot.totals.sessions, snapshot.previousTotals.sessions)})`,
    `• Просмотры: ${formatInteger(snapshot.totals.screenPageViews)} (${formatGa4Delta(snapshot.totals.screenPageViews, snapshot.previousTotals.screenPageViews)})`,
    `• Engagement rate: ${formatRate(snapshot.totals.engagementRate)}`,
    `• Средняя длительность: ${formatDuration(snapshot.totals.averageSessionDuration)}`,
    `• Главный канал: ${leader ? `${trimText(leader.channel, 60)} — ${formatInteger(leader.sessions)}` : "данных пока нет"}`,
    `• Главная landing page: ${landing ? `${trimText(landing.path, 100)} — ${formatInteger(landing.sessions)}` : "данных пока нет"}`,
  ];
}

function capitalize(value: string): string {
  return value ? `${value[0]?.toUpperCase() ?? ""}${value.slice(1)}` : value;
}

/** Полный GA4-отчёт для команды /ga4; данные не смешиваются с PageView. */
export async function buildGa4Report(now = new Date()): Promise<string> {
  void now;
  const snapshot = await fetchGa4Snapshot("weekly");
  if (!snapshot.available) {
    return [
      "📈 SaaleWeb — GA4",
      "",
      `• ${ga4UnavailableText(snapshot)}`,
      "• Собственная cookieless-аналитика SaaleWeb продолжает работать независимо.",
    ].join("\n");
  }

  const channelLines =
    snapshot.channels.length > 0
      ? snapshot.channels.map(
          (row, index) =>
            `${index + 1}. ${trimText(row.channel, 60)} — ${formatInteger(row.sessions)} сессий`,
        )
      : ["• Каналы за период не определены."];
  const landingLines =
    snapshot.landingPages.length > 0
      ? snapshot.landingPages.map(
          (row, index) =>
            `${index + 1}. ${trimText(row.path, 100)} — ${formatInteger(row.sessions)} сессий`,
        )
      : ["• Посадочные страницы за период не определены."];
  const deviceLines =
    snapshot.devices.length > 0
      ? snapshot.devices.map(
          (row) =>
            `• ${capitalize(row.device)} — ${formatInteger(row.activeUsers)} пользователей / ${formatInteger(row.sessions)} сессий`,
        )
      : ["• Данных по устройствам пока нет."];
  const countryLines =
    snapshot.countries.length > 0
      ? snapshot.countries.map(
          (row) =>
            `• ${row.country} — ${formatInteger(row.activeUsers)} пользователей / ${formatInteger(row.sessions)} сессий`,
        )
      : ["• Данных по странам пока нет."];
  const eventLines = snapshot.events.map(
    (row) => `• ${row.eventName} — ${formatInteger(row.eventCount)}`,
  );

  return [
    "📈 SaaleWeb — GA4",
    "",
    `🕘 Период: ${snapshot.periodLabel}`,
    "🔐 GA4 учитывает Consent Mode и может включать моделированные показатели; это не first-party статистика.",
    "",
    "📊 Аудитория",
    `• Активные пользователи: ${formatInteger(snapshot.totals.activeUsers)} (${formatGa4Delta(snapshot.totals.activeUsers, snapshot.previousTotals.activeUsers)})`,
    `• Сессии: ${formatInteger(snapshot.totals.sessions)} (${formatGa4Delta(snapshot.totals.sessions, snapshot.previousTotals.sessions)})`,
    `• Просмотры страниц: ${formatInteger(snapshot.totals.screenPageViews)} (${formatGa4Delta(snapshot.totals.screenPageViews, snapshot.previousTotals.screenPageViews)})`,
    `• Вовлечённые сессии: ${formatInteger(snapshot.totals.engagedSessions)} (${formatGa4Delta(snapshot.totals.engagedSessions, snapshot.previousTotals.engagedSessions)})`,
    `• Engagement rate: ${formatRate(snapshot.totals.engagementRate)}`,
    `• Средняя длительность сессии: ${formatDuration(snapshot.totals.averageSessionDuration)}`,
    "",
    "📣 Каналы",
    ...channelLines,
    "",
    "🏁 Посадочные страницы",
    ...landingLines,
    "",
    "📱 Устройства",
    ...deviceLines,
    "",
    "🌍 Страны",
    ...countryLines,
    "",
    "🎯 События",
    ...eventLines,
    ...(snapshot.errorCode === "ga4_partial_data"
      ? ["", "⚠️ Часть дополнительных срезов GA4 временно недоступна."]
      : []),
  ].join("\n");
}

export async function buildDailySiteReport(now = new Date()): Promise<string> {
  const to = now;
  const from = new Date(to.getTime() - MS_IN_DAY);
  const previousFrom = new Date(from.getTime() - MS_IN_DAY);
  const previousTo = from;
  const leadWindow = { createdAt: { gte: from, lt: to } };
  const previousLeadWindow = { createdAt: { gte: previousFrom, lt: previousTo } };

  const [
    viewsTotal,
    previousViewsTotal,
    uniqueTotal,
    previousUniqueTotal,
    leadsTotal,
    previousLeadsTotal,
    leadsNew,
    topPaths,
    localeRows,
    aiTraffic,
    referrers,
    ga4,
  ] = await Promise.all([
    countRealPageViews(from, to),
    countRealPageViews(previousFrom, previousTo),
    countRealUniqueVisitors(from, to),
    countRealUniqueVisitors(previousFrom, previousTo),
    prisma.lead.count({ where: leadWindow }),
    prisma.lead.count({ where: previousLeadWindow }),
    prisma.lead.count({ where: { status: "NEW" } }),
    queryTopRealPages(from, to, 5),
    queryRealPageLocales(from, to),
    loadAiTraffic(from, to, previousFrom, previousTo),
    loadReferrerBreakdown(from, to, previousFrom, previousTo),
    fetchGa4Snapshot("daily"),
  ]);

  const topPathLines =
    topPaths.length > 0
      ? topPaths.map((item, index) => `${index + 1}. ${item.path || "/"} — ${Number(item.count ?? 0)}`)
      : ["• За период не было просмотров страниц."];
  const localeLines =
    localeRows.length > 0
      ? localeRows.map((item) => `${item.locale || "-"} — ${Number(item.count ?? 0)}`).join(", ")
      : "-";
  const aiBotDelta = formatDelta(aiTraffic.botTotal - aiTraffic.previousBotTotal);
  const aiBotLines = aiTraffic.botTrackingUnavailable
    ? ["• Мониторинг AI-ботов ожидает применения таблицы в БД."]
    : [
        `• AI-боты / краулеры: ${aiTraffic.botTotal} (${aiBotDelta})`,
        ...topCountLines(aiTraffic.botCounts, "AI-боты за период не замечены."),
      ];
  const aiReferralLines = [
    `• Переходы из AI: ${aiTraffic.referralTotal} (${formatPercentDelta(aiTraffic.referralTotal, aiTraffic.previousReferralTotal)} к прошлому дню)`,
    ...topDeltaLines(aiTraffic.referralCounts, "Переходов из ChatGPT, Gemini, Claude, Perplexity или Copilot не было."),
  ];
  const aiPathLines = aiTraffic.botTrackingUnavailable
    ? []
    : ["", "🧭 Страницы, которые смотрели AI-боты:", ...topCountLines(aiTraffic.botPaths, "Пока нет данных по страницам.")];
  const sourceLines = [
    `• Прямые заходы: ${referrers.directTotal} (${formatPercentDelta(referrers.directTotal, referrers.previousDirectTotal)})`,
    `• Поисковики: ${referrers.searchTotal} (${formatPercentDelta(referrers.searchTotal, referrers.previousSearchTotal)})`,
    ...topDeltaLines(referrers.searchCounts, "Переходов из поисковиков не было."),
    `• AI-ассистенты: ${aiTraffic.referralTotal} (${formatPercentDelta(aiTraffic.referralTotal, aiTraffic.previousReferralTotal)})`,
    `• Другие сайты: ${referrers.externalTotal} (${formatPercentDelta(referrers.externalTotal, referrers.previousExternalTotal)})`,
  ];
  const externalLines = topDeltaLines(referrers.externalCounts, "Переходов с других сайтов не было.");

  return [
    "📊 SaaleWeb — ежедневный отчёт",
    "",
    `🕘 Период: ${formatDateTime(from)} — ${formatDateTime(to)}`,
    "",
    "📈 Трафик",
    `• Просмотры: ${viewsTotal} (${formatDelta(viewsTotal - previousViewsTotal)})`,
    `• Посетители: ${uniqueTotal} (${formatDelta(uniqueTotal - previousUniqueTotal)})`,
    `• Языки: ${localeLines}`,
    "",
    "🎯 Заявки",
    `• Новые заявки: ${leadsTotal} (${formatDelta(leadsTotal - previousLeadsTotal)})`,
    `• Открытые заявки всего: ${leadsNew}`,
    `• Ориентировочная конверсия посетитель → заявка: ${formatConversion(leadsTotal, uniqueTotal)}`,
    "",
    ...ga4DailyLines(ga4),
    "",
    "🤖 AI-поиск и ассистенты",
    ...aiBotLines,
    ...aiReferralLines,
    ...aiPathLines,
    "",
    "🏆 Топ-страницы",
    ...topPathLines,
    "",
    "🔗 Источники трафика",
    ...sourceLines,
    "",
    "🌐 Топ внешних сайтов",
    ...externalLines,
    "",
    `⚙️ Админка: ${siteUrl()}/admin`,
  ].join("\n");
}

export async function buildWeeklySiteReport(now = new Date()): Promise<string> {
  const to = now;
  const from = new Date(to.getTime() - MS_IN_WEEK);
  const previousFrom = new Date(from.getTime() - MS_IN_WEEK);
  const previousTo = from;
  const leadWindow = { createdAt: { gte: from, lt: to } };
  const previousLeadWindow = { createdAt: { gte: previousFrom, lt: previousTo } };

  const [
    viewsTotal,
    previousViewsTotal,
    uniqueTotal,
    previousUniqueTotal,
    leadsTotal,
    previousLeadsTotal,
    leadsNew,
    topPaths,
    localeRows,
    aiTraffic,
    referrers,
    ga4,
  ] = await Promise.all([
    countRealPageViews(from, to),
    countRealPageViews(previousFrom, previousTo),
    countRealUniqueVisitors(from, to),
    countRealUniqueVisitors(previousFrom, previousTo),
    prisma.lead.count({ where: leadWindow }),
    prisma.lead.count({ where: previousLeadWindow }),
    prisma.lead.count({ where: { status: "NEW" } }),
    queryTopRealPages(from, to, 8),
    queryRealPageLocales(from, to),
    loadAiTraffic(from, to, previousFrom, previousTo),
    loadReferrerBreakdown(from, to, previousFrom, previousTo),
    fetchGa4Snapshot("weekly"),
  ]);

  const topPathLines =
    topPaths.length > 0
      ? topPaths.map((item, index) => `${index + 1}. ${item.path || "/"} — ${Number(item.count ?? 0)}`)
      : ["• За неделю не было просмотров страниц."];
  const localeLines =
    localeRows.length > 0
      ? localeRows.map((item) => `${item.locale || "-"} — ${Number(item.count ?? 0)}`).join(", ")
      : "-";
  const aiBotDelta = formatDelta(aiTraffic.botTotal - aiTraffic.previousBotTotal);
  const aiBotLines = aiTraffic.botTrackingUnavailable
    ? ["• Мониторинг AI-ботов ожидает применения таблицы в БД."]
    : [
        `• AI-боты / краулеры: ${aiTraffic.botTotal} (${aiBotDelta})`,
        ...topCountLines(aiTraffic.botCounts, "AI-боты за неделю не замечены."),
      ];
  const aiWeekTrend = formatPercentDelta(aiTraffic.referralTotal, aiTraffic.previousReferralTotal);
  const sourceLines = [
    `• Прямые заходы: ${referrers.directTotal} (${formatPercentDelta(referrers.directTotal, referrers.previousDirectTotal)})`,
    `• Поисковики: ${referrers.searchTotal} (${formatPercentDelta(referrers.searchTotal, referrers.previousSearchTotal)})`,
    ...topDeltaLines(referrers.searchCounts, "Переходов из поисковиков не было."),
    `• AI-ассистенты: ${aiTraffic.referralTotal} (${aiWeekTrend})`,
    `• Другие сайты: ${referrers.externalTotal} (${formatPercentDelta(referrers.externalTotal, referrers.previousExternalTotal)})`,
  ];
  const externalLines = topDeltaLines(referrers.externalCounts, "Переходов с других сайтов не было.");

  return [
    "📅 SaaleWeb — недельный отчёт",
    "",
    `🕘 Период: ${formatDateTime(from)} — ${formatDateTime(to)}`,
    "",
    "📈 Трафик",
    `• Просмотры: ${viewsTotal} (${formatDelta(viewsTotal - previousViewsTotal)})`,
    // visitorHash intentionally rotates daily, so this is not a cross-week person count.
    `• Дневные уникальные посетители: ${uniqueTotal} (${formatDelta(uniqueTotal - previousUniqueTotal)})`,
    `• Языки: ${localeLines}`,
    "",
    "🎯 Заявки",
    `• Новые заявки: ${leadsTotal} (${formatDelta(leadsTotal - previousLeadsTotal)})`,
    `• Открытые заявки всего: ${leadsNew}`,
    `• Ориентировочная конверсия дневных уникальных посещений → заявка: ${formatConversion(leadsTotal, uniqueTotal)}`,
    "",
    ...ga4WeeklyLines(ga4),
    "",
    "🤖 AI-поиск и ассистенты",
    ...aiBotLines,
    `• AI Traffic: ${aiTraffic.referralTotal} переходов (${aiWeekTrend} за неделю)`,
    ...topDeltaLines(aiTraffic.referralCounts, "Переходов из AI-ассистентов не было."),
    "",
    "🏆 Топ-страницы недели",
    ...topPathLines,
    "",
    "🔗 Источники недели",
    ...sourceLines,
    "",
    "🌐 Топ внешних сайтов недели",
    ...externalLines,
    "",
    `⚙️ Админка: ${siteUrl()}/admin`,
  ].join("\n");
}

async function loadAiRecentVisits(from: Date, to: Date) {
  try {
    return await prisma.aiBotVisit.findMany({
      where: { createdAt: { gte: from, lt: to } },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        bot: true,
        path: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.warn("[telegram-report] AI recent visits query skipped.", {
      message: error instanceof Error ? error.message : "Unknown AI recent visits error",
    });
    return [];
  }
}

function aiInterpretation(ai24h: AiTrafficSummary, ai7d: AiTrafficSummary): string[] {
  const lines: string[] = [];

  if (ai24h.botTrackingUnavailable || ai7d.botTrackingUnavailable) {
    return ["• Мониторинг AI-ботов пока недоступен: проверь таблицу AiBotVisit в БД."];
  }

  if (ai7d.botTotal === 0 && ai7d.referralTotal === 0) {
    lines.push("• За 7 дней AI-краулеры и переходы из AI-ассистентов не зафиксированы.");
    lines.push("• Это нормально для молодого AI-мониторинга: данные появятся после реальных обходов сайта.");
    return lines;
  }

  if (ai7d.botTotal > 0) {
    lines.push("• AI-системы уже видят сайт: важно держать llms.txt, sitemap, FAQ и структурированные страницы в порядке.");
  }

  if (ai7d.referralTotal > 0) {
    const trend = ai7d.referralTotal - ai7d.previousReferralTotal;
    if (ai7d.previousReferralTotal > 0 && trend > 0) {
      lines.push(
        `• AI-трафик растёт: ${formatPercentDelta(ai7d.referralTotal, ai7d.previousReferralTotal)} за неделю — усиливай страницы, которые AI уже приводит.`,
      );
    } else if (ai7d.previousReferralTotal > 0 && trend < 0) {
      lines.push(
        `• AI-трафик просел (${formatPercentDelta(ai7d.referralTotal, ai7d.previousReferralTotal)} за неделю): проверь свежесть FAQ и структурированных данных на страницах-донорах.`,
      );
    } else {
      lines.push("• Есть переходы из AI-ассистентов: стоит усилить страницы, которые они уже приводят.");
    }
    const leader = ai7d.referralCounts[0];
    if (leader) {
      lines.push(`• Лидер AI-переходов: ${leader.label} (${leader.count} за 7 дней).`);
    }
  } else {
    lines.push("• Переходов из AI-ассистентов пока нет: сейчас видимость больше на уровне краулинга, не кликов.");
  }

  return lines;
}

function isSeoOpportunityPath(path?: string | null): boolean {
  if (!path) return false;
  if (path === "/" || path === "/en" || path === "/ru") return false;
  if (path.includes("/kontakt") || path.includes("/contact")) return false;
  if (path.includes("/admin") || path.includes("/newsletter")) return false;
  if (path.endsWith(".xml") || path.endsWith(".txt")) return false;
  return true;
}

function pathTopic(path?: string | null): string {
  if (!path) return "общая страница";
  if (path.includes("blog")) return "контент / blog";
  if (path.includes("leistungen") || path.includes("services") || path.includes("uslugi")) return "услуги";
  if (path.includes("branchen") || path.includes("industries") || path.includes("otrasli")) return "отрасли";
  if (path.includes("standorte") || path.includes("locations") || path.includes("goroda")) return "локальное SEO";
  if (path.includes("projekte") || path.includes("projects") || path.includes("proekty")) return "проекты / кейсы";
  if (path.includes("preise") || path.includes("pricing") || path.includes("ceny")) return "цены";
  return "общая страница";
}

export async function buildAiSearchReport(now = new Date()): Promise<string> {
  const to = now;
  const from24h = new Date(to.getTime() - MS_IN_DAY);
  const previous24hFrom = new Date(from24h.getTime() - MS_IN_DAY);
  const from7d = new Date(to.getTime() - MS_IN_WEEK);
  const previous7dFrom = new Date(from7d.getTime() - MS_IN_WEEK);

  const [ai24h, ai7d, recentVisits] = await Promise.all([
    loadAiTraffic(from24h, to, previous24hFrom, from24h),
    loadAiTraffic(from7d, to, previous7dFrom, from7d),
    loadAiRecentVisits(from7d, to),
  ]);

  const recentLines =
    recentVisits.length > 0
      ? recentVisits.map(
          (visit, index) =>
            `${index + 1}. ${visit.bot} — ${visit.path || "/"} (${formatDateTime(visit.createdAt)})`,
        )
      : ["• За 7 дней последних AI-визитов нет."];
  const ai24hDelta = formatDelta(ai24h.botTotal - ai24h.previousBotTotal);
  const ai7dDelta = formatDelta(ai7d.botTotal - ai7d.previousBotTotal);

  return [
    "🤖 SaaleWeb — AI-отчёт",
    "",
    `🕘 24 часа: ${formatDateTime(from24h)} — ${formatDateTime(to)}`,
    `🗓 7 дней: ${formatDateTime(from7d)} — ${formatDateTime(to)}`,
    "",
    "📡 AI-краулеры",
    `• За 24 часа: ${ai24h.botTotal} (${ai24hDelta})`,
    ...topCountLines(ai24h.botCounts, "AI-боты за 24 часа не замечены."),
    "",
    `• За 7 дней: ${ai7d.botTotal} (${ai7dDelta})`,
    ...topCountLines(ai7d.botCounts, "AI-боты за 7 дней не замечены."),
    "",
    "🧭 Страницы, которые смотрели AI-боты",
    ...topCountLines(ai7d.botPaths, "Пока нет данных по страницам."),
    "",
    "🔗 Переходы из AI-ассистентов",
    `• За 24 часа: ${ai24h.referralTotal} (${formatPercentDelta(ai24h.referralTotal, ai24h.previousReferralTotal)} к прошлым 24 ч)`,
    ...topDeltaLines(ai24h.referralCounts, "Переходов из AI-ассистентов за 24 часа не было."),
    "",
    `• AI Traffic за 7 дней: ${ai7d.referralTotal} (${formatPercentDelta(ai7d.referralTotal, ai7d.previousReferralTotal)} за неделю)`,
    ...topDeltaLines(ai7d.referralCounts, "Переходов из AI-ассистентов за 7 дней не было."),
    "",
    "🧾 Последние AI-визиты",
    ...recentLines,
    "",
    "📌 Вывод",
    ...aiInterpretation(ai24h, ai7d),
    "",
    `⚙️ Админка: ${siteUrl()}/admin`,
  ].join("\n");
}

export async function buildTopPagesReport(now = new Date()): Promise<string> {
  const to = now;
  const from24h = new Date(to.getTime() - MS_IN_DAY);
  const from7d = new Date(to.getTime() - MS_IN_WEEK);

  const [top24h, top7d, referrers7d, locales7d, aiPaths7d] = await Promise.all([
    queryTopRealPages(from24h, to, 8),
    queryTopRealPages(from7d, to, 12),
    queryTopRealReferrers(from7d, to, 8),
    queryRealPageLocales(from7d, to),
    prisma.$queryRaw<PathCountRow[]>`SELECT path, count(*)::int AS count FROM "AiBotVisit" WHERE "createdAt" >= ${from7d} AND "createdAt" < ${to} GROUP BY path ORDER BY count DESC LIMIT 8`.catch(() => []),
  ]);

  const top24hLines = topCountLines(
    top24h.map((row) => ({ label: row.path || "/", count: Number(row.count ?? 0) })),
    "За 24 часа нет просмотров страниц.",
  );
  const top7dLines = topCountLines(
    top7d.map((row) => ({ label: row.path || "/", count: Number(row.count ?? 0) })),
    "За 7 дней нет просмотров страниц.",
  );
  const referrerLines = topCountLines(
    referrers7d.map((row) => ({ label: row.path || "Прямой заход", count: Number(row.count ?? 0) })),
    "Источники не определены.",
  );
  const localeLines =
    locales7d.length > 0
      ? locales7d.map((row) => `${row.locale || "-"} — ${Number(row.count ?? 0)}`).join(", ")
      : "-";
  const aiPathLines = topCountLines(
    aiPaths7d.map((row) => ({ label: row.path || "/", count: Number(row.count ?? 0) })),
    "AI-боты пока не выделили конкретные страницы.",
  );
  const opportunityLines = top7d
    .filter((row) => isSeoOpportunityPath(row.path))
    .slice(0, 5)
    .map((row, index) => `${index + 1}. ${row.path} — ${pathTopic(row.path)}, ${Number(row.count ?? 0)} просмотров`);

  return [
    "🏆 SaaleWeb — топ-страницы и возможности",
    "",
    `🕘 24 часа: ${formatDateTime(from24h)} — ${formatDateTime(to)}`,
    `🗓 7 дней: ${formatDateTime(from7d)} — ${formatDateTime(to)}`,
    "",
    "🔥 Топ страниц за 24 часа",
    ...top24hLines,
    "",
    "📈 Топ страниц за 7 дней",
    ...top7dLines,
    "",
    "🔗 Источники за 7 дней",
    ...referrerLines,
    "",
    "🌐 Языки за 7 дней",
    `• ${localeLines}`,
    "",
    "🤖 AI-интерес за 7 дней",
    ...aiPathLines,
    "",
    "🚀 Страницы для усиления SEO/GEO/AIO",
    ...(opportunityLines.length > 0
      ? opportunityLines
      : ["• Пока нет отдельной страницы с достаточным трафиком для явного SEO-усиления."]),
    "",
    "📌 Как читать отчёт",
    "• Топ-страницы показывают фактический спрос.",
    "• Страницы с трафиком стоит усиливать FAQ, кейсами, внутренними ссылками и понятными CTA.",
    "• AI-интерес показывает, какие страницы уже полезны для AI-поиска и краулеров.",
    "",
    `⚙️ Админка: ${siteUrl()}/admin`,
  ].join("\n");
}

export async function buildLeadsReport(now = new Date()): Promise<string> {
  const to = now;
  const from24h = new Date(to.getTime() - MS_IN_DAY);
  const previous24hFrom = new Date(from24h.getTime() - MS_IN_DAY);
  const from7d = new Date(to.getTime() - MS_IN_WEEK);

  const [
    leads24h,
    previousLeads24h,
    leads7d,
    openLeads,
    statusRows,
    sourceRows7d,
    localeRows7d,
    recentLeads,
  ] = await Promise.all([
    prisma.lead.count({ where: { createdAt: { gte: from24h, lt: to } } }),
    prisma.lead.count({ where: { createdAt: { gte: previous24hFrom, lt: from24h } } }),
    prisma.lead.count({ where: { createdAt: { gte: from7d, lt: to } } }),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.$queryRaw<StatusCountRow[]>`SELECT status, count(*)::int AS count FROM "Lead" GROUP BY status ORDER BY count DESC`,
    prisma.$queryRaw<PathCountRow[]>`SELECT COALESCE(NULLIF(source, ''), 'unknown') AS path, count(*)::int AS count FROM "Lead" WHERE "createdAt" >= ${from7d} AND "createdAt" < ${to} GROUP BY 1 ORDER BY count DESC LIMIT 8`,
    prisma.$queryRaw<LocaleCountRow[]>`SELECT locale, count(*)::int AS count FROM "Lead" WHERE "createdAt" >= ${from7d} AND "createdAt" < ${to} GROUP BY locale ORDER BY count DESC`,
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        createdAt: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        message: true,
        source: true,
        status: true,
        locale: true,
      },
    }),
  ]);

  const statusLines = topCountLines(
    statusRows.map((row) => ({ label: leadStatusLabel(row.status), count: Number(row.count ?? 0) })),
    "Заявок пока нет.",
  );
  const sourceLines = topCountLines(
    sourceRows7d.map((row) => ({ label: sourceLabel(row.path), count: Number(row.count ?? 0) })),
    "За 7 дней источники заявок не найдены.",
  );
  const localeLines =
    localeRows7d.length > 0
      ? localeRows7d.map((row) => `${row.locale || "-"} — ${Number(row.count ?? 0)}`).join(", ")
      : "-";
  const recentLeadLines =
    recentLeads.length > 0
      ? recentLeads.flatMap((lead, index) => [
          `${index + 1}. ${formatDateTime(lead.createdAt)} — ${lead.name}${lead.company ? ` / ${lead.company}` : ""}`,
          `   • статус: ${leadStatusLabel(lead.status)}, источник: ${sourceLabel(lead.source)}, язык: ${localeLabel(lead.locale)}`,
          `   • email: ${lead.email || "-"}${lead.phone ? `, телефон: ${lead.phone}` : ""}`,
          `   • сообщение: ${trimText(lead.message)}`,
        ])
      : ["• Последних заявок пока нет."];

  return [
    "🎯 SaaleWeb — отчёт по заявкам",
    "",
    `🕘 24 часа: ${formatDateTime(from24h)} — ${formatDateTime(to)}`,
    `🗓 7 дней: ${formatDateTime(from7d)} — ${formatDateTime(to)}`,
    "",
    "📌 Сводка",
    `• Новые заявки за 24 часа: ${leads24h} (${formatDelta(leads24h - previousLeads24h)})`,
    `• Заявки за 7 дней: ${leads7d}`,
    `• Открытые новые заявки всего: ${openLeads}`,
    `• Языки за 7 дней: ${localeLines}`,
    "",
    "🧭 Статусы",
    ...statusLines,
    "",
    "📥 Источники заявок за 7 дней",
    ...sourceLines,
    "",
    "🧾 Последние заявки",
    ...recentLeadLines,
    "",
    "📌 Что делать",
    "• Если есть открытые заявки — ответить в течение 24 часов.",
    "• Если один источник стабильно даёт заявки — усилить эту страницу CTA, FAQ и кейсами.",
    "• Если заявок нет, смотреть /top и усиливать страницы с фактическим спросом.",
    "",
    `⚙️ Админка: ${siteUrl()}/admin/leads`,
  ].join("\n");
}

export async function sendDailySiteReport(): Promise<boolean> {
  const report = await buildDailySiteReport();
  return sendTelegramAdminMessage(report);
}
