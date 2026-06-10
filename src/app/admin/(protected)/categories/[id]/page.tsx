import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { GenericForm, type GenericDefaults } from "@/widgets/admin/GenericForm";
import { updateCategory } from "@/features/admin/categories/actions";
import { catTopFields, catLocaleFields, CAT_TR_FIELDS } from "@/features/admin/categories/config";
import { buildTranslationDefaults } from "@/features/admin/crud";
export const dynamic = "force-dynamic";
type Entity = { id: string; key: string; translations: { locale: string; name: string; slug: string }[] };
export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; let e: Entity | null = null;
  try { e = (await prisma.blogCategory.findUnique({ where: { id }, include: { translations: true } })) as Entity | null; } catch { e = null; }
  if (!e) notFound();
  const defaults: GenericDefaults = { top: { key: e.key }, translations: buildTranslationDefaults(e.translations, CAT_TR_FIELDS) };
  return (<><PageHeader title="Kategorie bearbeiten" /><GenericForm action={updateCategory.bind(null, id)} topFields={catTopFields} localeFields={catLocaleFields} defaults={defaults} submitLabel="Speichern" /></>);
}
