import "server-only";

import { prisma } from "@/lib/prisma";
import type { LeadNotification } from "./mailer";
import { sendTelegramAdminMessage } from "./telegram";

type CountRow = { count: number | bigint | null };
type PathCountRow = { path: string | null; count: number | bigint | null };
type LocaleCountRow = { locale: string | null; count: number | bigint | null };

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
    return new Intl.DateTimeFormat("de-DE", {
      timeZone,
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("de-DE", {
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
    contact_page: "Kontaktseite",
    homepage_contact: "Homepage Kontakt",
    website_audit: "Website-Audit",
  };
  return source ? labels[source] ?? source : "-";
}

function localeLabel(locale?: string | null): string {
  if (locale === "de") return "Deutsch";
  if (locale === "en") return "English";
  if (locale === "ru") return "Русский";
  return locale || "-";
}

function line(label: string, value?: string | null): string | undefined {
  const clean = value?.trim();
  return clean ? `${label}: ${clean}` : undefined;
}

export async function sendLeadTelegramNotification(lead: LeadNotification): Promise<boolean> {
  const adminUrl = `${siteUrl()}/admin/leads`;
  const message = [
    "🟣 Neue SaaleWeb Anfrage",
    "",
    line("Quelle", sourceLabel(lead.source)),
    line("Sprache", localeLabel(lead.locale)),
    line("Name", lead.name),
    line("E-Mail", lead.email),
    line("Telefon", lead.phone),
    line("Firma", lead.company),
    line("Projektart", lead.projectType),
    line("Budget", lead.budget),
    line("Website", lead.projectWebsite),
    "",
    "Nachricht:",
    lead.message?.trim() || "-",
    "",
    `Admin: ${adminUrl}`,
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
  ] = await Promise.all([
    prisma.pageView.count({ where: whereWindow }),
    prisma.pageView.count({ where: previousWhereWindow }),
    prisma.$queryRaw<CountRow[]>`SELECT count(DISTINCT "visitorHash")::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND "visitorHash" IS NOT NULL`,
    prisma.$queryRaw<CountRow[]>`SELECT count(DISTINCT "visitorHash")::int AS count FROM "PageView" WHERE "createdAt" >= ${previousFrom} AND "createdAt" < ${previousTo} AND "visitorHash" IS NOT NULL`,
    prisma.lead.count({ where: whereWindow }),
    prisma.lead.count({ where: previousWhereWindow }),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.$queryRaw<PathCountRow[]>`SELECT path, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} GROUP BY path ORDER BY count DESC LIMIT 5`,
    prisma.$queryRaw<PathCountRow[]>`SELECT COALESCE(NULLIF(referrer, ''), 'Direkt') AS path, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} GROUP BY 1 ORDER BY count DESC LIMIT 5`,
    prisma.$queryRaw<LocaleCountRow[]>`SELECT locale, count(*)::int AS count FROM "PageView" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} GROUP BY locale ORDER BY count DESC`,
  ]);

  const uniqueTotal = countValue(uniqueRows);
  const previousUniqueTotal = countValue(previousUniqueRows);
  const topPathLines =
    topPaths.length > 0
      ? topPaths.map((item, index) => `${index + 1}. ${item.path || "/"} — ${Number(item.count ?? 0)}`)
      : ["Keine Seitenaufrufe im Zeitraum."];
  const referrerLines =
    topReferrers.length > 0
      ? topReferrers.map((item, index) => `${index + 1}. ${item.path || "Direkt"} — ${Number(item.count ?? 0)}`)
      : ["Keine Referrer-Daten im Zeitraum."];
  const localeLines =
    localeRows.length > 0
      ? localeRows.map((item) => `${item.locale || "-"} — ${Number(item.count ?? 0)}`).join(", ")
      : "-";

  return [
    "📊 SaaleWeb Tagesreport",
    "",
    `Zeitraum: ${formatDateTime(from)} – ${formatDateTime(to)}`,
    "",
    `Aufrufe: ${viewsTotal} (${formatDelta(viewsTotal - previousViewsTotal)} zum vorherigen Zeitraum)`,
    `Besucher: ${uniqueTotal} (${formatDelta(uniqueTotal - previousUniqueTotal)})`,
    `Neue Anfragen: ${leadsTotal} (${formatDelta(leadsTotal - previousLeadsTotal)})`,
    `Offene Anfragen gesamt: ${leadsNew}`,
    `Sprachen: ${localeLines}`,
    "",
    "Top-Seiten:",
    ...topPathLines,
    "",
    "Quellen:",
    ...referrerLines,
    "",
    `Admin: ${siteUrl()}/admin`,
  ].join("\n");
}

export async function sendDailySiteReport(): Promise<boolean> {
  const report = await buildDailySiteReport();
  return sendTelegramAdminMessage(report);
}
