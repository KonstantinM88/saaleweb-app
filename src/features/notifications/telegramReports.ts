import "server-only";

import { detectAiReferrer } from "@/features/analytics/aiTraffic";
import { prisma } from "@/lib/prisma";
import type { LeadNotification } from "./mailer";
import { sendTelegramAdminMessage } from "./telegram";

type CountRow = { count: number | bigint | null };
type PathCountRow = { path: string | null; count: number | bigint | null };
type LocaleCountRow = { locale: string | null; count: number | bigint | null };
type LabelCount = { label: string; count: number };
type AiTrafficSummary = {
  botTotal: number;
  previousBotTotal: number;
  botCounts: LabelCount[];
  botPaths: LabelCount[];
  botTrackingUnavailable: boolean;
  referralTotal: number;
  referralCounts: LabelCount[];
};

const MS_IN_DAY = 24 * 60 * 60 * 1000;

function countValue(rows: CountRow[]): number {
  return Number(rows[0]?.count ?? 0);
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

function sourceLabel(source?: string | null): string {
  const labels: Record<string, string> = {
    contact_page: "страница контактов",
    homepage_contact: "форма на главной",
    website_audit: "аудит сайта",
  };
  return source ? labels[source] ?? source : "-";
}

function localeLabel(locale?: string | null): string {
  if (locale === "de") return "немецкий";
  if (locale === "en") return "английский";
  if (locale === "ru") return "русский";
  return locale || "-";
}

function line(label: string, value?: string | null): string | undefined {
  const clean = value?.trim();
  return clean ? `${label}: ${clean}` : undefined;
}

function topCountLines(items: LabelCount[], emptyText: string): string[] {
  if (items.length === 0) return [`• ${emptyText}`];
  return items.map((item, index) => `${index + 1}. ${item.label} — ${item.count}`);
}

function aggregateLabelCounts(rows: PathCountRow[], detector: (value?: string | null) => string | null): LabelCount[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    const label = detector(row.path);
    if (!label) continue;
    map.set(label, (map.get(label) ?? 0) + Number(row.count ?? 0));
  }

  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
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

async function loadAiReferralTraffic(from: Date, to: Date) {
  try {
    const rows =
      await prisma.$queryRaw<PathCountRow[]>`SELECT referrer AS path, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND referrer IS NOT NULL GROUP BY referrer ORDER BY count DESC LIMIT 50`;
    const referralCounts = aggregateLabelCounts(rows, detectAiReferrer);
    return {
      referralTotal: referralCounts.reduce((sum, item) => sum + item.count, 0),
      referralCounts,
    };
  } catch (error) {
    console.warn("[telegram-report] AI referral query skipped.", {
      message: error instanceof Error ? error.message : "Unknown AI referral analytics error",
    });
    return {
      referralTotal: 0,
      referralCounts: [],
    };
  }
}

async function loadAiTraffic(from: Date, to: Date, previousFrom: Date, previousTo: Date): Promise<AiTrafficSummary> {
  const [botTraffic, referralTraffic] = await Promise.all([
    loadAiBotTraffic(from, to, previousFrom, previousTo),
    loadAiReferralTraffic(from, to),
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

export async function buildDailySiteReport(now = new Date()): Promise<string> {
  const to = now;
  const from = new Date(to.getTime() - MS_IN_DAY);
  const previousFrom = new Date(from.getTime() - MS_IN_DAY);
  const previousTo = from;
  const whereWindow = { createdAt: { gte: from, lt: to } };
  const previousWhereWindow = { createdAt: { gte: previousFrom, lt: previousTo } };

  const [
    viewsTotal,
    previousViewsTotal,
    uniqueRows,
    previousUniqueRows,
    leadsTotal,
    previousLeadsTotal,
    leadsNew,
    topPaths,
    topReferrers,
    localeRows,
    aiTraffic,
  ] = await Promise.all([
    prisma.pageView.count({ where: whereWindow }),
    prisma.pageView.count({ where: previousWhereWindow }),
    prisma.$queryRaw<CountRow[]>`SELECT count(DISTINCT "visitorHash")::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND "visitorHash" IS NOT NULL`,
    prisma.$queryRaw<CountRow[]>`SELECT count(DISTINCT "visitorHash")::int AS count FROM "PageView" WHERE "createdAt" >= ${previousFrom} AND "createdAt" < ${previousTo} AND "visitorHash" IS NOT NULL`,
    prisma.lead.count({ where: whereWindow }),
    prisma.lead.count({ where: previousWhereWindow }),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.$queryRaw<PathCountRow[]>`SELECT path, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} GROUP BY path ORDER BY count DESC LIMIT 5`,
    prisma.$queryRaw<PathCountRow[]>`SELECT COALESCE(NULLIF(referrer, ''), 'Прямой заход') AS path, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} GROUP BY 1 ORDER BY count DESC LIMIT 5`,
    prisma.$queryRaw<LocaleCountRow[]>`SELECT locale, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} GROUP BY locale ORDER BY count DESC`,
    loadAiTraffic(from, to, previousFrom, previousTo),
  ]);

  const uniqueTotal = countValue(uniqueRows);
  const previousUniqueTotal = countValue(previousUniqueRows);
  const topPathLines =
    topPaths.length > 0
      ? topPaths.map((item, index) => `${index + 1}. ${item.path || "/"} — ${Number(item.count ?? 0)}`)
      : ["• За период не было просмотров страниц."];
  const referrerLines =
    topReferrers.length > 0
      ? topReferrers.map((item, index) => `${index + 1}. ${item.path || "Прямой заход"} — ${Number(item.count ?? 0)}`)
      : ["• Источники не определены."];
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
    `• Переходы из AI-ассистентов: ${aiTraffic.referralTotal}`,
    ...topCountLines(aiTraffic.referralCounts, "Переходов из ChatGPT, Claude, Perplexity, Gemini или Copilot не было."),
  ];
  const aiPathLines = aiTraffic.botTrackingUnavailable
    ? []
    : ["", "🧭 Страницы, которые смотрели AI-боты:", ...topCountLines(aiTraffic.botPaths, "Пока нет данных по страницам.")];

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
    "",
    "🤖 AI-поиск и ассистенты",
    ...aiBotLines,
    ...aiReferralLines,
    ...aiPathLines,
    "",
    "🏆 Топ-страницы",
    ...topPathLines,
    "",
    "🔗 Источники",
    ...referrerLines,
    "",
    `⚙️ Админка: ${siteUrl()}/admin`,
  ].join("\n");
}

export async function sendDailySiteReport(): Promise<boolean> {
  const report = await buildDailySiteReport();
  return sendTelegramAdminMessage(report);
}
