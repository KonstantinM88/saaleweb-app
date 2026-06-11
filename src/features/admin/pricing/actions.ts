"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LOCALES, str, num, bool, revalidateHome, type CrudState } from "@/features/admin/crud";

function read(fd: FormData) {
  const trs = LOCALES.map((locale) => ({
    locale,
    name: str(fd, `name_${locale}`),
    sub: str(fd, `sub_${locale}`) || null,
    price: str(fd, `price_${locale}`),
    features: str(fd, `features_${locale}`)
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean),
  }));
  for (const t of trs) if (!t.name || !t.price) return { error: `Name und Preis erforderlich (${t.locale}).` };
  return { top: { featured: bool(fd, "featured"), published: bool(fd, "published"), order: num(fd, "order") }, trs };
}

function revalidate() {
  revalidatePath("/admin/pricing");
  revalidateHome();
}

export async function createPricingPlan(_p: CrudState, fd: FormData): Promise<CrudState> {
  const r = read(fd); if ("error" in r) return r;
  await prisma.pricingPlan.create({ data: { ...r.top, translations: { create: r.trs } } });
  revalidate(); redirect("/admin/pricing");
}
export async function updatePricingPlan(id: string, _p: CrudState, fd: FormData): Promise<CrudState> {
  const r = read(fd); if ("error" in r) return r;
  await prisma.pricingPlan.update({ where: { id }, data: { ...r.top, translations: { deleteMany: {}, create: r.trs } } });
  revalidate(); redirect("/admin/pricing");
}
export async function deletePricingPlan(id: string) { await prisma.pricingPlan.delete({ where: { id } }); revalidate(); }
export async function togglePricingPublished(id: string, published: boolean) { await prisma.pricingPlan.update({ where: { id }, data: { published } }); revalidate(); }
