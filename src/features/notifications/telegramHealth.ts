import "server-only";

import { prisma } from "@/lib/prisma";
import {
  configuredMailProvider,
  defaultFromAddress,
  resolveMailProvider,
} from "./transport";
import { sendTelegramAdminMessage, telegramDiagnostics } from "./telegram";

type HealthStatus = "ok" | "warn" | "fail";
type HealthAlertThreshold = "warn" | "fail";

type HealthCheck = {
  label: string;
  status: HealthStatus;
  detail: string;
};

type PublicRouteCheck = {
  path: string;
  status: HealthStatus;
  httpStatus?: number;
  ms?: number;
};

type HealthSnapshot = {
  checkedAt: string;
  serviceChecks: HealthCheck[];
  routeChecks: PublicRouteCheck[];
  failedCount: number;
  warnCount: number;
  overall: HealthStatus;
};

export type HealthAlertResult = {
  sent: boolean;
  alertNeeded: boolean;
  overall: HealthStatus;
  failedCount: number;
  warnCount: number;
  skippedReason?: "healthy" | "cooldown" | "send_failed";
};

let lastHealthAlert: { key: string; sentAt: number } | undefined;

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://saaleweb.de").replace(/\/+$/, "");
}

function icon(status: HealthStatus): string {
  if (status === "ok") return "✅";
  if (status === "warn") return "⚠️";
  return "🚨";
}

function statusLabel(status: HealthStatus): string {
  if (status === "ok") return "OK";
  if (status === "warn") return "Внимание";
  return "Проблема";
}

function statusRank(status: HealthStatus): number {
  if (status === "fail") return 2;
  if (status === "warn") return 1;
  return 0;
}

function hasEnv(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

function recipient(): string | undefined {
  return process.env.LEAD_NOTIFY_TO || process.env.ADMIN_EMAIL || process.env.SMTP_USER;
}

async function checkDatabase(): Promise<HealthCheck> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { label: "База данных", status: "ok", detail: "соединение работает" };
  } catch (error) {
    return {
      label: "База данных",
      status: "fail",
      detail: error instanceof Error ? error.message : "ошибка соединения",
    };
  }
}

function checkMail(): HealthCheck {
  const configuredProvider = configuredMailProvider();
  const provider = resolveMailProvider(configuredProvider);
  const from = defaultFromAddress(configuredProvider);
  const to = recipient();
  const providerReady =
    provider === "resend"
      ? hasEnv("RESEND_API_KEY") && Boolean(from)
      : hasEnv("SMTP_HOST") && hasEnv("SMTP_USER") && hasEnv("SMTP_PASSWORD") && Boolean(from);

  if (providerReady && to) {
    return {
      label: "Почта",
      status: "ok",
      detail: `${provider}, получатель настроен`,
    };
  }

  return {
    label: "Почта",
    status: "warn",
    detail: `${provider}, ${providerReady ? "нет получателя" : "неполная конфигурация"}`,
  };
}

function checkTelegram(): HealthCheck {
  const diagnostics = telegramDiagnostics();
  if (diagnostics.hasBotToken && diagnostics.hasAdminChatId && diagnostics.hasWebhookSecret) {
    return {
      label: "Telegram",
      status: "ok",
      detail: `бот, webhook secret и ${diagnostics.adminChatCount} chat id настроены`,
    };
  }

  return {
    label: "Telegram",
    status: "warn",
    detail: `bot=${diagnostics.hasBotToken ? "да" : "нет"}, chat=${diagnostics.hasAdminChatId ? "да" : "нет"}, webhook=${diagnostics.hasWebhookSecret ? "да" : "нет"}`,
  };
}

async function checkPublicRoute(path: string): Promise<PublicRouteCheck> {
  const startedAt = Date.now();
  try {
    const response = await fetch(`${siteUrl()}${path}`, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const ms = Date.now() - startedAt;
    return {
      path,
      httpStatus: response.status,
      ms,
      status: response.ok ? "ok" : response.status >= 500 ? "fail" : "warn",
    };
  } catch {
    return {
      path,
      status: "fail",
      ms: Date.now() - startedAt,
    };
  }
}

async function loadCounters(): Promise<HealthCheck[]> {
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const since1h = new Date(Date.now() - 60 * 60 * 1000);

  try {
    const [views1h, leads24h, ai24h, openLeads] = await Promise.all([
      prisma.pageView.count({ where: { createdAt: { gte: since1h } } }),
      prisma.lead.count({ where: { createdAt: { gte: since24h } } }),
      prisma.aiBotVisit.count({ where: { createdAt: { gte: since24h } } }).catch(() => null),
      prisma.lead.count({ where: { status: "NEW" } }),
    ]);

    return [
      { label: "Просмотры за 1 час", status: "ok", detail: String(views1h) },
      { label: "Заявки за 24 часа", status: "ok", detail: String(leads24h) },
      { label: "Открытые заявки", status: openLeads > 10 ? "warn" : "ok", detail: String(openLeads) },
      {
        label: "AI-визиты за 24 часа",
        status: ai24h === null ? "warn" : "ok",
        detail: ai24h === null ? "таблица AI ещё не доступна" : String(ai24h),
      },
    ];
  } catch (error) {
    return [
      {
        label: "Счётчики",
        status: "warn",
        detail: error instanceof Error ? error.message : "не удалось получить метрики",
      },
    ];
  }
}

function formatCheckedAt(date = new Date()): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: process.env.TELEGRAM_REPORT_TIMEZONE || "Europe/Berlin",
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
}

async function buildHealthSnapshot(): Promise<HealthSnapshot> {
  const checkedAt = formatCheckedAt();
  const routeChecks = await Promise.all([
    checkPublicRoute("/"),
    checkPublicRoute("/kontakt"),
    checkPublicRoute("/preise"),
    checkPublicRoute("/leistungen"),
    checkPublicRoute("/branchen"),
    checkPublicRoute("/projekte"),
    checkPublicRoute("/llms.txt"),
    checkPublicRoute("/sitemap.xml"),
    checkPublicRoute("/robots.txt"),
  ]);
  const serviceChecks = [await checkDatabase(), checkMail(), checkTelegram(), ...(await loadCounters())];
  const failedCount =
    serviceChecks.filter((check) => check.status === "fail").length +
    routeChecks.filter((check) => check.status === "fail").length;
  const warnCount =
    serviceChecks.filter((check) => check.status === "warn").length +
    routeChecks.filter((check) => check.status === "warn").length;
  const overall: HealthStatus = failedCount > 0 ? "fail" : warnCount > 0 ? "warn" : "ok";

  return {
    checkedAt,
    serviceChecks,
    routeChecks,
    failedCount,
    warnCount,
    overall,
  };
}

function formatFullHealthReport(snapshot: HealthSnapshot): string {
  return [
    `${icon(snapshot.overall)} SaaleWeb — Health Check`,
    "",
    `🕘 Проверка: ${snapshot.checkedAt}`,
    `📌 Статус: ${statusLabel(snapshot.overall)}`,
    "",
    "🧩 Сервисы",
    ...snapshot.serviceChecks.map((check) => `${icon(check.status)} ${check.label}: ${check.detail}`),
    "",
    "🌍 Публичные URL",
    ...snapshot.routeChecks.map((check) => {
      const status = check.httpStatus ? `${check.httpStatus}` : "нет ответа";
      const timing = typeof check.ms === "number" ? `, ${check.ms} мс` : "";
      return `${icon(check.status)} ${check.path}: ${status}${timing}`;
    }),
    "",
    `⚙️ Админка: ${siteUrl()}/admin`,
  ].join("\n");
}

function alertCooldownMs(overrideMinutes?: number): number {
  const minutes = overrideMinutes ?? Number(process.env.TELEGRAM_HEALTH_ALERT_COOLDOWN_MINUTES || 60);
  if (!Number.isFinite(minutes) || minutes < 0) return 60 * 60 * 1000;
  return minutes * 60 * 1000;
}

function healthAlertKey(snapshot: HealthSnapshot, threshold: HealthAlertThreshold): string {
  const minimumRank = statusRank(threshold);
  const serviceIssues = snapshot.serviceChecks
    .filter((check) => statusRank(check.status) >= minimumRank)
    .map((check) => `${check.status}:${check.label}:${check.detail}`);
  const routeIssues = snapshot.routeChecks
    .filter((check) => statusRank(check.status) >= minimumRank)
    .map((check) => `${check.status}:${check.path}:${check.httpStatus || "no-response"}`);

  return [...serviceIssues, ...routeIssues].join("|") || snapshot.overall;
}

function formatHealthAlert(snapshot: HealthSnapshot, threshold: HealthAlertThreshold): string {
  const minimumRank = statusRank(threshold);
  const serviceIssues = snapshot.serviceChecks.filter((check) => statusRank(check.status) >= minimumRank);
  const routeIssues = snapshot.routeChecks.filter((check) => statusRank(check.status) >= minimumRank);
  const title =
    snapshot.overall === "fail"
      ? "🚨 SaaleWeb — проблема мониторинга"
      : snapshot.overall === "warn"
        ? "⚠️ SaaleWeb — предупреждение мониторинга"
        : "✅ SaaleWeb — сайт работает";

  const serviceLines =
    serviceIssues.length > 0
      ? serviceIssues.map((check) => `${icon(check.status)} ${check.label}: ${check.detail}`)
      : ["✅ Критических проблем в сервисах нет."];
  const routeLines =
    routeIssues.length > 0
      ? routeIssues.map((check) => {
          const status = check.httpStatus ? `${check.httpStatus}` : "нет ответа";
          const timing = typeof check.ms === "number" ? `, ${check.ms} мс` : "";
          return `${icon(check.status)} ${check.path}: ${status}${timing}`;
        })
      : ["✅ Критических проблем в публичных URL нет."];

  return [
    title,
    "",
    `🕘 Проверка: ${snapshot.checkedAt}`,
    `📌 Общий статус: ${statusLabel(snapshot.overall)}`,
    `🚨 Ошибки: ${snapshot.failedCount}`,
    `⚠️ Предупреждения: ${snapshot.warnCount}`,
    "",
    "🧩 Сервисы",
    ...serviceLines,
    "",
    "🌍 Публичные URL",
    ...routeLines,
    "",
    "📌 Что делать",
    "• Если упал публичный URL — проверить последний деплой и логи Hostinger.",
    "• Если проблема в БД — проверить DATABASE_URL и доступность PostgreSQL.",
    "• Если проблема в почте — проверить Resend/SMTP переменные и тест в админке.",
    "",
    `⚙️ Health: ${siteUrl()}/admin`,
  ].join("\n");
}

export async function buildHealthReport(): Promise<string> {
  return formatFullHealthReport(await buildHealthSnapshot());
}

export async function sendHealthAlertReport(options: {
  threshold?: HealthAlertThreshold;
  force?: boolean;
  cooldownMinutes?: number;
} = {}): Promise<HealthAlertResult> {
  const threshold = options.threshold || "fail";
  const snapshot = await buildHealthSnapshot();
  const alertNeeded = options.force || statusRank(snapshot.overall) >= statusRank(threshold);

  if (!alertNeeded) {
    return {
      sent: false,
      alertNeeded: false,
      overall: snapshot.overall,
      failedCount: snapshot.failedCount,
      warnCount: snapshot.warnCount,
      skippedReason: "healthy",
    };
  }

  const key = healthAlertKey(snapshot, threshold);
  const cooldownMs = alertCooldownMs(options.cooldownMinutes);
  const now = Date.now();
  if (!options.force && cooldownMs > 0 && lastHealthAlert?.key === key && now - lastHealthAlert.sentAt < cooldownMs) {
    return {
      sent: false,
      alertNeeded: true,
      overall: snapshot.overall,
      failedCount: snapshot.failedCount,
      warnCount: snapshot.warnCount,
      skippedReason: "cooldown",
    };
  }

  const sent = await sendTelegramAdminMessage(formatHealthAlert(snapshot, threshold));
  if (sent) {
    lastHealthAlert = { key, sentAt: now };
  }

  return {
    sent,
    alertNeeded: true,
    overall: snapshot.overall,
    failedCount: snapshot.failedCount,
    warnCount: snapshot.warnCount,
    skippedReason: sent ? undefined : "send_failed",
  };
}
