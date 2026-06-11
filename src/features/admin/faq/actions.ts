"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidateHome, readTranslations, strOrNull, num, bool, type CrudState } from "@/features/admin/crud";
import { FAQ_TR_FIELDS } from "./config";

function read(fd: FormData) {
  const trs = readTranslations(fd, FAQ_TR_FIELDS);
  for (const t of trs) if (!t.question || !t.answer) return { error: `Frage und Antwort erforderlich (${t.locale}).` };
  return {
    top: { category: strOrNull(fd, "category"), order: num(fd, "order"), published: bool(fd, "published") },
    trs: trs.map((t) => ({ locale: t.locale, question: t.question, answer: t.answer })),
  };
}

export async function createFaq(_p: CrudState, fd: FormData): Promise<CrudState> {
  const r = read(fd);
  if ("error" in r) return r;
  await prisma.faq.create({ data: { ...r.top, translations: { create: r.trs } } });
  revalidatePath("/admin/faq"); revalidateHome();
  redirect("/admin/faq");
}

export async function updateFaq(id: string, _p: CrudState, fd: FormData): Promise<CrudState> {
  const r = read(fd);
  if ("error" in r) return r;
  await prisma.faq.update({
    where: { id },
    data: { ...r.top, translations: { deleteMany: {}, create: r.trs } },
  });
  revalidatePath("/admin/faq"); revalidateHome();
  redirect("/admin/faq");
}

export async function deleteFaq(id: string) {
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/faq"); revalidateHome();
}

export async function toggleFaqPublished(id: string, published: boolean) {
  await prisma.faq.update({ where: { id }, data: { published } });
  revalidatePath("/admin/faq"); revalidateHome();
}
