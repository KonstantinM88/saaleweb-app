import { routing } from "@/i18n/routing";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { EntityForm, type EntityDefaults } from "@/widgets/admin/EntityForm";
import { createIndustry } from "@/features/admin/industries/actions";

const emptyDefaults: EntityDefaults = {
  primary: "",
  order: 0,
  published: true,
  translations: Object.fromEntries(
    routing.locales.map((l) => [l, { name: "", slug: "", excerpt: "", content: "" }]),
  ),
};

export default function NewIndustryPage() {
  return (
    <>
      <PageHeader title="Neue Branche" />
      <EntityForm
        action={createIndustry}
        defaults={emptyDefaults}
        primaryName="emoji"
        primaryLabel="Emoji"
        submitLabel="Erstellen"
      />
    </>
  );
}
