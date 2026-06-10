import { PageHeader } from "@/widgets/admin/PageHeader";
import { GenericForm, type GenericDefaults } from "@/widgets/admin/GenericForm";
import { createFaq } from "@/features/admin/faq/actions";
import { faqTopFields, faqLocaleFields, FAQ_TR_FIELDS } from "@/features/admin/faq/config";
import { buildTranslationDefaults } from "@/features/admin/crud";

const defaults: GenericDefaults = {
  top: { category: "", order: 0, published: true },
  translations: buildTranslationDefaults([], FAQ_TR_FIELDS),
};

export default function NewFaqPage() {
  return (
    <>
      <PageHeader title="Neue FAQ" />
      <GenericForm action={createFaq} topFields={faqTopFields} localeFields={faqLocaleFields} defaults={defaults} submitLabel="Erstellen" />
    </>
  );
}
