import { prisma } from "@/lib/prisma";

export async function getProjectCategoryOptions(): Promise<{ value: string; label: string }[]> {
  try {
    const cats = (await prisma.projectCategory.findMany({
      include: { translations: true },
    })) as { id: string; key: string; translations: { locale: string; name: string }[] }[];
    return cats.map((c) => {
      const de = c.translations.find((t) => t.locale === "de") ?? c.translations[0];
      return { value: c.id, label: de?.name ?? c.key };
    });
  } catch {
    return [];
  }
}
