import { PageHeader } from "@/widgets/admin/PageHeader";
import { GenericForm, type GenericDefaults } from "@/widgets/admin/GenericForm";
import { createCategory } from "@/features/admin/categories/actions";
import { catTopFields, catLocaleFields, CAT_TR_FIELDS } from "@/features/admin/categories/config";
import { buildTranslationDefaults } from "@/features/admin/crud";
const defaults: GenericDefaults = { top: { key: "" }, translations: buildTranslationDefaults([], CAT_TR_FIELDS) };
export default function NewCategoryPage() {
  return (<><PageHeader title="Neue Kategorie" /><GenericForm action={createCategory} topFields={catTopFields} localeFields={catLocaleFields} defaults={defaults} submitLabel="Erstellen" /></>);
}
