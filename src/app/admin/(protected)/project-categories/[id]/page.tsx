import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { GenericForm, type GenericDefaults } from "@/widgets/admin/GenericForm";
import { updateProjectCategory } from "@/features/admin/project-categories/actions";
import { projCatTopFields, projCatLocaleFields, PROJCAT_TR_FIELDS } from "@/features/admin/project-categories/config";
import { buildTranslationDefaults } from "@/features/admin/crud";
export const dynamic = "force-dynamic";
type Entity = { id: string; key: string; translations: { locale: string; name: string }[] };
export default async function EditProjectCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; let e: Entity | null = null;
  try { e = (await prisma.projectCategory.findUnique({ where: { id }, include: { translations: true } })) as Entity | null; } catch { e = null; }
  if (!e) notFound();
  const defaults: GenericDefaults = { top: { key: e.key }, translations: buildTranslationDefaults(e.translations, PROJCAT_TR_FIELDS) };
  return (<><PageHeader title="Projekt-Kategorie bearbeiten" /><GenericForm action={updateProjectCategory.bind(null, id)} topFields={projCatTopFields} localeFields={projCatLocaleFields} defaults={defaults} submitLabel="Speichern" /></>);
}
