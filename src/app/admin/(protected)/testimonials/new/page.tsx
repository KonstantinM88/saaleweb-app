import { PageHeader } from "@/widgets/admin/PageHeader";
import { GenericForm, type GenericDefaults } from "@/widgets/admin/GenericForm";
import { createTestimonial } from "@/features/admin/testimonials/actions";
import { testiTopFields, testiLocaleFields, TESTI_TR_FIELDS } from "@/features/admin/testimonials/config";
import { buildTranslationDefaults } from "@/features/admin/crud";
const defaults: GenericDefaults = { top: { rating: 5, avatarUrl: "", order: 0, published: true }, translations: buildTranslationDefaults([], TESTI_TR_FIELDS) };
export default function NewTestimonialPage() {
  return (<><PageHeader title="Neues Testimonial" /><GenericForm action={createTestimonial} topFields={testiTopFields} localeFields={testiLocaleFields} defaults={defaults} submitLabel="Erstellen" /></>);
}
