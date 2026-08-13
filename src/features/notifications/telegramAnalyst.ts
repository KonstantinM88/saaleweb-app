import "server-only";

import { buildSeoScoreReport } from "@/features/seo-monitor/seoScore";
import { fetchGscSearchAnalytics } from "@/features/seo-monitor/searchConsole";
import { buildAiVisibilityReply } from "./telegramAiVisibility";
import {
  buildAiSearchReport,
  buildGa4Report,
  buildWeeklySiteReport,
} from "./telegramReports";

export type TelegramAnalystReply = {
  text: string;
  replyMarkup: Record<string, unknown>;
};

type AnalystTopic = "overview" | "keywords" | "traffic" | "leads" | "ai" | "seo";

const ANALYST_QUESTION_MARKER = "🧠 Вопрос для AI-аналитика";
const MAX_QUESTION_LENGTH = 800;
const MAX_CONTEXT_LENGTH = 14_000;
const MAX_ANSWER_LENGTH = 3_500;

const TOPIC_QUESTIONS: Record<AnalystTopic, string> = {
  overview:
    "Дай управленческую сводку по SaaleWeb: что изменилось, где есть рост или риск и какие три действия сейчас приоритетны?",
  keywords:
    "Какие поисковые запросы уже дают SaaleWeb показы и клики, где находятся самые практичные SEO-возможности и что усилить в первую очередь?",
  traffic:
    "Проанализируй трафик SaaleWeb: динамику, каналы, посадочные страницы, устройства и события. Какие выводы и действия наиболее важны?",
  leads:
    "Проанализируй заявки и конверсию SaaleWeb без персональных данных. Что видно по динамике и какие действия помогут получать больше качественных обращений?",
  ai:
    "Проанализируй AI-видимость SaaleWeb, визиты AI-краулеров и переходы из AI-систем. Где есть прогресс и какие страницы нужно усиливать?",
  seo:
    "Проанализируй текущий SEO/GEO/AIO Score SaaleWeb. Какие технические или контентные задачи имеют наибольший приоритет?",
};

function analystMenuKeyboard(): Record<string, unknown> {
  return {
    inline_keyboard: [
      [
        { text: "🔎 Ключевые слова", callback_data: "analyst:topic:keywords" },
        { text: "📈 Трафик и каналы", callback_data: "analyst:topic:traffic" },
      ],
      [
        { text: "🎯 Заявки и конверсии", callback_data: "analyst:topic:leads" },
        { text: "🤖 AI-видимость", callback_data: "analyst:topic:ai" },
      ],
      [
        { text: "🧮 SEO и техника", callback_data: "analyst:topic:seo" },
        { text: "📋 Общая сводка", callback_data: "analyst:topic:overview" },
      ],
      [{ text: "✍️ Задать свой вопрос", callback_data: "analyst:question" }],
    ],
  };
}

function answerKeyboard(): Record<string, unknown> {
  return {
    inline_keyboard: [
      [
        { text: "✍️ Другой вопрос", callback_data: "analyst:question" },
        { text: "🧠 Разделы аналитика", callback_data: "analyst:menu" },
      ],
    ],
  };
}

export function buildTelegramAnalystMenu(): TelegramAnalystReply {
  return {
    text: [
      "🧠 AI-аналитик SaaleWeb",
      "",
      "Выберите готовый анализ или задайте вопрос своими словами. Аналитик использует только доступную агрегированную статистику SaaleWeb и не получает контакты клиентов, IP, секреты или право изменять данные.",
      "",
      "Данные загружаются только после вашего запроса — фоновой нагрузки на БД нет.",
    ].join("\n"),
    replyMarkup: analystMenuKeyboard(),
  };
}

export function buildTelegramAnalystQuestionPrompt(): TelegramAnalystReply {
  return {
    text: [
      ANALYST_QUESTION_MARKER,
      "",
      "Напишите вопрос одним сообщением. Например:",
      "• Какие ключевые слова ближе всего к первой странице?",
      "• Почему снизился трафик и что проверить?",
      "• Какие страницы лучше конвертируют в заявки?",
      "• Что сейчас важнее для AI-видимости?",
    ].join("\n"),
    replyMarkup: {
      force_reply: true,
      selective: true,
      input_field_placeholder: "Введите вопрос по статистике SaaleWeb",
    },
  };
}

export function isTelegramAnalystQuestionReply(replyToText?: string): boolean {
  return Boolean(replyToText?.startsWith(ANALYST_QUESTION_MARKER));
}

function cleanQuestion(value: string): string {
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_QUESTION_LENGTH);
}

function inferTopics(question: string): AnalystTopic[] {
  const normalized = question.toLowerCase();
  const topics: AnalystTopic[] = [];

  if (/ключев|запрос|позиц|показ|клик|ctr|search console|gsc|keyword|suchanfrag/.test(normalized)) {
    topics.push("keywords");
  }
  if (/заяв|лид|конверс|обращен|форма|lead|conversion|anfrag/.test(normalized)) topics.push("leads");
  if (/ai-|ии|gpt|chatgpt|gemini|perplexity|copilot|краулер|crawler|видимост/.test(normalized)) {
    topics.push("ai");
  }
  if (/seo|индекс|lighthouse|pagespeed|core web|cwv|ошиб|технич/.test(normalized)) topics.push("seo");
  if (/трафик|канал|источник|посет|сесси|страниц|устройств|ga4|analytics/.test(normalized)) {
    topics.push("traffic");
  }

  // At most two bounded snapshots keep arbitrary questions useful without
  // turning one Telegram message into a broad fan-out across every service.
  return topics.length > 0 ? [...new Set(topics)].slice(0, 2) : ["overview"];
}

function formatGscContext(snapshot: Awaited<ReturnType<typeof fetchGscSearchAnalytics>>): string {
  if (!snapshot.configured) return "Google Search Console не настроен.";
  if (!snapshot.analytics) return `Google Search Console недоступен: ${snapshot.error || "нет данных"}.`;

  const data = snapshot.analytics;
  return [
    `Источник: Google Search Console. Период: ${data.startDate} — ${data.endDate}.`,
    `Клики: ${data.clicks}. Показы: ${data.impressions}. CTR: ${(data.ctr * 100).toFixed(1)}%. Средняя позиция: ${data.position.toFixed(1)}.`,
    "Поисковые запросы:",
    ...(data.topQueries.length > 0
      ? data.topQueries.map(
          (row, index) =>
            `${index + 1}. ${row.query} — показы ${row.impressions}, клики ${row.clicks}, CTR ${(row.ctr * 100).toFixed(1)}%, средняя позиция ${row.position}`,
        )
      : ["Запросы за период отсутствуют."]),
  ].join("\n");
}

function sanitizeReportContext(value: string): string {
  return value
    .replace(/https?:\/\/[^\s]+/gi, (raw) => {
      try {
        const url = new URL(raw);
        return `${url.origin}${url.pathname}`;
      } catch {
        return "[ссылка скрыта]";
      }
    })
    .replace(/[?&](?:gclid|fbclid|msclkid)=[^\s&]+/gi, "")
    .slice(0, MAX_CONTEXT_LENGTH);
}

async function loadTopicContext(topic: AnalystTopic): Promise<string> {
  if (topic === "keywords") {
    return formatGscContext(await fetchGscSearchAnalytics(20));
  }
  if (topic === "traffic") {
    return sanitizeReportContext(await buildGa4Report());
  }
  if (topic === "leads") {
    // The weekly report contains aggregate lead totals and conversion only;
    // unlike /leads it never includes names, emails, phones or messages.
    return sanitizeReportContext(await buildWeeklySiteReport());
  }
  if (topic === "ai") {
    const visibility = await buildAiVisibilityReply();
    const traffic = await buildAiSearchReport();
    return sanitizeReportContext(`${visibility.text}\n\n${traffic}`);
  }
  if (topic === "seo") {
    return sanitizeReportContext(await buildSeoScoreReport());
  }
  return sanitizeReportContext(await buildWeeklySiteReport());
}

function modelName(): string {
  return process.env.OPENAI_MODEL?.trim() || "gpt-5.4-mini";
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
  return parts.join("\n\n").trim() || undefined;
}

function cleanAnswer(value: string): string {
  const cleaned = value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/```[\s\S]*?```/g, "[блок кода исключён]")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return cleaned.length <= MAX_ANSWER_LENGTH
    ? cleaned
    : `${cleaned.slice(0, MAX_ANSWER_LENGTH - 24)}\n\n…ответ сокращён`;
}

async function createAnalystResponse(question: string, context: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return [
      "AI-анализ временно недоступен: OPENAI_API_KEY не настроен.",
      "",
      "Доступный срез данных:",
      context.slice(0, 2_700),
    ].join("\n");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      signal: AbortSignal.timeout(35_000),
      body: JSON.stringify({
        model: modelName(),
        max_output_tokens: 850,
        input: [
          {
            role: "developer",
            content: [
              "Ты — закрытый read-only AI-аналитик владельца SaaleWeb.",
              "Отвечай по-русски, профессионально и кратко. Используй только предоставленный срез данных, не выдумывай числа и явно называй ограничения периода или источника.",
              "Начни с прямого вывода. Затем укажи наблюдения и не более трёх приоритетных действий, каждое привяжи к факту из данных.",
              "Не запрашивай и не раскрывай персональные данные, IP, контакты клиентов, токены, click IDs или секреты. Не предлагай SQL и не утверждай, что изменил сайт, рекламу или данные.",
              "Если данных недостаточно, честно скажи, какой существующий отчёт или период нужно проверить.",
              "Не используй Markdown-таблицы, заголовки с #, жирные маркеры или длинные списки — ответ читают в Telegram.",
            ].join("\n"),
          },
          {
            role: "user",
            content: `Вопрос владельца:\n${question}\n\nПроверенный агрегированный срез:\n${context}`,
          },
        ],
      }),
    });

    const payload = (await response.json().catch(() => null)) as unknown;
    if (!response.ok) {
      console.error("[telegram-analyst] OpenAI request failed.", {
        status: response.status,
        model: modelName(),
      });
      return "AI-аналитик временно не получил ответ модели. Попробуйте ещё раз или откройте соответствующий обычный отчёт через меню.";
    }

    return cleanAnswer(
      outputText(payload) ||
        "Данных для уверенного вывода пока недостаточно. Откройте профильный отчёт и повторите вопрос после обновления статистики.",
    );
  } catch (error) {
    console.error("[telegram-analyst] OpenAI request failed.", {
      model: modelName(),
      message: error instanceof Error ? error.message : "Unknown request error",
    });
    return "AI-аналитик временно недоступен. Обычные отчёты бота продолжают работать; повторите вопрос немного позже.";
  }
}

export async function buildTelegramAnalystAnswer(
  rawQuestion: string,
  requestedTopic?: AnalystTopic,
): Promise<TelegramAnalystReply> {
  const question = cleanQuestion(rawQuestion);
  if (question.length < 3) return buildTelegramAnalystQuestionPrompt();

  const topics = requestedTopic ? [requestedTopic] : inferTopics(question);
  try {
    const contextParts: string[] = [];
    for (const topic of topics) {
      contextParts.push(`[Срез: ${topic}]\n${await loadTopicContext(topic)}`);
    }
    const context = contextParts.join("\n\n");
    const answer = await createAnalystResponse(question, context);
    return {
      text: `🧠 AI-аналитик SaaleWeb\n\n${answer}`,
      replyMarkup: answerKeyboard(),
    };
  } catch (error) {
    console.error("[telegram-analyst] Data snapshot failed.", {
      topics,
      message: error instanceof Error ? error.message : "Unknown data error",
    });
    return {
      text: "🧠 Не удалось подготовить безопасный срез статистики. Попробуйте профильный обычный отчёт или повторите запрос позже.",
      replyMarkup: answerKeyboard(),
    };
  }
}

function isAnalystTopic(value?: string): value is AnalystTopic {
  return Boolean(value && value in TOPIC_QUESTIONS);
}

export async function handleTelegramAnalystCallback(data: string): Promise<TelegramAnalystReply> {
  const [, action, value] = data.split(":");
  if (action === "menu") return buildTelegramAnalystMenu();
  if (action === "question") return buildTelegramAnalystQuestionPrompt();
  if (action === "topic" && isAnalystTopic(value)) {
    return buildTelegramAnalystAnswer(TOPIC_QUESTIONS[value], value);
  }
  return buildTelegramAnalystMenu();
}
