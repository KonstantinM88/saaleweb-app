"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/session";
import {
  AI_VISIBILITY_TARGET_PATHS,
  isAiVisibilityPlatform,
  isAiVisibilityPromptKey,
} from "@/features/ai-visibility/queries";
import { isIsoWeekId } from "@/features/ai-visibility/week";
import { submitIndexNowPaths } from "@/features/seo/indexNow";

const text = (max: number) => z.string().trim().max(max).optional();

const checkSchema = z.object({
  week: z.string().refine(isIsoWeekId),
  promptKey: z.string().refine(isAiVisibilityPromptKey),
  platform: z.string().refine(isAiVisibilityPlatform),
  mentioned: z.boolean(),
  cited: z.boolean(),
  mentionOrder: z.number().int().min(1).max(20).nullable(),
  citationUrl: text(500),
  competitor: text(240),
  notes: text(1200),
});

function cleanText(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string") return undefined;
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
  return cleaned || undefined;
}

function normalizeCitationUrl(value: FormDataEntryValue | null): string | undefined {
  const input = cleanText(value);
  if (!input) return undefined;
  try {
    const url = new URL(input);
    if (url.protocol !== "https:" || !["saaleweb.de", "www.saaleweb.de"].includes(url.hostname)) return undefined;
    url.hash = "";
    return url.toString().slice(0, 500);
  } catch {
    return undefined;
  }
}

function selectionUrl(week: string, promptKey?: string, platform?: string, status?: string) {
  const params = new URLSearchParams({ week });
  if (promptKey) params.set("prompt", promptKey);
  if (platform) params.set("platform", platform);
  if (status) params.set("status", status);
  return `/admin/ai-visibility?${params.toString()}`;
}

async function requireAdmin() {
  if (!(await getSession())) redirect("/admin/login");
}

export async function saveAiVisibilityCheck(formData: FormData) {
  await requireAdmin();
  const mentioned = formData.get("mentioned") === "on";
  const cited = mentioned && formData.get("cited") === "on";
  const orderValue = cleanText(formData.get("mentionOrder"));
  const rawCitationUrl = cleanText(formData.get("citationUrl"));
  const citationUrl = cited ? normalizeCitationUrl(formData.get("citationUrl")) : undefined;

  if (cited && rawCitationUrl && !citationUrl) {
    redirect(selectionUrl(
      cleanText(formData.get("week")) ?? "",
      cleanText(formData.get("promptKey")),
      cleanText(formData.get("platform")),
      "invalid",
    ));
  }

  const parsed = checkSchema.safeParse({
    week: cleanText(formData.get("week")) ?? "",
    promptKey: cleanText(formData.get("promptKey")) ?? "",
    platform: cleanText(formData.get("platform")) ?? "",
    mentioned,
    cited,
    mentionOrder: mentioned && orderValue ? Number(orderValue) : null,
    citationUrl,
    competitor: cleanText(formData.get("competitor")),
    notes: cleanText(formData.get("notes")),
  });

  if (!parsed.success) {
    redirect(selectionUrl(
      cleanText(formData.get("week")) ?? "",
      cleanText(formData.get("promptKey")),
      cleanText(formData.get("platform")),
      "invalid",
    ));
  }

  const data = parsed.data;
  await prisma.aiVisibilityCheck.upsert({
    where: {
      week_promptKey_platform: {
        week: data.week,
        promptKey: data.promptKey,
        platform: data.platform,
      },
    },
    create: data,
    update: {
      mentioned: data.mentioned,
      cited: data.cited,
      mentionOrder: data.mentionOrder,
      citationUrl: data.citationUrl ?? null,
      competitor: data.competitor ?? null,
      notes: data.notes ?? null,
      checkedAt: new Date(),
    },
  });

  revalidatePath("/admin/ai-visibility");
  redirect(selectionUrl(data.week, data.promptKey, data.platform, "saved"));
}

export async function deleteAiVisibilityCheck(formData: FormData) {
  await requireAdmin();
  const week = cleanText(formData.get("week")) ?? "";
  const promptKey = cleanText(formData.get("promptKey")) ?? "";
  const platform = cleanText(formData.get("platform")) ?? "";

  if (!isIsoWeekId(week) || !isAiVisibilityPromptKey(promptKey) || !isAiVisibilityPlatform(platform)) {
    redirect(selectionUrl(week, promptKey, platform, "invalid"));
  }

  await prisma.aiVisibilityCheck.deleteMany({ where: { week, promptKey, platform } });
  revalidatePath("/admin/ai-visibility");
  redirect(selectionUrl(week, promptKey, platform, "deleted"));
}

export async function submitPriorityUrlsToIndexNow(formData: FormData) {
  await requireAdmin();
  const week = cleanText(formData.get("week")) ?? "";
  const safeWeek = isIsoWeekId(week) ? week : undefined;
  const result = await submitIndexNowPaths(AI_VISIBILITY_TARGET_PATHS);

  revalidatePath("/admin/ai-visibility");
  const status = result.ok
    ? `indexnow-sent-${result.submitted}`
    : result.reason === "not_configured"
      ? "indexnow-missing"
      : `indexnow-failed-${result.status ?? "network"}`;
  redirect(selectionUrl(safeWeek ?? "", undefined, undefined, status));
}
