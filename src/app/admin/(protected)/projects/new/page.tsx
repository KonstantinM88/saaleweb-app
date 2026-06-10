import { PageHeader } from "@/widgets/admin/PageHeader";
import { GenericForm, type GenericDefaults } from "@/widgets/admin/GenericForm";
import { createProject } from "@/features/admin/projects/actions";
import { projectTopFields, projectLocaleFields, PROJECT_TR_FIELDS } from "@/features/admin/projects/config";
import { getProjectCategoryOptions } from "@/features/admin/projects/data";
import { buildTranslationDefaults } from "@/features/admin/crud";
export const dynamic = "force-dynamic";
const defaults: GenericDefaults = {
  top: { categoryId: "", coverColor: "", technologies: "", resultValue: "", year: "", order: 0, featured: false, published: false },
  translations: buildTranslationDefaults([], PROJECT_TR_FIELDS),
};
export default async function NewProjectPage() {
  const options = await getProjectCategoryOptions();
  return (<><PageHeader title="Neues Projekt" /><GenericForm action={createProject} topFields={projectTopFields(options)} localeFields={projectLocaleFields} defaults={defaults} submitLabel="Erstellen" /></>);
}
