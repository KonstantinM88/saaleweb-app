"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readTranslations, strOrNull, num, bool, type CrudState } from "@/features/admin/crud";
import { TESTI_TR_FIELDS } from "./config";

function revalidateTestimonialPages() {
  revalidatePath("/admin/testimonials");
  for (const path of ["/", "/de", "/en", "/ru"]) {
    revalidatePath(path);
  }
}

function read(fd: FormData) {
  const trs = readTranslations(fd, TESTI_TR_FIELDS);
  for (const t of trs) if (!t.quote || !t.clientName) return { error: `Zitat und Name erforderlich (${t.locale}).` };
  return {
    top: { rating: num(fd, "rating", 5), avatarUrl: strOrNull(fd, "avatarUrl"), order: num(fd, "order"), published: bool(fd, "published") },
    trs: trs.map((t) => ({ locale: t.locale, quote: t.quote, clientName: t.clientName, company: t.company || null })),
  };
}
export async function createTestimonial(_p: CrudState, fd: FormData): Promise<CrudState> {
  const r = read(fd); if ("error" in r) return r;
  await prisma.testimonial.create({ data: { ...r.top, translations: { create: r.trs } } });
  revalidateTestimonialPages(); redirect("/admin/testimonials");
}
export async function updateTestimonial(id: string, _p: CrudState, fd: FormData): Promise<CrudState> {
  const r = read(fd); if ("error" in r) return r;
  await prisma.testimonial.update({ where: { id }, data: { ...r.top, translations: { deleteMany: {}, create: r.trs } } });
  revalidateTestimonialPages(); redirect("/admin/testimonials");
}
export async function deleteTestimonial(id: string) { await prisma.testimonial.delete({ where: { id } }); revalidateTestimonialPages(); }
export async function toggleTestimonialPublished(id: string, published: boolean) { await prisma.testimonial.update({ where: { id }, data: { published } }); revalidateTestimonialPages(); }
