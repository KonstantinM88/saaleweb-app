import "server-only";

import {
  fetchGscSearchAnalytics,
  type SearchAnalyticsTotals,
} from "@/features/seo-monitor/searchConsole";

type SearchQueryRow = SearchAnalyticsTotals["topQueries"][number];

const QUERY_CANDIDATE_LIMIT = 250;
const TOP_QUERY_LIMIT = 10;
const MAX_RECOMMENDATIONS = 3;

function modelName(): string {
  return process.env.OPENAI_MODEL?.trim() || "gpt-5.4-mini";
}

function formatInteger(value: number): string {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value);
}

function formatDecimal(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

function formatCtr(value: number): string {
  return `${formatDecimal(value * 100)} %`;
}

function trimText(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength - 1)}…`;
}

function demandRanking(rows: SearchQueryRow[]): SearchQueryRow[] {
  return [...rows]
    .filter((row) => row.query !== "-" && row.impressions > 0)
    .sort(
      (left, right) =>
        right.impressions - left.impressions ||
        right.clicks - left.clicks ||
        left.position - right.position,
    )
    .slice(0, TOP_QUERY_LIMIT);
}

function deterministicRecommendations(rows: SearchQueryRow[]): string[] {
  if (rows.length === 0) return ["Накопить больше данных GSC и повторить анализ через неделю."];

  const recommendations: string[] = [];
  const quickWin = rows.find((row) => row.position > 7 && row.position <= 20);
  const lowCtr = rows.find(
    (row) => row.position <= 10 && row.impressions >= 10 && row.ctr < 0.03,
  );
  const deeperOpportunity = rows.find((row) => row.position > 20);
  const leader = rows[0];

  if (quickWin) {
    recommendations.push(
      `«${trimText(quickWin.query, 54)}» — ${formatInteger(quickWin.impressions)} показов, позиция ${formatDecimal(quickWin.position)}: усилить ответ на запрос, title и внутренние ссылки существующей целевой страницы.`,
    );
  }

  if (lowCtr && lowCtr.query !== quickWin?.query) {
    recommendations.push(
      `«${trimText(lowCtr.query, 54)}» уже в топ-10, но CTR ${formatCtr(lowCtr.ctr)}: проверить сниппет, соответствие интенту и призыв к действию.`,
    );
  }

  if (deeperOpportunity && deeperOpportunity.query !== quickWin?.query) {
    recommendations.push(
      `«${trimText(deeperOpportunity.query, 54)}» имеет спрос, но позицию ${formatDecimal(deeperOpportunity.position)}: расширить доказательства, FAQ и тематические связи на канонической странице.`,
    );
  }

  if (leader && !recommendations.some((item) => item.includes(`«${trimText(leader.query, 54)}»`))) {
    recommendations.push(
      `«${trimText(leader.query, 54)}» лидирует по спросу (${formatInteger(leader.impressions)} показов): контролировать динамику позиции и кликов каждую неделю.`,
    );
  }

  return recommendations.slice(0, MAX_RECOMMENDATIONS);
}

function outputText(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const direct = (payload as { output_text?: unknown }).output_text;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  const output = (payload as { output?: unknown }).output;
  if (!Array.isArray(output)) return undefined;
  const parts: string[] = [];
  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      if (!block || typeof block !== "object") continue;
      const text = (block as { text?: unknown }).text;
      if (typeof text === "string" && text.trim()) parts.push(text.trim());
    }
  }
  return parts.join("\n").trim() || undefined;
}

type RecommendationAction = "snippet" | "content" | "internal_links" | "monitor";

function renderRecommendation(row: SearchQueryRow, action: RecommendationAction): string {
  const evidence = `${formatInteger(row.impressions)} показов · ${formatInteger(row.clicks)} кликов · CTR ${formatCtr(row.ctr)} · позиция ${formatDecimal(row.position)}`;
  const actionText: Record<RecommendationAction, string> = {
    snippet: "улучшить title/description и точнее отразить интент в сниппете",
    content: "усилить прямой ответ, доказательства и FAQ существующей канонической страницы",
    internal_links: "добавить релевантные внутренние ссылки на существующую целевую страницу",
    monitor: "сохранить текущую релевантность и контролировать недельную динамику",
  };
  return `«${trimText(row.query, 54)}» — ${evidence}: ${actionText[action]}.`;
}

function parseAiRecommendations(value: string | undefined, rows: SearchQueryRow[]): string[] {
  if (!value) return [];
  const results: string[] = [];
  const usedQueries = new Set<string>();

  for (const rawLine of value.replace(/\*\*/g, "").split(/\r?\n/)) {
    const line = rawLine.replace(/^\s*(?:[-•*]|\d+[.)])\s*/, "").trim();
    const [rawQuery, rawAction, ...rest] = line.split("||").map((part) => part.trim());
    if (!rawQuery || !rawAction || rest.length > 0) continue;
    if (!["snippet", "content", "internal_links", "monitor"].includes(rawAction)) continue;

    const normalizedQuery = rawQuery.toLocaleLowerCase("de-DE");
    const row = rows.find((candidate) => candidate.query.toLocaleLowerCase("de-DE") === normalizedQuery);
    if (!row || usedQueries.has(normalizedQuery)) continue;
    usedQueries.add(normalizedQuery);
    results.push(renderRecommendation(row, rawAction as RecommendationAction));
    if (results.length === MAX_RECOMMENDATIONS) break;
  }

  return results;
}

async function aiRecommendations(rows: SearchQueryRow[]): Promise<string[]> {
  const fallback = deterministicRecommendations(rows);
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey || rows.length === 0) return fallback;

  const compactData = rows.map((row, index) => ({
    rankByImpressions: index + 1,
    query: row.query,
    impressions: row.impressions,
    clicks: row.clicks,
    ctrPercent: Math.round(row.ctr * 1000) / 10,
    averagePosition: row.position,
  }));

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      signal: AbortSignal.timeout(15_000),
      body: JSON.stringify({
        model: modelName(),
        max_output_tokens: 320,
        input: [
          {
            role: "developer",
            content: [
              "Ты — SEO-аналитик владельца SaaleWeb.",
              "Выбери ровно 3 полезных действия по данным Google Search Console.",
              "Верни только три строки в формате: точный запрос || action.",
              "action может быть только: snippet, content, internal_links или monitor.",
              "Запрос копируй из данных без изменения. Не добавляй числа, страницы, объяснения или Markdown.",
              "Не выбирай один запрос дважды и не предлагай создание дублирующих страниц.",
            ].join("\n"),
          },
          { role: "user", content: JSON.stringify(compactData) },
        ],
      }),
    });

    const payload = (await response.json().catch(() => null)) as unknown;
    if (!response.ok) {
      console.warn("[telegram-report] Search recommendation AI unavailable.", {
        status: response.status,
        model: modelName(),
      });
      return fallback;
    }

    const parsed = parseAiRecommendations(outputText(payload), rows);
    return parsed.length === MAX_RECOMMENDATIONS ? parsed : fallback;
  } catch (error) {
    console.warn("[telegram-report] Search recommendation AI unavailable.", {
      model: modelName(),
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    return fallback;
  }
}

/** Builds a bounded, non-PII Search Console block for Telegram. */
export async function buildDailySearchInsights(): Promise<string[]> {
  try {
    const snapshot = await fetchGscSearchAnalytics(QUERY_CANDIDATE_LIMIT);
    if (!snapshot.configured) {
      return [
        "🔎 Google Search Console — спрос",
        "• Интеграция не настроена; проверьте GSC service account и GSC_SITE_URL.",
      ];
    }
    if (!snapshot.analytics) {
      return [
        "🔎 Google Search Console — спрос",
        "• Данные временно недоступны; остальная часть отчёта сформирована нормально.",
      ];
    }

    const data = snapshot.analytics;
    const rows = demandRanking(data.topQueries);
    const recommendations = await aiRecommendations(rows);
    const queryLines =
      rows.length > 0
        ? rows.map(
            (row, index) =>
              `${index + 1}. ${trimText(row.query, 48)} — поз. ${formatDecimal(row.position)} · ${formatInteger(row.impressions)} пок. · ${formatInteger(row.clicks)} кл. · CTR ${formatCtr(row.ctr)}`,
          )
        : ["• За период запросов с показами пока нет."];

    return [
      "🔎 TOP-10 запросов Google",
      `• Период GSC: ${data.startDate} — ${data.endDate} (7 дней, задержка ≈ 2 дня)`,
      `• Всего: ${formatInteger(data.impressions)} показов · ${formatInteger(data.clicks)} кликов · CTR ${formatCtr(data.ctr)} · ср. поз. ${formatDecimal(data.position)}`,
      "• Рейтинг ниже — по показам (спросу):",
      ...queryLines,
      "",
      "🧠 Рекомендации AI",
      ...recommendations.map((item) => `• ${item}`),
      "• Выводы основаны только на агрегированных данных GSC, без гарантий роста.",
    ];
  } catch (error) {
    console.warn("[telegram-report] Search insights skipped.", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    return [
      "🔎 Google Search Console — спрос",
      "• Блок временно недоступен; основной ежедневный отчёт продолжает работать.",
    ];
  }
}
