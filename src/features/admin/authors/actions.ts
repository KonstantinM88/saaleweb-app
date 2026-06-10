"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readTranslations, str, strOrNull, type CrudState } from "@/features/admin/crud";
import { AUTHOR_TR_FIELDS } from "./config";
function read(fd: FormData) {
  const name = str(fd, "name");
  if (!name) return { error: "Name erforderlich." };
  const trs = readTranslations(fd, AUTHOR_TR_FIELDS);
  for (const t of trs) if (!t.role || !t.bio) return { error: `Rolle und Bio erforderlich (${t.locale}).` };
  return { top: { name, avatarUrl: strOrNull(fd, "avatarUrl") }, trs: trs.map((t) => ({ locale: t.locale, role: t.role, bio: t.bio })) };
}
export async function createAuthor(_p: CrudState, fd: FormData): Promise<CrudState> {
  const r = read(fd); if ("error" in r) return r;
  await prisma.author.create({ data: { ...r.top, translations: { create: r.trs } } });
  revalidatePath("/admin/authors"); redirect("/admin/authors");
}
export async function updateAuthor(id: string, _p: CrudState, fd: FormData): Promise<CrudState> {
  const r = read(fd); if ("error" in r) return r;
  await prisma.author.update({ where: { id }, data: { ...r.top, translations: { deleteMany: {}, create: r.trs } } });
  revalidatePath("/admin/authors"); redirect("/admin/authors");
}
export async function deleteAuthor(id: string) { await prisma.author.delete({ where: { id } }); revalidatePath("/admin/authors"); }
