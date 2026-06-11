import { PageHeader } from "@/widgets/admin/PageHeader";
import { GenericForm, type GenericDefaults } from "@/widgets/admin/GenericForm";
import { createSEOPage } from "@/features/admin/seo/actions";
import { seoTopFields, seoLocaleFields, SEO_TR_FIELDS } from "@/features/admin/seo/config";
import { buildTranslationDefaults } from "@/features/admin/crud";
const defaults: GenericDefaults = { top: { path: "" }, translations: buildTranslationDefaults([], SEO_TR_FIELDS) };
export default function NewSeoPage() {
  return (<><PageHeader title="Neue SEO-Seite" /><GenericForm action={createSEOPage} topFields={seoTopFields} localeFields={seoLocaleFields} defaults={defaults} submitLabel="Erstellen" /></>);
}
