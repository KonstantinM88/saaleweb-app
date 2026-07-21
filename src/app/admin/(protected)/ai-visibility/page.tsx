import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/shared/config/site";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { adminBtn, adminBtnGhost, adminCard, adminInput, adminLabel } from "@/widgets/admin/ui";
import {
  AI_VISIBILITY_PLATFORMS,
  AI_VISIBILITY_PROMPTS,
  isAiVisibilityPlatform,
  isAiVisibilityPromptKey,
} from "@/features/ai-visibility/queries";
import { getIsoWeekId, isIsoWeekId, shiftIsoWeek } from "@/features/ai-visibility/week";
import { CopyPromptButton } from "@/features/ai-visibility/CopyPromptButton";
import { isIndexNowConfigured } from "@/features/seo/indexNow";
import {
  deleteAiVisibilityCheck,
  saveAiVisibilityCheck,
  submitPriorityUrlsToIndexNow,
} from "@/features/admin/ai-visibility/actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function scalar(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

function statusLabel(check?: { mentioned: boolean; cited: boolean } | null) {
  if (!check) return { text: "Не проверено", className: "bg-gray-100 text-gray-600" };
  if (check.cited) return { text: "Есть ссылка", className: "bg-emerald-50 text-emerald-700" };
  if (check.mentioned) return { text: "Упомянут", className: "bg-violet-50 text-violet-700" };
  return { text: "Не найден", className: "bg-red-50 text-red-700" };
}

function selectionHref(week: string, prompt: string, platform: string) {
  return `/admin/ai-visibility?${new URLSearchParams({ week, prompt, platform }).toString()}#result-form`;
}

export default async function AiVisibilityPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const requestedWeek = scalar(params.week);
  const week = requestedWeek && isIsoWeekId(requestedWeek) ? requestedWeek : getIsoWeekId();
  const selectedPromptKey = scalar(params.prompt);
  const selectedPlatformKey = scalar(params.platform);
  const selectedPrompt = selectedPromptKey && isAiVisibilityPromptKey(selectedPromptKey)
    ? AI_VISIBILITY_PROMPTS.find((item) => item.key === selectedPromptKey)
    : undefined;
  const selectedPlatform = selectedPlatformKey && isAiVisibilityPlatform(selectedPlatformKey)
    ? AI_VISIBILITY_PLATFORMS.find((item) => item.key === selectedPlatformKey)
    : undefined;

  let checks: Awaited<ReturnType<typeof prisma.aiVisibilityCheck.findMany>> = [];
  let weeks: { week: string }[] = [];
  let databaseReady = true;
  try {
    [checks, weeks] = await Promise.all([
      prisma.aiVisibilityCheck.findMany({ where: { week }, orderBy: { checkedAt: "desc" } }),
      prisma.aiVisibilityCheck.findMany({
        select: { week: true },
        distinct: ["week"],
        orderBy: { week: "desc" },
        take: 12,
      }),
    ]);
  } catch {
    databaseReady = false;
  }

  const byKey = new Map(checks.map((check) => [`${check.promptKey}:${check.platform}`, check]));
  const checked = checks.length;
  const mentioned = checks.filter((item) => item.mentioned).length;
  const cited = checks.filter((item) => item.cited).length;
  const total = AI_VISIBILITY_PROMPTS.length * AI_VISIBILITY_PLATFORMS.length;
  const selectedCheck = selectedPrompt && selectedPlatform
    ? byKey.get(`${selectedPrompt.key}:${selectedPlatform.key}`)
    : undefined;
  const status = scalar(params.status);

  return (
    <>
      <PageHeader
        title="AI-видимость"
        subtitle="Еженедельный воспроизводимый мониторинг 20 коммерческих запросов."
      />

      {status ? (
        <div className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
          status === "saved" || status.startsWith("indexnow-sent")
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : status === "deleted"
              ? "border-line bg-surface text-ink"
              : "border-amber-200 bg-amber-50 text-amber-900"
        }`}>
          {status === "saved" && "Результат проверки сохранён."}
          {status === "deleted" && "Результат проверки удалён."}
          {status === "invalid" && "Некорректные данные. Проверьте поля и URL."}
          {status === "indexnow-missing" && "IndexNow ещё не настроен: INDEXNOW_KEY отсутствует или некорректен."}
          {status.startsWith("indexnow-sent") && `${status.split("-").at(-1)} приоритетных страниц отправлено в IndexNow.`}
          {status.startsWith("indexnow-failed") && "IndexNow не принял запрос. Проверьте статус и логи хостинга."}
        </div>
      ) : null}

      {!databaseReady ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Таблица базы данных отсутствует или недоступна. Сначала примените миграцию.
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {[
          { label: "Проверено", value: `${checked}/${total}`, tone: "text-dark" },
          { label: "Упоминания", value: `${mentioned}/${total}`, tone: "text-violet-700" },
          { label: "Ссылки на сайт", value: `${cited}/${total}`, tone: "text-emerald-700" },
          { label: "Покрытие", value: `${Math.round((checked / total) * 100)} %`, tone: "text-brand-purple" },
        ].map((item) => (
          <div key={item.label} className={`${adminCard} p-4`}>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">{item.label}</div>
            <div className={`mt-2 text-2xl font-bold ${item.tone}`}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className={`${adminCard} mb-6 p-5`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold text-dark">IndexNow</h2>
            <p className="mt-1 text-sm text-muted">
              Отправляет {new Set(AI_VISIBILITY_PROMPTS.map((item) => item.targetPath)).size} приоритетных страниц в Bing и участвующие поисковые системы.
            </p>
            <p className="mt-2 text-xs text-muted">
              Статус: <span className={isIndexNowConfigured() ? "font-semibold text-emerald-700" : "font-semibold text-amber-700"}>
                {isIndexNowConfigured() ? "настроен" : "INDEXNOW_KEY отсутствует"}
              </span>
            </p>
          </div>
          <form action={submitPriorityUrlsToIndexNow}>
            <input type="hidden" name="week" value={week} />
            <button type="submit" className={adminBtn} disabled={!isIndexNowConfigured()}>
              Отправить приоритетные страницы
            </button>
          </form>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Link href={`/admin/ai-visibility?week=${shiftIsoWeek(week, -1)}`} className={adminBtnGhost}>← Прошлая неделя</Link>
        <span className="rounded-lg bg-brand-soft px-4 py-2 text-sm font-bold text-brand-purple">{week}</span>
        <Link href={`/admin/ai-visibility?week=${shiftIsoWeek(week, 1)}`} className={adminBtnGhost}>Следующая неделя →</Link>
        {week !== getIsoWeekId() ? <Link href="/admin/ai-visibility" className={adminBtnGhost}>Текущая неделя</Link> : null}
        {weeks.map((item) => item.week !== week ? (
          <Link key={item.week} href={`/admin/ai-visibility?week=${item.week}`} className="text-xs font-semibold text-brand-purple hover:underline">
            {item.week}
          </Link>
        ) : null)}
      </div>

      <div className={`${adminCard} mb-6 overflow-x-auto`}>
        <table className="w-full min-w-[980px] text-sm">
          <thead className="border-b border-line bg-surface text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Запрос / целевая страница</th>
              {AI_VISIBILITY_PLATFORMS.map((platform) => <th key={platform.key} className="px-3 py-3">{platform.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {AI_VISIBILITY_PROMPTS.map((prompt, index) => (
              <tr key={prompt.key} className="border-b border-line align-top last:border-0">
                <td className="max-w-xl px-4 py-4">
                  <div className="text-xs font-bold text-brand-purple">{String(index + 1).padStart(2, "0")} · {prompt.intent}</div>
                  <div className="mt-1 font-semibold text-dark">{prompt.prompt}</div>
                  <CopyPromptButton prompt={prompt.prompt} />
                  <a href={`${siteConfig.url}${prompt.targetPath}`} target="_blank" rel="noreferrer" className="mt-1 inline-block font-mono text-xs text-muted hover:text-brand-purple">
                    {prompt.targetPath} ↗
                  </a>
                </td>
                {AI_VISIBILITY_PLATFORMS.map((platform) => {
                  const check = byKey.get(`${prompt.key}:${platform.key}`);
                  const badge = statusLabel(check);
                  return (
                    <td key={platform.key} className="px-3 py-4">
                      <Link href={selectionHref(week, prompt.key, platform.key)} className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${badge.className}`}>
                        {badge.text}
                      </Link>
                      {check?.mentionOrder ? <div className="mt-1 text-xs text-muted">Позиция: {check.mentionOrder}</div> : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPrompt && selectedPlatform ? (
        <section className={`${adminCard} scroll-mt-6 p-5`} id="result-form">
          <div className="flex flex-col gap-3 border-b border-line pb-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-purple">{selectedPlatform.label} · {week}</div>
              <h2 className="mt-1 text-lg font-bold text-dark">{selectedPrompt.prompt}</h2>
              <CopyPromptButton prompt={selectedPrompt.prompt} />
            </div>
            <a href={selectedPlatform.href} target="_blank" rel="noreferrer" className={adminBtnGhost}>
              Открыть {selectedPlatform.label} ↗
            </a>
          </div>

          <form action={saveAiVisibilityCheck} className="mt-5 grid gap-4 md:grid-cols-2">
            <input type="hidden" name="week" value={week} />
            <input type="hidden" name="promptKey" value={selectedPrompt.key} />
            <input type="hidden" name="platform" value={selectedPlatform.key} />

            <label className="flex items-center gap-2 rounded-lg border border-line p-3 text-sm font-semibold text-ink">
              <input type="checkbox" name="mentioned" defaultChecked={selectedCheck?.mentioned ?? false} className="size-4 accent-violet-600" />
              SaaleWeb упоминается
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-line p-3 text-sm font-semibold text-ink">
              <input type="checkbox" name="cited" defaultChecked={selectedCheck?.cited ?? false} className="size-4 accent-emerald-600" />
              Есть ссылка на SaaleWeb как на источник
            </label>

            <label className={adminLabel}>
              Примерная позиция (необязательно)
              <input name="mentionOrder" type="number" min={1} max={20} defaultValue={selectedCheck?.mentionOrder ?? ""} className={adminInput} />
            </label>
            <label className={adminLabel}>
              URL процитированной страницы SaaleWeb (необязательно)
              <input name="citationUrl" type="url" placeholder="https://saaleweb.de/..." defaultValue={selectedCheck?.citationUrl ?? ""} className={adminInput} />
            </label>
            <label className={adminLabel}>
              Заметный конкурент (необязательно)
              <input name="competitor" maxLength={240} defaultValue={selectedCheck?.competitor ?? ""} className={adminInput} />
            </label>
            <label className={adminLabel}>
              Заметка (необязательно)
              <textarea name="notes" maxLength={1200} rows={3} defaultValue={selectedCheck?.notes ?? ""} className={adminInput} />
            </label>
            <div className="flex flex-wrap gap-2 md:col-span-2">
              <button type="submit" className={adminBtn}>Сохранить результат</button>
            </div>
          </form>

          {selectedCheck ? (
            <form action={deleteAiVisibilityCheck} className="mt-3">
              <input type="hidden" name="week" value={week} />
              <input type="hidden" name="promptKey" value={selectedPrompt.key} />
              <input type="hidden" name="platform" value={selectedPlatform.key} />
              <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">Удалить результат</button>
            </form>
          ) : null}
        </section>
      ) : (
        <div className="rounded-xl border border-dashed border-line bg-surface px-5 py-8 text-center text-sm text-muted">
          Выберите статус платформы в таблице, чтобы записать результат проверки.
        </div>
      )}
    </>
  );
}
