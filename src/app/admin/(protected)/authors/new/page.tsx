import { PageHeader } from "@/widgets/admin/PageHeader";
import { GenericForm, type GenericDefaults } from "@/widgets/admin/GenericForm";
import { createAuthor } from "@/features/admin/authors/actions";
import { authorTopFields, authorLocaleFields, AUTHOR_TR_FIELDS } from "@/features/admin/authors/config";
import { buildTranslationDefaults } from "@/features/admin/crud";
const defaults: GenericDefaults = { top: { name: "", avatarUrl: "" }, translations: buildTranslationDefaults([], AUTHOR_TR_FIELDS) };
export default function NewAuthorPage() {
  return (<><PageHeader title="Neuer Autor" /><GenericForm action={createAuthor} topFields={authorTopFields} localeFields={authorLocaleFields} defaults={defaults} submitLabel="Erstellen" /></>);
}
