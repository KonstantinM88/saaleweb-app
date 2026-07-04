import "server-only";

import { detectAiReferrer } from "@/features/analytics/aiTraffic";
import { prisma } from "@/lib/prisma";
import type { LeadNotification } from "./mailer";
import { sendTelegramAdminMessage } from "./telegram";

type CountRow = { count: number | bigint | null };
type PathCountRow = { path: string | null; count: number | bigint | null };
type LocaleCountRow = { locale: string | null; count: number | bigint | null };
type StatusCountRow = { status: string | null; count: number | bigint | null };
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
const MS_IN_WEEK = 7 * MS_IN_DAY;

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

export async function buildWeeklySiteReport(now = new Date()): Promise<string> {
  const to = now;
  const from = new Date(to.getTime() - MS_IN_WEEK);
  const previousFrom = new Date(from.getTime() - MS_IN_WEEK);
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
    prisma.$queryRaw<PathCountRow[]>`SELECT path, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} GROUP BY path ORDER BY count DESC LIMIT 8`,
    prisma.$queryRaw<PathCountRow[]>`SELECT COALESCE(NULLIF(referrer, ''), 'Прямой заход') AS path, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} GROUP BY 1 ORDER BY count DESC LIMIT 6`,
    prisma.$queryRaw<LocaleCountRow[]>`SELECT locale, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} GROUP BY locale ORDER BY count DESC`,
    loadAiTraffic(from, to, previousFrom, previousTo),
  ]);

  const uniqueTotal = countValue(uniqueRows);
  const previousUniqueTotal = countValue(previousUniqueRows);
  const topPathLines =
    topPaths.length > 0
      ? topPaths.map((item, index) => `${index + 1}. ${item.path || "/"} — ${Number(item.count ?? 0)}`)
      : ["• За неделю не было просмотров страниц."];
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
        ...topCountLines(aiTraffic.botCounts, "AI-боты за неделю не замечены."),
      ];

  return [
    "📅 SaaleWeb — недельный отчёт",
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
    `• Переходы из AI-ассистентов: ${aiTraffic.referralTotal}`,
    ...topCountLines(aiTraffic.referralCounts, "Переходов из AI-ассистентов не было."),
    "",
    "🏆 Топ-страницы недели",
    ...topPathLines,
    "",
    "🔗 Источники недели",
    ...referrerLines,
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
    lines.push("• Есть переходы из AI-ассистентов: стоит усилить страницы, которые они уже приводят.");
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
    `• За 24 часа: ${ai24h.referralTotal}`,
    ...topCountLines(ai24h.referralCounts, "Переходов из AI-ассистентов за 24 часа не было."),
    "",
    `• За 7 дней: ${ai7d.referralTotal}`,
    ...topCountLines(ai7d.referralCounts, "Переходов из AI-ассистентов за 7 дней не было."),
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
    prisma.$queryRaw<PathCountRow[]>`SELECT path, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from24h} AND "createdAt" < ${to} GROUP BY path ORDER BY count DESC LIMIT 8`,
    prisma.$queryRaw<PathCountRow[]>`SELECT path, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from7d} AND "createdAt" < ${to} GROUP BY path ORDER BY count DESC LIMIT 12`,
    prisma.$queryRaw<PathCountRow[]>`SELECT COALESCE(NULLIF(referrer, ''), 'Прямой заход') AS path, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from7d} AND "createdAt" < ${to} GROUP BY 1 ORDER BY count DESC LIMIT 8`,
    prisma.$queryRaw<LocaleCountRow[]>`SELECT locale, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from7d} AND "createdAt" < ${to} GROUP BY locale ORDER BY count DESC`,
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
          `   • email: ${lead.email}${lead.phone ? `, телефон: ${lead.phone}` : ""}`,
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
