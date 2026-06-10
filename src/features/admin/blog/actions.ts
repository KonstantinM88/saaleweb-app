"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";

export type PostState = { error?: string };

function readTranslations(fd: FormData) {
  return routing.locales.map((locale) => ({
    locale,
    title: String(fd.get(`title_${locale}`) ?? "").trim(),
    slug: String(fd.get(`slug_${locale}`) ?? "").trim(),
    excerpt: String(fd.get(`excerpt_${locale}`) ?? "").trim() || null,
    content: String(fd.get(`content_${locale}`) ?? "").trim(),
  }));
}

function validate(trs: { locale: string; title: string; slug: string; content: string }[]): string | null {
  for (const t of trs) {
    if (!t.title || !t.slug || !t.content)
      return `Titel, Slug und Inhalt sind erforderlich (${t.locale}).`;
  }
  return null;
}

function topLevel(fd: FormData) {
  const publishedAt = String(fd.get("publishedAt") ?? "").trim();
  const readingTime = String(fd.get("readingTime") ?? "").trim();
  return {
    coverImage: String(fd.get("coverImage") ?? "").trim() || null,
    readingTime: readingTime ? Number(readingTime) : null,
    published: fd.get("published") === "on",
    publishedAt: publishedAt ? new Date(publishedAt) : null,
    categoryId: String(fd.get("categoryId") ?? "").trim() || null,
    authorId: String(fd.get("authorId") ?? "").trim() || null,
  };
}

export async function createPost(_prev: PostState, fd: FormData): Promise<PostState> {
  const trs = readTranslations(fd);
  const err = validate(trs);
  if (err) return { error: err };
  try {
    await prisma.blogPost.create({ data: { ...topLevel(fd), translations: { create: trs } } });
  } catch {
    return { error: "Speichern fehlgeschlagen — Slug evtl. nicht eindeutig." };
  }
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updatePost(
  id: string,
  _prev: PostState,
  fd: FormData,
): Promise<PostState> {
  const trs = readTranslations(fd);
  const err = validate(trs);
  if (err) return { error: err };
  try {
    await prisma.blogPost.update({
      where: { id },
      data: { ...topLevel(fd), translations: { deleteMany: {}, create: trs } },
    });
  } catch {
    return { error: "Speichern fehlgeschlagen — Slug evtl. nicht eindeutig." };
  }
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deletePost(id: string) {
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
}

export async function togglePostPublished(id: string, published: boolean) {
  await prisma.blogPost.update({ where: { id }, data: { published } });
  revalidatePath("/admin/blog");
}
