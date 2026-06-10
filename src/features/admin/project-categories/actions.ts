"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readTranslations, str, type CrudState } from "@/features/admin/crud";
import { PROJCAT_TR_FIELDS } from "./config";

function read(fd: FormData) {
  const key = str(fd, "key");
  if (!key) return { error: "Key erforderlich." };
  const trs = readTranslations(fd, PROJCAT_TR_FIELDS);
  for (const t of trs) if (!t.name) return { error: `Name erforderlich (${t.locale}).` };
  return { key, trs: trs.map((t) => ({ locale: t.locale, name: t.name })) };
}
export async function createProjectCategory(_p: CrudState, fd: FormData): Promise<CrudState> {
  const r = read(fd); if ("error" in r) return r;
  try { await prisma.projectCategory.create({ data: { key: r.key, translations: { create: r.trs } } }); }
  catch { return { error: "Speichern fehlgeschlagen — Key evtl. nicht eindeutig." }; }
  revalidatePath("/admin/project-categories"); redirect("/admin/project-categories");
}
export async function updateProjectCategory(id: string, _p: CrudState, fd: FormData): Promise<CrudState> {
  const r = read(fd); if ("error" in r) return r;
  try { await prisma.projectCategory.update({ where: { id }, data: { key: r.key, translations: { deleteMany: {}, create: r.trs } } }); }
  catch { return { error: "Speichern fehlgeschlagen — Key evtl. nicht eindeutig." }; }
  revalidatePath("/admin/project-categories"); redirect("/admin/project-categories");
}
export async function deleteProjectCategory(id: string) { await prisma.projectCategory.delete({ where: { id } }); revalidatePath("/admin/project-categories"); }
