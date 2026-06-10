import { PageHeader } from "@/widgets/admin/PageHeader";
import { GenericForm, type GenericDefaults } from "@/widgets/admin/GenericForm";
import { createProjectCategory } from "@/features/admin/project-categories/actions";
import { projCatTopFields, projCatLocaleFields, PROJCAT_TR_FIELDS } from "@/features/admin/project-categories/config";
import { buildTranslationDefaults } from "@/features/admin/crud";
const defaults: GenericDefaults = { top: { key: "" }, translations: buildTranslationDefaults([], PROJCAT_TR_FIELDS) };
export default function NewProjectCategoryPage() {
  return (<><PageHeader title="Neue Projekt-Kategorie" /><GenericForm action={createProjectCategory} topFields={projCatTopFields} localeFields={projCatLocaleFields} defaults={defaults} submitLabel="Erstellen" /></>);
}
