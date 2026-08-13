import "server-only";

import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/shared/config/site";
import {
  AI_VISIBILITY_PLATFORMS,
  AI_VISIBILITY_PROMPTS,
  AI_VISIBILITY_TARGET_PATHS,
  isAiVisibilityPlatform,
} from "@/features/ai-visibility/queries";
import { getIsoWeekId, isIsoWeekId, shiftIsoWeek } from "@/features/ai-visibility/week";
import { submitIndexNowPaths } from "@/features/seo/indexNow";

const PAGE_SIZE = 5;
const PAGE_COUNT = Math.ceil(AI_VISIBILITY_PROMPTS.length / PAGE_SIZE);

export type TelegramAiVisibilityReply = {
  text: string;
  replyMarkup: Record<string, unknown>;
};

type VisibilityCheck = Awaited<ReturnType<typeof prisma.aiVisibilityCheck.findMany>>[number];

function adminUrl(week: string): string {
  return `${siteConfig.url}/admin/ai-visibility?week=${encodeURIComponent(week)}`;
}

function safeWeek(value?: string): string {
  return value && isIsoWeekId(value) ? value : getIsoWeekId();
}

function safePage(value?: string): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? Math.max(0, Math.min(PAGE_COUNT - 1, parsed)) : 0;
}

function promptAt(value?: string) {
  const index = Number(value);
  if (!Number.isInteger(index) || index < 0 || index >= AI_VISIBILITY_PROMPTS.length) return null;
  return { index, prompt: AI_VISIBILITY_PROMPTS[index] };
}

function statusLabel(check?: VisibilityCheck): string {
  if (!check) return "⚪ Не проверено";
  if (check.cited) return "🟢 Есть ссылка";
  if (check.mentioned) return "🟣 Упомянут";
  return "🔴 Не найден";
}

function shortStatus(check?: VisibilityCheck): string {
  if (!check) return "⚪";
  if (check.cited) return "🟢";
  if (check.mentioned) return "🟣";
  return "🔴";
}

function summaryKeyboard(week: string): Record<string, unknown> {
  return {
    inline_keyboard: [
      [
        { text: "📋 Запросы 1–5", callback_data: `aiv:list:${week}:0` },
        { text: "📋 6–10", callback_data: `aiv:list:${week}:1` },
      ],
      [
        { text: "📋 Запросы 11–15", callback_data: `aiv:list:${week}:2` },
        { text: "📋 16–20", callback_data: `aiv:list:${week}:3` },
      ],
      [
        { text: "← Неделя", callback_data: `aiv:summary:${shiftIsoWeek(week, -1)}` },
        { text: week, callback_data: `aiv:summary:${week}` },
        { text: "Неделя →", callback_data: `aiv:summary:${shiftIsoWeek(week, 1)}` },
      ],
      [
        { text: "🚀 Отправить IndexNow", callback_data: `aiv:indexnow:${week}` },
        { text: "📂 Открыть админку", url: adminUrl(week) },
      ],
    ],
  };
}

async function checksForWeek(week: string): Promise<VisibilityCheck[]> {
  return prisma.aiVisibilityCheck.findMany({
    where: { week },
    orderBy: { checkedAt: "desc" },
  });
}

export async function buildAiVisibilityReply(
  requestedWeek?: string,
  notice?: string,
): Promise<TelegramAiVisibilityReply> {
  const week = safeWeek(requestedWeek);

  try {
    const checks = await checksForWeek(week);
    const total = AI_VISIBILITY_PROMPTS.length * AI_VISIBILITY_PLATFORMS.length;
    const mentioned = checks.filter((check) => check.mentioned).length;
    const cited = checks.filter((check) => check.cited).length;
    const coverage = Math.round((checks.length / total) * 100);

    return {
      text: [
        "🔎 AI-видимость SaaleWeb",
        `📅 Неделя: ${week}`,
        "",
        `✅ Проверено: ${checks.length}/${total}`,
        `🟣 Упоминания: ${mentioned}/${total}`,
        `🟢 Ссылки на сайт: ${cited}/${total}`,
        `📊 Покрытие: ${coverage}%`,
        "",
        "Проверки выполняются вручную в пользовательских версиях AI-поиска. Выберите группу запросов для просмотра или изменения статуса.",
        ...(notice ? ["", notice] : []),
      ].join("\n"),
      replyMarkup: summaryKeyboard(week),
    };
  } catch (error) {
    return {
      text: `🔎 AI-видимость недоступна: ${error instanceof Error ? error.message : "ошибка БД"}`,
      replyMarkup: summaryKeyboard(week),
    };
  }
}

async function buildPromptListReply(weekValue?: string, pageValue?: string): Promise<TelegramAiVisibilityReply> {
  const week = safeWeek(weekValue);
  const page = safePage(pageValue);
  const start = page * PAGE_SIZE;
  const prompts = AI_VISIBILITY_PROMPTS.slice(start, start + PAGE_SIZE);
  const checks = await checksForWeek(week);
  const byPrompt = new Map<string, VisibilityCheck[]>();
  for (const check of checks) {
    byPrompt.set(check.promptKey, [...(byPrompt.get(check.promptKey) ?? []), check]);
  }

  const lines = prompts.map((prompt, offset) => {
    const index = start + offset;
    const promptChecks = byPrompt.get(prompt.key) ?? [];
    const mentioned = promptChecks.filter((check) => check.mentioned).length;
    const cited = promptChecks.filter((check) => check.cited).length;
    return [
      `${String(index + 1).padStart(2, "0")}. ${prompt.intent}`,
      prompt.prompt,
      `Проверено ${promptChecks.length}/4 · упоминаний ${mentioned} · ссылок ${cited}`,
    ].join("\n");
  });

  return {
    text: [
      `🔎 AI-запросы ${start + 1}–${start + prompts.length} · ${week}`,
      "",
      ...lines,
      "",
      "Нажмите на запрос, затем выберите платформу.",
    ].join("\n\n"),
    replyMarkup: {
      inline_keyboard: [
        ...prompts.map((prompt, offset) => {
          const index = start + offset;
          const promptChecks = byPrompt.get(prompt.key) ?? [];
          return [{
            text: `${String(index + 1).padStart(2, "0")} · ${promptChecks.length}/4 · ${prompt.intent}`,
            callback_data: `aiv:prompt:${week}:${index}:${page}`,
          }];
        }),
        [
          ...(page > 0 ? [{ text: "← Предыдущие", callback_data: `aiv:list:${week}:${page - 1}` }] : []),
          { text: "📊 Сводка", callback_data: `aiv:summary:${week}` },
          ...(page < PAGE_COUNT - 1 ? [{ text: "Следующие →", callback_data: `aiv:list:${week}:${page + 1}` }] : []),
        ],
      ],
    },
  };
}

async function buildPromptReply(
  weekValue?: string,
  promptValue?: string,
  pageValue?: string,
): Promise<TelegramAiVisibilityReply> {
  const week = safeWeek(weekValue);
  const selected = promptAt(promptValue);
  const page = safePage(pageValue);
  if (!selected) return buildAiVisibilityReply(week, "⚠️ Запрос не найден.");

  const checks = await prisma.aiVisibilityCheck.findMany({
    where: { week, promptKey: selected.prompt.key },
  });
  const byPlatform = new Map(checks.map((check) => [check.platform, check]));

  return {
    text: [
      `🔎 Запрос ${String(selected.index + 1).padStart(2, "0")} · ${week}`,
      `🎯 ${selected.prompt.intent}`,
      "",
      selected.prompt.prompt,
      "",
      ...AI_VISIBILITY_PLATFORMS.map((platform) => `${statusLabel(byPlatform.get(platform.key))} · ${platform.label}`),
      "",
      `Целевая страница: ${siteConfig.url}${selected.prompt.targetPath}`,
    ].join("\n"),
    replyMarkup: {
      inline_keyboard: [
        ...AI_VISIBILITY_PLATFORMS.map((platform) => [{
          text: `${shortStatus(byPlatform.get(platform.key))} ${platform.label}`,
          callback_data: `aiv:check:${week}:${selected.index}:${platform.key}:${page}`,
        }]),
        [{ text: "↩️ К списку", callback_data: `aiv:list:${week}:${page}` }],
        [{ text: "🌐 Открыть целевую страницу", url: `${siteConfig.url}${selected.prompt.targetPath}` }],
      ],
    },
  };
}

async function buildPlatformReply(
  weekValue?: string,
  promptValue?: string,
  platformValue?: string,
  pageValue?: string,
  notice?: string,
): Promise<TelegramAiVisibilityReply> {
  const week = safeWeek(weekValue);
  const selected = promptAt(promptValue);
  const page = safePage(pageValue);
  if (!selected || !platformValue || !isAiVisibilityPlatform(platformValue)) {
    return buildAiVisibilityReply(week, "⚠️ Запрос или платформа не найдены.");
  }

  const platform = AI_VISIBILITY_PLATFORMS.find((item) => item.key === platformValue)!;
  const check = await prisma.aiVisibilityCheck.findUnique({
    where: {
      week_promptKey_platform: {
        week,
        promptKey: selected.prompt.key,
        platform: platform.key,
      },
    },
  });

  return {
    text: [
      `🔎 ${platform.label} · ${week}`,
      `Запрос ${String(selected.index + 1).padStart(2, "0")}: ${selected.prompt.prompt}`,
      "",
      `Статус: ${statusLabel(check ?? undefined)}`,
      ...(check?.mentionOrder ? [`Позиция: ${check.mentionOrder}`] : []),
      ...(check?.citationUrl ? [`Ссылка: ${check.citationUrl}`] : []),
      ...(check?.competitor ? [`Конкурент: ${check.competitor}`] : []),
      ...(check?.notes ? [`Заметка: ${check.notes}`] : []),
      ...(notice ? ["", notice] : []),
      "",
      "Выберите фактический результат проверки:",
    ].join("\n"),
    replyMarkup: {
      inline_keyboard: [
        [
          { text: "🔴 Не найден", callback_data: `aiv:set:${week}:${selected.index}:${platform.key}:none:${page}` },
          { text: "🟣 Упомянут", callback_data: `aiv:set:${week}:${selected.index}:${platform.key}:mention:${page}` },
        ],
        [{ text: "🟢 Есть ссылка на сайт", callback_data: `aiv:set:${week}:${selected.index}:${platform.key}:cite:${page}` }],
        [{ text: "🗑 Сбросить проверку", callback_data: `aiv:set:${week}:${selected.index}:${platform.key}:clear:${page}` }],
        [
          { text: "↩️ К платформам", callback_data: `aiv:prompt:${week}:${selected.index}:${page}` },
          { text: `Открыть ${platform.label} ↗`, url: platform.href },
        ],
        [{ text: "📂 Расширенное редактирование", url: `${adminUrl(week)}&prompt=${selected.prompt.key}&platform=${platform.key}#result-form` }],
      ],
    },
  };
}

async function saveStatus(
  weekValue?: string,
  promptValue?: string,
  platformValue?: string,
  statusValue?: string,
  pageValue?: string,
): Promise<TelegramAiVisibilityReply> {
  const week = safeWeek(weekValue);
  const selected = promptAt(promptValue);
  if (!selected || !platformValue || !isAiVisibilityPlatform(platformValue)) {
    return buildAiVisibilityReply(week, "⚠️ Не удалось определить запрос или платформу.");
  }

  if (statusValue === "clear") {
    await prisma.aiVisibilityCheck.deleteMany({
      where: { week, promptKey: selected.prompt.key, platform: platformValue },
    });
    return buildPlatformReply(week, String(selected.index), platformValue, pageValue, "✅ Проверка сброшена.");
  }

  if (!statusValue || !["none", "mention", "cite"].includes(statusValue)) {
    return buildPlatformReply(week, String(selected.index), platformValue, pageValue, "⚠️ Неизвестный статус.");
  }

  const mentioned = statusValue === "mention" || statusValue === "cite";
  const cited = statusValue === "cite";
  await prisma.aiVisibilityCheck.upsert({
    where: {
      week_promptKey_platform: {
        week,
        promptKey: selected.prompt.key,
        platform: platformValue,
      },
    },
    create: {
      week,
      promptKey: selected.prompt.key,
      platform: platformValue,
      mentioned,
      cited,
    },
    update: {
      mentioned,
      cited,
      checkedAt: new Date(),
      ...(mentioned ? {} : { mentionOrder: null, citationUrl: null }),
      ...(cited ? {} : { citationUrl: null }),
    },
  });

  return buildPlatformReply(week, String(selected.index), platformValue, pageValue, "✅ Статус сохранён.");
}

export async function submitAiVisibilityIndexNow(
  weekValue?: string,
): Promise<TelegramAiVisibilityReply> {
  const week = safeWeek(weekValue);
  const result = await submitIndexNowPaths(AI_VISIBILITY_TARGET_PATHS);
  const notice = result.ok
    ? `✅ IndexNow принял ${result.submitted} приоритетных страниц.`
    : result.reason === "not_configured"
      ? "⚠️ INDEXNOW_KEY не настроен."
      : `⚠️ IndexNow не принял запрос${result.status ? `, HTTP ${result.status}` : ""}.`;
  return buildAiVisibilityReply(week, notice);
}

export async function handleAiVisibilityCallback(data: string): Promise<TelegramAiVisibilityReply> {
  const [namespace, action, ...args] = data.split(":");
  if (namespace !== "aiv") return buildAiVisibilityReply(undefined, "⚠️ Неизвестное действие.");

  if (action === "summary") return buildAiVisibilityReply(args[0]);
  if (action === "list") return buildPromptListReply(args[0], args[1]);
  if (action === "prompt") return buildPromptReply(args[0], args[1], args[2]);
  if (action === "check") return buildPlatformReply(args[0], args[1], args[2], args[3]);
  if (action === "set") return saveStatus(args[0], args[1], args[2], args[3], args[4]);
  if (action === "indexnow") return submitAiVisibilityIndexNow(args[0]);

  return buildAiVisibilityReply(args[0], "⚠️ Неизвестное действие.");
}
