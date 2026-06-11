"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidateHome } from "@/features/admin/crud";
import { routing } from "@/i18n/routing";

export type EntityState = { error?: string };

function readTranslations(fd: FormData) {
  return routing.locales.map((locale) => ({
    locale,
    name: String(fd.get(`name_${locale}`) ?? "").trim(),
    slug: String(fd.get(`slug_${locale}`) ?? "").trim(),
    excerpt: String(fd.get(`excerpt_${locale}`) ?? "").trim() || null,
    content: String(fd.get(`content_${locale}`) ?? "").trim() || null,
  }));
}

function validate(trs: { locale: string; name: string; slug: string }[]): string | null {
  for (const t of trs) {
    if (!t.name || !t.slug) return `Name und Slug sind erforderlich (${t.locale}).`;
  }
  return null;
}

function topLevel(fd: FormData) {
  return {
    icon: String(fd.get("icon") ?? "").trim() || null,
    order: Number(fd.get("order") ?? 0) || 0,
    published: fd.get("published") === "on",
  };
}

export async function createService(_prev: EntityState, fd: FormData): Promise<EntityState> {
  const trs = readTranslations(fd);
  const err = validate(trs);
  if (err) return { error: err };
  try {
    await prisma.service.create({ data: { ...topLevel(fd), translations: { create: trs } } });
  } catch {
    return { error: "Speichern fehlgeschlagen — Slug evtl. nicht eindeutig." };
  }
  revalidatePath("/admin/services"); revalidateHome();
  redirect("/admin/services");
}

export async function updateService(
  id: string,
  _prev: EntityState,
  fd: FormData,
): Promise<EntityState> {
  const trs = readTranslations(fd);
  const err = validate(trs);
  if (err) return { error: err };
  try {
    await prisma.service.update({
      where: { id },
      data: { ...topLevel(fd), translations: { deleteMany: {}, create: trs } },
    });
  } catch {
    return { error: "Speichern fehlgeschlagen — Slug evtl. nicht eindeutig." };
  }
  revalidatePath("/admin/services"); revalidateHome();
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services"); revalidateHome();
}

export async function toggleServicePublished(id: string, published: boolean) {
  await prisma.service.update({ where: { id }, data: { published } });
  revalidatePath("/admin/services"); revalidateHome();
}
