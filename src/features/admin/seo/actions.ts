"use server";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readTranslations, str, revalidateHome, type CrudState } from "@/features/admin/crud";
import type { AppLocale } from "@/i18n/routing";
import { SEO_OVERRIDE_CACHE_TAG } from "@/shared/seo/cache";
import { SEO_TR_FIELDS } from "./config";

type SeoTranslationInput = {
  locale: AppLocale;
  title: string;
  description: string;
  ogImage: string | null;
};

function read(fd: FormData) {
  const path = str(fd, "path");
  if (!path || !path.startsWith("/")) return { error: "Pfad muss mit / beginnen." };
  const trs = readTranslations(fd, SEO_TR_FIELDS);
  for (const t of trs) if (!t.title || !t.description) return { error: `Title und Description erforderlich (${t.locale}).` };
  return {
    path,
    trs: trs.map(
      (t): SeoTranslationInput => ({
        locale: t.locale,
        title: t.title,
        description: t.description,
        ogImage: t.ogImage || null,
      }),
    ),
  };
}

function revalidate(...paths: Array<string | null | undefined>) {
  // SEO edits must bypass the normal one-hour metadata cache immediately.
  updateTag(SEO_OVERRIDE_CACHE_TAG);
  revalidatePath("/admin/seo");
  for (const path of new Set(paths.filter((value): value is string => Boolean(value)))) {
    revalidatePath(path);
  }
  revalidateHome();
}

export async function createSEOPage(_p: CrudState, fd: FormData): Promise<CrudState> {
  const r = read(fd); if ("error" in r) return r;
  try { await prisma.sEOPage.create({ data: { path: r.path, translations: { create: r.trs } } }); }
  catch { return { error: "Speichern fehlgeschlagen — Pfad evtl. bereits vorhanden." }; }
  revalidate(r.path); redirect("/admin/seo");
}

export async function updateSEOPage(id: string, _p: CrudState, fd: FormData): Promise<CrudState> {
  const r = read(fd); if ("error" in r) return r;
  const previous = await prisma.sEOPage.findUnique({ where: { id }, select: { path: true } });
  try { await prisma.sEOPage.update({ where: { id }, data: { path: r.path, translations: { deleteMany: {}, create: r.trs } } }); }
  catch { return { error: "Speichern fehlgeschlagen — Pfad evtl. bereits vorhanden." }; }
  revalidate(previous?.path, r.path); redirect("/admin/seo");
}

export async function deleteSEOPage(id: string) {
  const deleted = await prisma.sEOPage.delete({ where: { id }, select: { path: true } });
  revalidate(deleted.path);
}
