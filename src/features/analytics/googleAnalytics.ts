import "server-only";

import {
  getGoogleServiceAccountAccessToken,
  GoogleServiceAccountError,
  hasGoogleServiceAccountCredentials,
} from "@/features/google/serviceAccount";

const GA4_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const GA4_API_ROOT = "https://analyticsdata.googleapis.com/v1beta";
const GA4_TIMEOUT_MS = 20_000;

export const GA4_BUSINESS_EVENTS = [
  "form_submit",
  "phone_click",
  "email_click",
  "telegram_click",
  "whatsapp_click",
  "booking_click",
  "audit_request",
  "outbound_link",
  "ai_assistant_open",
  "click",
  "scroll",
] as const;

export type Ga4MetricTotals = {
  activeUsers: number;
  sessions: number;
  engagedSessions: number;
  engagementRate: number;
  averageSessionDuration: number;
  screenPageViews: number;
};

export type Ga4ChannelRow = {
  channel: string;
  sessions: number;
  activeUsers: number;
  engagedSessions: number;
};

export type Ga4LandingPageRow = {
  path: string;
  sessions: number;
  activeUsers: number;
  engagementRate: number;
};

export type Ga4DeviceRow = {
  device: string;
  activeUsers: number;
  sessions: number;
};

export type Ga4CountryRow = {
  country: string;
  activeUsers: number;
  sessions: number;
};

export type Ga4EventRow = {
  eventName: (typeof GA4_BUSINESS_EVENTS)[number];
  eventCount: number;
};

export type Ga4Snapshot = {
  configured: boolean;
  available: boolean;
  periodLabel: string;
  totals: Ga4MetricTotals;
  previousTotals: Ga4MetricTotals;
  channels: Ga4ChannelRow[];
  landingPages: Ga4LandingPageRow[];
  devices: Ga4DeviceRow[];
  countries: Ga4CountryRow[];
  events: Ga4EventRow[];
  errorCode?: string;
  errorMessage?: string;
};

export type Ga4Period = "daily" | "weekly";

type Ga4DateRange = {
  startDate: string;
  endDate: string;
};

type Ga4FilterExpression = {
  filter?: {
    fieldName: string;
    inListFilter?: {
      values: readonly string[];
      caseSensitive?: boolean;
    };
    stringFilter?: {
      matchType?: "EXACT" | "BEGINS_WITH" | "ENDS_WITH" | "CONTAINS" | "FULL_REGEXP" | "PARTIAL_REGEXP";
      value: string;
      caseSensitive?: boolean;
    };
  };
  andGroup?: { expressions: Ga4FilterExpression[] };
  orGroup?: { expressions: Ga4FilterExpression[] };
  notExpression?: Ga4FilterExpression;
};

type Ga4OrderBy = {
  desc?: boolean;
  metric?: { metricName: string };
  dimension?: { dimensionName: string; orderType?: "ALPHANUMERIC" | "CASE_INSENSITIVE_ALPHANUMERIC" | "NUMERIC" };
};

export type Ga4ReportRequest = {
  dateRanges: Ga4DateRange[];
  dimensions?: string[];
  metrics: string[];
  dimensionFilter?: Ga4FilterExpression;
  orderBys?: Ga4OrderBy[];
  limit?: number;
};

type Ga4Value = { value?: string };
type Ga4ApiRow = {
  dimensionValues?: Ga4Value[];
  metricValues?: Ga4Value[];
};
type Ga4ApiResponse = {
  dimensionHeaders?: { name?: string }[];
  metricHeaders?: { name?: string }[];
  rows?: Ga4ApiRow[];
  rowCount?: number;
};
type ParsedRow = {
  dimensions: Record<string, string>;
  metrics: Record<string, number>;
};

type PeriodConfig = {
  current: Ga4DateRange;
  previous: Ga4DateRange;
  label: string;
};

class Ga4RequestError extends Error {
  constructor(
    public readonly code: string,
    public readonly status?: number,
  ) {
    super(code);
    this.name = "Ga4RequestError";
  }
}

const ZERO_TOTALS: Ga4MetricTotals = {
  activeUsers: 0,
  sessions: 0,
  engagedSessions: 0,
  engagementRate: 0,
  averageSessionDuration: 0,
  screenPageViews: 0,
};

function propertyId(): string | null {
  const value = process.env.GA4_PROPERTY_ID?.trim().replace(/^properties\//, "");
  return value && /^\d+$/.test(value) ? value : null;
}

function periodConfig(period: Ga4Period): PeriodConfig {
  if (period === "daily") {
    return {
      current: { startDate: "yesterday", endDate: "yesterday" },
      previous: { startDate: "2daysAgo", endDate: "2daysAgo" },
      label: "завершённый календарный день",
    };
  }

  return {
    current: { startDate: "7daysAgo", endDate: "yesterday" },
    previous: { startDate: "14daysAgo", endDate: "8daysAgo" },
    label: "последние 7 завершённых дней",
  };
}

function isTimeoutError(error: unknown): boolean {
  return error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
}

function errorDetails(error: unknown): { code: string; status?: number; message: string } {
  if (error instanceof Ga4RequestError || error instanceof GoogleServiceAccountError) {
    const messages: Record<string, string> = {
      missing_google_credentials: "Не настроены credentials сервисного аккаунта Google.",
      invalid_google_private_key: "Private key сервисного аккаунта имеет неверный формат.",
      google_token_timeout: "Google OAuth не ответил вовремя.",
      google_token_request_failed: "Не удалось подключиться к Google OAuth.",
      google_token_http_error: "Google OAuth отклонил авторизацию сервисного аккаунта.",
      google_token_missing_access_token: "Google OAuth не вернул access token.",
      ga4_timeout: "Google Analytics Data API не ответил вовремя.",
      ga4_unauthorized: "Google Analytics отклонил авторизацию сервисного аккаунта.",
      ga4_forbidden: "Сервисному аккаунту не предоставлен доступ к GA4 property.",
      ga4_rate_limited: "Google Analytics временно ограничил частоту запросов.",
      ga4_unavailable: "Google Analytics Data API временно недоступен.",
      ga4_http_error: "Google Analytics Data API вернул ошибку.",
      ga4_invalid_response: "Google Analytics Data API вернул неполный ответ.",
      ga4_request_failed: "Не удалось подключиться к Google Analytics Data API.",
    };
    return {
      code: error.code,
      status: error.status,
      message: messages[error.code] ?? "Google Analytics временно недоступен.",
    };
  }

  return {
    code: isTimeoutError(error) ? "ga4_timeout" : "ga4_request_failed",
    message: isTimeoutError(error)
      ? "Google Analytics Data API не ответил вовремя."
      : "Google Analytics временно недоступен.",
  };
}

function httpError(status: number): Ga4RequestError {
  if (status === 401) return new Ga4RequestError("ga4_unauthorized", status);
  if (status === 403) return new Ga4RequestError("ga4_forbidden", status);
  if (status === 429) return new Ga4RequestError("ga4_rate_limited", status);
  if (status >= 500) return new Ga4RequestError("ga4_unavailable", status);
  return new Ga4RequestError("ga4_http_error", status);
}

function safeNumber(value?: string): number {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseRows(response: Ga4ApiResponse): ParsedRow[] {
  const dimensionNames = (response.dimensionHeaders ?? []).map((header) => header.name ?? "");
  const metricNames = (response.metricHeaders ?? []).map((header) => header.name ?? "");

  return (response.rows ?? []).map((row) => {
    const dimensions: Record<string, string> = {};
    const metrics: Record<string, number> = {};

    dimensionNames.forEach((name, index) => {
      if (name) dimensions[name] = row.dimensionValues?.[index]?.value ?? "";
    });
    metricNames.forEach((name, index) => {
      if (name) metrics[name] = safeNumber(row.metricValues?.[index]?.value);
    });

    return { dimensions, metrics };
  });
}

/** Runs one typed server-side GA4 Data API report through the shared Google JWT client. */
export async function runGa4Report(request: Ga4ReportRequest): Promise<Ga4ApiResponse> {
  const id = propertyId();
  if (!id) throw new Ga4RequestError("missing_ga4_property");

  const token = await getGoogleServiceAccountAccessToken(GA4_SCOPE);
  const body = {
    dateRanges: request.dateRanges,
    dimensions: request.dimensions?.map((name) => ({ name })),
    metrics: request.metrics.map((name) => ({ name })),
    dimensionFilter: request.dimensionFilter,
    orderBys: request.orderBys,
    limit: request.limit,
  };

  let response: Response;
  try {
    response = await fetch(`${GA4_API_ROOT}/properties/${encodeURIComponent(id)}:runReport`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(GA4_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    throw new Ga4RequestError(isTimeoutError(error) ? "ga4_timeout" : "ga4_request_failed");
  }

  if (!response.ok) throw httpError(response.status);
  const data = (await response.json().catch(() => null)) as Ga4ApiResponse | null;
  if (!data || typeof data !== "object") throw new Ga4RequestError("ga4_invalid_response");
  return data;
}

function totalsFrom(response: Ga4ApiResponse): Ga4MetricTotals | null {
  const row = parseRows(response)[0];
  if (!row) return null;

  return {
    activeUsers: row.metrics.activeUsers ?? 0,
    sessions: row.metrics.sessions ?? 0,
    engagedSessions: row.metrics.engagedSessions ?? 0,
    engagementRate: row.metrics.engagementRate ?? 0,
    averageSessionDuration: row.metrics.averageSessionDuration ?? 0,
    screenPageViews: row.metrics.screenPageViews ?? 0,
  };
}

function nonEmptyLabel(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return Boolean(normalized) && normalized !== "(not set)";
}

function emptySnapshot(
  period: Ga4Period,
  configured: boolean,
  errorCode: string,
  errorMessage: string,
): Ga4Snapshot {
  return {
    configured,
    available: false,
    periodLabel: periodConfig(period).label,
    totals: { ...ZERO_TOTALS },
    previousTotals: { ...ZERO_TOTALS },
    channels: [],
    landingPages: [],
    devices: [],
    countries: [],
    events: GA4_BUSINESS_EVENTS.map((eventName) => ({ eventName, eventCount: 0 })),
    errorCode,
    errorMessage,
  };
}

function fulfilled<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === "fulfilled" ? result.value : null;
}

function logReportFailures(
  labels: string[],
  results: PromiseSettledResult<Ga4ApiResponse>[],
): void {
  const failures = results.flatMap((result, index) =>
    result.status === "rejected"
      ? [{ label: labels[index] ?? "unknown", details: errorDetails(result.reason) }]
      : [],
  );
  if (failures.length === 0) return;

  console.warn("[ga4] One or more report requests failed.", {
    reports: failures.map((failure) => failure.label),
    code: failures[0]?.details.code,
    status: failures[0]?.details.status,
  });
}

export async function fetchGa4Snapshot(period: Ga4Period = "weekly"): Promise<Ga4Snapshot> {
  const id = propertyId();
  const hasCredentials = hasGoogleServiceAccountCredentials();
  if (!id) {
    return emptySnapshot(
      period,
      false,
      "missing_ga4_property",
      "Не задан GA4_PROPERTY_ID.",
    );
  }
  if (!hasCredentials) {
    return emptySnapshot(
      period,
      false,
      "missing_google_credentials",
      "Не настроены GSC_CLIENT_EMAIL и GSC_PRIVATE_KEY.",
    );
  }

  const dates = periodConfig(period);
  const totalsMetrics = [
    "activeUsers",
    "sessions",
    "engagedSessions",
    "engagementRate",
    "averageSessionDuration",
    "screenPageViews",
  ];

  const results = await Promise.allSettled([
    runGa4Report({ dateRanges: [dates.current], metrics: totalsMetrics }),
    runGa4Report({ dateRanges: [dates.previous], metrics: totalsMetrics }),
    runGa4Report({
      dateRanges: [dates.current],
      dimensions: ["sessionDefaultChannelGroup"],
      metrics: ["sessions", "activeUsers", "engagedSessions"],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 8,
    }),
    runGa4Report({
      dateRanges: [dates.current],
      dimensions: ["landingPagePlusQueryString"],
      metrics: ["sessions", "activeUsers", "engagementRate"],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 8,
    }),
    runGa4Report({
      dateRanges: [dates.current],
      dimensions: ["deviceCategory"],
      metrics: ["activeUsers", "sessions"],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 8,
    }),
    runGa4Report({
      dateRanges: [dates.current],
      dimensions: ["country"],
      metrics: ["activeUsers", "sessions"],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 8,
    }),
    runGa4Report({
      dateRanges: [dates.current],
      dimensions: ["eventName"],
      metrics: ["eventCount"],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          inListFilter: { values: GA4_BUSINESS_EVENTS },
        },
      },
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 15,
    }),
  ]);

  const labels = ["totals", "previousTotals", "channels", "landingPages", "devices", "countries", "events"];
  logReportFailures(labels, results);

  const totalsResponse = fulfilled(results[0]);
  const totals = totalsResponse ? totalsFrom(totalsResponse) : null;
  if (!totals) {
    const details =
      results[0]?.status === "rejected"
        ? errorDetails(results[0].reason)
        : { code: "ga4_no_data", message: "В GA4 пока нет данных за выбранный период." };
    return emptySnapshot(period, true, details.code, details.message);
  }

  const previousResponse = fulfilled(results[1]);
  const previousTotals = previousResponse ? totalsFrom(previousResponse) ?? { ...ZERO_TOTALS } : { ...ZERO_TOTALS };
  const channelRows = parseRows(fulfilled(results[2]) ?? {});
  const landingRows = parseRows(fulfilled(results[3]) ?? {});
  const deviceRows = parseRows(fulfilled(results[4]) ?? {});
  const countryRows = parseRows(fulfilled(results[5]) ?? {});
  const eventRows = parseRows(fulfilled(results[6]) ?? {});
  const eventCounts = new Map(
    eventRows.map((row) => [row.dimensions.eventName ?? "", row.metrics.eventCount ?? 0]),
  );
  const partial = results.some((result) => result.status === "rejected");

  return {
    configured: true,
    available: true,
    periodLabel: dates.label,
    totals,
    previousTotals,
    channels: channelRows
      .map((row) => ({
        channel: row.dimensions.sessionDefaultChannelGroup ?? "",
        sessions: row.metrics.sessions ?? 0,
        activeUsers: row.metrics.activeUsers ?? 0,
        engagedSessions: row.metrics.engagedSessions ?? 0,
      }))
      .filter((row) => nonEmptyLabel(row.channel)),
    landingPages: landingRows
      .map((row) => ({
        path: row.dimensions.landingPagePlusQueryString ?? "",
        sessions: row.metrics.sessions ?? 0,
        activeUsers: row.metrics.activeUsers ?? 0,
        engagementRate: row.metrics.engagementRate ?? 0,
      }))
      .filter((row) => nonEmptyLabel(row.path)),
    devices: deviceRows
      .map((row) => ({
        device: row.dimensions.deviceCategory ?? "",
        activeUsers: row.metrics.activeUsers ?? 0,
        sessions: row.metrics.sessions ?? 0,
      }))
      .filter((row) => nonEmptyLabel(row.device)),
    countries: countryRows
      .map((row) => ({
        country: row.dimensions.country ?? "",
        activeUsers: row.metrics.activeUsers ?? 0,
        sessions: row.metrics.sessions ?? 0,
      }))
      .filter((row) => nonEmptyLabel(row.country)),
    events: GA4_BUSINESS_EVENTS.map((eventName) => ({
      eventName,
      eventCount: eventCounts.get(eventName) ?? 0,
    })),
    ...(partial
      ? {
          errorCode: "ga4_partial_data",
          errorMessage: "Часть дополнительных срезов GA4 временно недоступна.",
        }
      : {}),
  };
}
