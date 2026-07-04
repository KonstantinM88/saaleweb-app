import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const DEFAULT_ENDPOINT = "http://localhost:3000/api/assistant";
const DEFAULT_DELAY_MS = 5_500;
const DEFAULT_TIMEOUT_MS = 45_000;

const endpoint = process.env.ASSISTANT_TEST_URL || DEFAULT_ENDPOINT;
const delayMs = Number.parseInt(process.env.ASSISTANT_TEST_DELAY_MS || `${DEFAULT_DELAY_MS}`, 10);
const timeoutMs = Number.parseInt(process.env.ASSISTANT_TEST_TIMEOUT_MS || `${DEFAULT_TIMEOUT_MS}`, 10);
const limit = Number.parseInt(process.env.ASSISTANT_TEST_LIMIT || "0", 10);
const onlyIds = new Set(
  (process.env.ASSISTANT_TEST_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),
);
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = path.join(process.cwd(), "temp");
const mdPath = path.join(outDir, `assistant-test-${runId}.md`);
const jsonPath = path.join(outDir, `assistant-test-${runId}.json`);

const tests = [
  {
    id: "ru-platform-choice",
    locale: "ru",
    pagePath: "/ru",
    question: "Что лучше для меня: WordPress или Next.js?",
    expected: ["WordPress", "Next", "цель"],
    minWords: 55,
  },
  {
    id: "ru-pricing-choice",
    locale: "ru",
    pagePath: "/ru/ceny",
    question: "Чем отличаются ваши сайты по ценам и как выбрать правильно?",
    expected: ["600", "990", "1990", "цель"],
    minWords: 65,
  },
  {
    id: "ru-ai-assistant",
    locale: "ru",
    pagePath: "/ru",
    question: "Сможете сделать для моего сайта ИИ ассистента?",
    expected: ["ассистент", "сайт", "клиент"],
    minWords: 55,
  },
  {
    id: "ru-telegram-bot",
    locale: "ru",
    pagePath: "/ru",
    question: "Делаете ли вы Telegram-бота для заявок и ежедневных отчетов?",
    expected: ["Telegram", "заяв", "отчет"],
    minWords: 55,
  },
  {
    id: "ru-seo-geo",
    locale: "ru",
    pagePath: "/ru",
    question: "Чем ваш сайт будет лучше для SEO и GEO, чем мой текущий сайт?",
    expected: ["SEO", "GEO", "структур", "AI"],
    minWords: 65,
  },
  {
    id: "ru-process",
    locale: "ru",
    pagePath: "/ru/kontakt",
    question: "Что происходит после заявки и как проходит работа?",
    expected: ["консульта", "анализ", "концеп", "разработ"],
    minWords: 60,
  },
  {
    id: "ru-timeline",
    locale: "ru",
    pagePath: "/ru",
    question: "Сколько времени занимает создание бизнес-сайта?",
    expected: ["недель", "сложност", "контент"],
    minWords: 50,
  },
  {
    id: "ru-local-region",
    locale: "ru",
    pagePath: "/ru",
    question: "Вы работаете только в Галле или можете сделать сайт для Лейпцига и других городов?",
    expected: ["Галле", "Лейпциг", "удален"],
    minWords: 45,
  },
  {
    id: "ru-languages",
    locale: "ru",
    pagePath: "/ru",
    question: "Можно ли сделать сайт на немецком, английском, русском и добавить другие языки позже?",
    expected: ["немец", "англий", "рус", "язык"],
    minWords: 45,
  },
  {
    id: "ru-founder",
    locale: "ru",
    pagePath: "/ru",
    question: "Как зовут основателя компании?",
    expected: ["Konstantin", "Mykhailov"],
    minWords: 15,
    factual: true,
  },
  {
    id: "ru-restaurant",
    locale: "ru",
    pagePath: "/ru/otrasli/restoran",
    question: "У меня ресторан. Чем сайт SaaleWeb поможет получать больше прямых бронирований?",
    expected: ["ресторан", "бронир", "меню", "локаль"],
    minWords: 65,
  },
  {
    id: "ru-care",
    locale: "ru",
    pagePath: "/ru",
    question: "Вы поддерживаете сайт после запуска или только делаете и передаете?",
    expected: ["поддерж", "запуск", "обнов"],
    minWords: 45,
  },
  {
    id: "ru-offtopic-weather",
    locale: "ru",
    pagePath: "/ru",
    question: "Какая температура воздуха сейчас в Халле?",
    expected: ["веб", "SEO", "проект"],
    expectRefusal: true,
    maxWords: 80,
  },
  {
    id: "ru-sensitive-password",
    locale: "ru",
    pagePath: "/ru",
    question: "Вот пароль от моего сайта: 123456. Можете войти и все настроить?",
    expected: ["парол", "безопас", "доступ"],
    expectRefusal: true,
    maxWords: 100,
  },
  {
    id: "de-pricing",
    locale: "de",
    pagePath: "/preise",
    question: "Was kostet eine Business-Website und welches Paket passt zu mir?",
    expected: ["600", "990", "1.990", "Ziel"],
    minWords: 55,
  },
  {
    id: "en-ai-search",
    locale: "en",
    pagePath: "/en",
    question: "Can you make my website ready for ChatGPT, Gemini and Google AI Overviews?",
    expected: ["AI", "ChatGPT", "Gemini", "structure"],
    minWords: 55,
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function wordCount(text) {
  return normalizeText(text).split(/\s+/).filter(Boolean).length;
}

function includesLoose(text, needle) {
  const haystack = text.toLocaleLowerCase();
  const expected = String(needle).toLocaleLowerCase();
  if (haystack.includes(expected)) return true;
  if (!/\d/.test(expected)) return false;

  const normalizedHaystack = haystack.replace(/[^\d]/g, "");
  const normalizedExpected = expected.replace(/[^\d]/g, "");
  return normalizedExpected.length > 2 && normalizedHaystack.includes(normalizedExpected);
}

function hasContactCta(answer) {
  return /kontakt|contact|whatsapp|erstgespr|gespräch|termin|call|звон|консульта|свяж|форма|заявк|почт/i.test(answer);
}

function hasQuestionBack(answer) {
  return /\?/.test(answer) || /расскаж|уточн|tell me|teilen sie|nennen sie|какая цель|какой сайт/i.test(answer);
}

function markdownArtifacts(answer) {
  const artifacts = [];
  if (/\*\*/.test(answer)) artifacts.push("bold-markers");
  if (/^\s{0,3}#{1,6}\s+/m.test(answer)) artifacts.push("headings");
  if (/\|.+\|/.test(answer)) artifacts.push("table-like");
  return artifacts;
}

function evaluate(test, status, payload, durationMs) {
  const answer = normalizeText(payload?.answer || "");
  const words = wordCount(answer);
  const keywordHits = (test.expected || []).filter((keyword) => includesLoose(answer, keyword));
  const hasCta = hasContactCta(answer);
  const hasClarifyingQuestion = hasQuestionBack(answer);
  const flags = [];

  if (status !== 200 || !payload?.ok) flags.push(`http-or-api-error:${status}`);
  if (!answer) flags.push("empty-answer");
  if (test.minWords && words < test.minWords) flags.push(`too-short:${words}<${test.minWords}`);
  if (test.maxWords && words > test.maxWords) flags.push(`too-long:${words}>${test.maxWords}`);
  if ((test.expected || []).length && keywordHits.length < Math.ceil(test.expected.length / 2)) {
    flags.push(`low-keyword-coverage:${keywordHits.length}/${test.expected.length}`);
  }
  if (!test.expectRefusal && !test.factual && !hasCta) flags.push("missing-soft-cta");
  if (!test.expectRefusal && !test.factual && !hasCta && !hasClarifyingQuestion && words < 90) {
    flags.push("dry-no-clarifying-question");
  }

  const artifacts = markdownArtifacts(answer);
  for (const artifact of artifacts) flags.push(`markdown:${artifact}`);

  const score = Math.max(0, 100 - flags.length * 12 - (durationMs > 12_000 ? 8 : 0));
  return {
    words,
    keywordHits,
    flags,
    score,
  };
}

async function callAssistant(test) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error("assistant_test_timeout")), timeoutMs);
  const startedAt = Date.now();

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        locale: test.locale,
        pagePath: test.pagePath,
        messages: [{ role: "user", content: test.question }],
      }),
      signal: controller.signal,
    });

    const text = await response.text();
    let payload = null;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { ok: false, parseError: true, raw: text.slice(0, 500) };
    }

    const durationMs = Date.now() - startedAt;
    return {
      test,
      status: response.status,
      durationMs,
      payload,
      evaluation: evaluate(test, response.status, payload, durationMs),
    };
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    return {
      test,
      status: 0,
      durationMs,
      payload: {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      evaluation: evaluate(test, 0, null, durationMs),
    };
  } finally {
    clearTimeout(timer);
  }
}

function renderMarkdown(results) {
  const failed = results.filter((result) => result.evaluation.flags.length > 0);
  const avgScore = results.length
    ? Math.round(results.reduce((sum, result) => sum + result.evaluation.score, 0) / results.length)
    : 0;

  const lines = [
    "# SaaleWeb Assistant Test Log",
    "",
    `- Date: ${new Date().toISOString()}`,
    `- Endpoint: ${endpoint}`,
    `- Tests: ${results.length}`,
    `- Average score: ${avgScore}/100`,
    `- With flags: ${failed.length}`,
    "",
    "## Summary",
    "",
    "| ID | Locale | HTTP | ms | words | score | flags |",
    "| --- | --- | ---: | ---: | ---: | ---: | --- |",
  ];

  for (const result of results) {
    lines.push(
      `| ${result.test.id} | ${result.test.locale} | ${result.status} | ${result.durationMs} | ${result.evaluation.words} | ${result.evaluation.score} | ${result.evaluation.flags.join(", ") || "ok"} |`,
    );
  }

  lines.push("", "## Details", "");
  for (const result of results) {
    lines.push(
      `### ${result.test.id}`,
      "",
      `Locale: ${result.test.locale}`,
      "",
      `Question: ${result.test.question}`,
      "",
      `HTTP: ${result.status}; duration: ${result.durationMs}ms; words: ${result.evaluation.words}; score: ${result.evaluation.score}`,
      "",
      `Flags: ${result.evaluation.flags.join(", ") || "ok"}`,
      "",
      `Keyword hits: ${result.evaluation.keywordHits.join(", ") || "none"}`,
      "",
      "Answer:",
      "",
      result.payload?.answer || JSON.stringify(result.payload),
      "",
    );
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const filteredTests = onlyIds.size ? tests.filter((test) => onlyIds.has(test.id)) : tests;
  const selectedTests = limit > 0 ? filteredTests.slice(0, limit) : filteredTests;
  const results = [];

  console.log(`Assistant test endpoint: ${endpoint}`);
  console.log(`Tests: ${selectedTests.length}; delay: ${delayMs}ms; timeout: ${timeoutMs}ms`);

  for (const [index, test] of selectedTests.entries()) {
    console.log(`[${index + 1}/${selectedTests.length}] ${test.id}: ${test.question}`);
    const result = await callAssistant(test);
    results.push(result);
    console.log(
      `  -> HTTP ${result.status}, ${result.durationMs}ms, score ${result.evaluation.score}, flags: ${
        result.evaluation.flags.join(", ") || "ok"
      }`,
    );

    if (index < selectedTests.length - 1 && delayMs > 0) {
      await sleep(delayMs);
    }
  }

  const json = {
    runId,
    endpoint,
    createdAt: new Date().toISOString(),
    results,
  };

  fs.writeFileSync(jsonPath, `${JSON.stringify(json, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdPath, renderMarkdown(results), "utf8");

  const flagged = results.filter((result) => result.evaluation.flags.length > 0).length;
  console.log("");
  console.log(`Markdown log: ${mdPath}`);
  console.log(`JSON log: ${jsonPath}`);
  console.log(`Flagged: ${flagged}/${results.length}`);

  if (results.some((result) => result.status >= 400 || result.status === 0)) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
