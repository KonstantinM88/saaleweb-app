import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { GenericForm, type GenericDefaults } from "@/widgets/admin/GenericForm";
import { updateProject } from "@/features/admin/projects/actions";
import { projectTopFields, projectLocaleFields, PROJECT_TR_FIELDS } from "@/features/admin/projects/config";
import { getProjectCategoryOptions } from "@/features/admin/projects/data";
import { buildTranslationDefaults } from "@/features/admin/crud";
export const dynamic = "force-dynamic";
type Tr = { locale: string; title: string; slug: string; challenge: string | null; solution: string | null; results: string | null };
type Entity = { id: string; categoryId: string | null; coverColor: string | null; technologies: string[]; resultValue: string | null; year: number | null; featured: boolean; published: boolean; order: number; translations: Tr[] };
export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; let e: Entity | null = null;
  try { e = (await prisma.project.findUnique({ where: { id }, include: { translations: true } })) as Entity | null; } catch { e = null; }
  if (!e) notFound();
  const options = await getProjectCategoryOptions();
  const defaults: GenericDefaults = {
    top: {
      categoryId: e.categoryId ?? "", coverColor: e.coverColor ?? "",
      technologies: e.technologies.join(", "), resultValue: e.resultValue ?? "",
      year: e.year != null ? String(e.year) : "", order: e.order,
      featured: e.featured, published: e.published,
    },
    translations: buildTranslationDefaults(e.translations, PROJECT_TR_FIELDS),
  };
  return (<><PageHeader title="Projekt bearbeiten" /><GenericForm action={updateProject.bind(null, id)} topFields={projectTopFields(options)} localeFields={projectLocaleFields} defaults={defaults} submitLabel="Speichern" /></>);
}
