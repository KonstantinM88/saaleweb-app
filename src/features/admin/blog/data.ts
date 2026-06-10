import { prisma } from "@/lib/prisma";
import type { Option } from "@/widgets/admin/PostForm";

export async function getCategoryOptions(): Promise<Option[]> {
  try {
    const cats = (await prisma.blogCategory.findMany({
      include: { translations: true },
    })) as { id: string; translations: { locale: string; name: string }[] }[];
    return cats.map((c) => {
      const de = c.translations.find((t) => t.locale === "de") ?? c.translations[0];
      return { value: c.id, label: de?.name ?? c.id };
    });
  } catch {
    return [];
  }
}

export async function getAuthorOptions(): Promise<Option[]> {
  try {
    const authors = (await prisma.author.findMany()) as { id: string; name: string }[];
    return authors.map((a) => ({ value: a.id, label: a.name }));
  } catch {
    return [];
  }
}
