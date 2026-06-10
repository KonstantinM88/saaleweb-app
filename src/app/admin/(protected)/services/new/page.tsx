import { routing } from "@/i18n/routing";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { EntityForm, type EntityDefaults } from "@/widgets/admin/EntityForm";
import { createService } from "@/features/admin/services/actions";

const emptyDefaults: EntityDefaults = {
  primary: "",
  order: 0,
  published: true,
  translations: Object.fromEntries(
    routing.locales.map((l) => [l, { name: "", slug: "", excerpt: "", content: "" }]),
  ),
};

export default function NewServicePage() {
  return (
    <>
      <PageHeader title="Neue Leistung" />
      <EntityForm
        action={createService}
        defaults={emptyDefaults}
        primaryName="icon"
        primaryLabel="Icon (Name)"
        submitLabel="Erstellen"
      />
    </>
  );
}
