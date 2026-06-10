"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readTranslations, str, type CrudState } from "@/features/admin/crud";
import { CAT_TR_FIELDS } from "./config";
function read(fd: FormData) {
  const key = str(fd, "key");
  if (!key) return { error: "Key erforderlich." };
  const trs = readTranslations(fd, CAT_TR_FIELDS);
  for (const t of trs) if (!t.name || !t.slug) return { error: `Name und Slug erforderlich (${t.locale}).` };
  return { key, trs: trs.map((t) => ({ locale: t.locale, name: t.name, slug: t.slug })) };
}
export async function createCategory(_p: CrudState, fd: FormData): Promise<CrudState> {
  const r = read(fd); if ("error" in r) return r;
  try { await prisma.blogCategory.create({ data: { key: r.key, translations: { create: r.trs } } }); }
  catch { return { error: "Speichern fehlgeschlagen — Key/Slug evtl. nicht eindeutig." }; }
  revalidatePath("/admin/categories"); redirect("/admin/categories");
}
export async function updateCategory(id: string, _p: CrudState, fd: FormData): Promise<CrudState> {
  const r = read(fd); if ("error" in r) return r;
  try { await prisma.blogCategory.update({ where: { id }, data: { key: r.key, translations: { deleteMany: {}, create: r.trs } } }); }
  catch { return { error: "Speichern fehlgeschlagen — Key/Slug evtl. nicht eindeutig." }; }
  revalidatePath("/admin/categories"); redirect("/admin/categories");
}
export async function deleteCategory(id: string) { await prisma.blogCategory.delete({ where: { id } }); revalidatePath("/admin/categories"); }
