import { PageHeader } from "@/widgets/admin/PageHeader";
import { GenericForm, type GenericDefaults } from "@/widgets/admin/GenericForm";
import { createPricingPlan } from "@/features/admin/pricing/actions";
import { pricingTopFields, pricingLocaleFields, PRICING_TR_FIELDS } from "@/features/admin/pricing/config";
import { buildTranslationDefaults } from "@/features/admin/crud";
const defaults: GenericDefaults = { top: { order: 0, featured: false, published: true }, translations: buildTranslationDefaults([], PRICING_TR_FIELDS) };
export default function NewPricingPage() {
  return (<><PageHeader title="Neues Preispaket" /><GenericForm action={createPricingPlan} topFields={pricingTopFields} localeFields={pricingLocaleFields} defaults={defaults} submitLabel="Erstellen" /></>);
}
