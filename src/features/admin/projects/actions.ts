"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidateHome, readTranslations, str, strOrNull, num, numOrNull, bool, type CrudState } from "@/features/admin/crud";
import { PROJECT_TR_FIELDS } from "./config";

function read(fd: FormData) {
  const trs = readTranslations(fd, PROJECT_TR_FIELDS);
  for (const t of trs) if (!t.title || !t.slug) return { error: `Titel und Slug erforderlich (${t.locale}).` };
  const technologies = str(fd, "technologies").split(",").map((s) => s.trim()).filter(Boolean);
  return {
    top: {
      categoryId: strOrNull(fd, "categoryId"),
      coverColor: strOrNull(fd, "coverColor"),
      technologies,
      resultValue: strOrNull(fd, "resultValue"),
      year: numOrNull(fd, "year"),
      featured: bool(fd, "featured"),
      published: bool(fd, "published"),
      order: num(fd, "order"),
    },
    trs: trs.map((t) => ({
      locale: t.locale, title: t.title, slug: t.slug,
      challenge: t.challenge || null, solution: t.solution || null, results: t.results || null,
    })),
  };
}

export async function createProject(_p: CrudState, fd: FormData): Promise<CrudState> {
  const r = read(fd); if ("error" in r) return r;
  try { await prisma.project.create({ data: { ...r.top, translations: { create: r.trs } } }); }
  catch { return { error: "Speichern fehlgeschlagen — Slug evtl. nicht eindeutig." }; }
  revalidatePath("/admin/projects"); revalidateHome(); redirect("/admin/projects");
}
export async function updateProject(id: string, _p: CrudState, fd: FormData): Promise<CrudState> {
  const r = read(fd); if ("error" in r) return r;
  try { await prisma.project.update({ where: { id }, data: { ...r.top, translations: { deleteMany: {}, create: r.trs } } }); }
  catch { return { error: "Speichern fehlgeschlagen — Slug evtl. nicht eindeutig." }; }
  revalidatePath("/admin/projects"); revalidateHome(); redirect("/admin/projects");
}
export async function deleteProject(id: string) { await prisma.project.delete({ where: { id } }); revalidatePath("/admin/projects"); revalidateHome(); }
export async function toggleProjectPublished(id: string, published: boolean) { await prisma.project.update({ where: { id }, data: { published } }); revalidatePath("/admin/projects"); revalidateHome(); }
