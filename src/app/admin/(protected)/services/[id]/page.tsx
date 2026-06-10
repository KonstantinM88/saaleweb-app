import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { EntityForm, type EntityDefaults } from "@/widgets/admin/EntityForm";
import { updateService } from "@/features/admin/services/actions";

export const dynamic = "force-dynamic";

type Tr = { locale: string; name: string; slug: string; excerpt: string | null; content: string | null };
type Entity = { id: string; icon: string | null; order: number; published: boolean; translations: Tr[] };

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let entity: Entity | null = null;
  try {
    entity = (await prisma.service.findUnique({
      where: { id },
      include: { translations: true },
    })) as Entity | null;
  } catch {
    entity = null;
  }
  if (!entity) notFound();

  const defaults: EntityDefaults = {
    primary: entity.icon ?? "",
    order: entity.order,
    published: entity.published,
    translations: Object.fromEntries(
      routing.locales.map((l) => {
        const t = entity!.translations.find((x) => x.locale === l);
        return [
          l,
          {
            name: t?.name ?? "",
            slug: t?.slug ?? "",
            excerpt: t?.excerpt ?? "",
            content: t?.content ?? "",
          },
        ];
      }),
    ),
  };

  return (
    <>
      <PageHeader title="Leistung bearbeiten" />
      <EntityForm
        action={updateService.bind(null, id)}
        defaults={defaults}
        primaryName="icon"
        primaryLabel="Icon (Name)"
        submitLabel="Speichern"
      />
    </>
  );
}
