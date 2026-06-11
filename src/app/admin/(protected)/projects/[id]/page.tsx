import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { GenericForm, type GenericDefaults } from "@/widgets/admin/GenericForm";
import { ConfirmButton } from "@/widgets/admin/ConfirmButton";
import { MediaUploader } from "@/widgets/admin/MediaUploader";
import { adminCard, adminInput } from "@/widgets/admin/ui";
import { updateProject } from "@/features/admin/projects/actions";
import { updateProjectMedia, deleteProjectMedia } from "@/features/admin/projects/media";
import { projectTopFields, projectLocaleFields, PROJECT_TR_FIELDS } from "@/features/admin/projects/config";
import { getProjectCategoryOptions } from "@/features/admin/projects/data";
import { buildTranslationDefaults } from "@/features/admin/crud";

export const dynamic = "force-dynamic";

type Tr = { locale: string; title: string; slug: string; challenge: string | null; solution: string | null; results: string | null };
type MediaItem = { id: string; url: string; alt: string | null; order: number };
type Entity = {
  id: string; categoryId: string | null; coverColor: string | null; technologies: string[];
  resultValue: string | null; year: number | null; featured: boolean; published: boolean; order: number;
  translations: Tr[]; media: MediaItem[];
};

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let e: Entity | null = null;
  try {
    e = (await prisma.project.findUnique({
      where: { id },
      include: { translations: true, media: { orderBy: { order: "asc" } } },
    })) as Entity | null;
  } catch {
    e = null;
  }
  if (!e) notFound();

  const options = await getProjectCategoryOptions();
  const defaults: GenericDefaults = {
    top: {
      categoryId: e.categoryId ?? "", coverColor: e.coverColor ?? "",
      technologies: e.technologies.join(", "), resultValue: e.resultValue ?? "",
      year: e.year != null ? String(e.year) : "", order: e.order,
      featured: e.featured, published: e.published,
    },
    translations: buildTranslationDefaults(e.translations, PROJECT_TR_FIELDS),
  };

  return (
    <>
      <PageHeader title="Projekt bearbeiten" />
      <GenericForm
        action={updateProject.bind(null, id)}
        topFields={projectTopFields(options)}
        localeFields={projectLocaleFields}
        defaults={defaults}
        submitLabel="Speichern"
      />

      <section className="mt-10 max-w-3xl">
        <h2 className="text-lg font-bold text-dark">Medien (Cover &amp; Galerie)</h2>
        <p className="mt-1 text-sm text-muted">
          Bild mit der kleinsten Reihenfolge wird als Cover verwendet, die übrigen als Galerie.
        </p>

        <div className={`${adminCard} mt-4 divide-y divide-line`}>
          {e.media.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-muted">Noch keine Bilder.</p>
          )}
          {e.media.map((m, i) => (
            <div key={m.id} className="flex flex-wrap items-center gap-4 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt={m.alt ?? ""} className="h-16 w-24 rounded-lg border border-line object-cover" />
              {i === 0 && (
                <span className="rounded-md bg-brand-soft px-2 py-1 text-xs font-semibold text-brand-purple">
                  Cover
                </span>
              )}
              <form
                action={updateProjectMedia.bind(null, m.id, id)}
                className="flex flex-1 flex-wrap items-end gap-3"
              >
                <label className="flex-1 text-xs font-medium text-ink">
                  Alt-Text
                  <input name="alt" defaultValue={m.alt ?? ""} className={adminInput} />
                </label>
                <label className="w-24 text-xs font-medium text-ink">
                  Reihenfolge
                  <input type="number" name="order" defaultValue={m.order} className={adminInput} />
                </label>
                <button className="rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium hover:border-brand-purple">
                  OK
                </button>
              </form>
              <form action={deleteProjectMedia.bind(null, m.id, id)}>
                <ConfirmButton
                  message="Bild löschen?"
                  className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Löschen
                </ConfirmButton>
              </form>
            </div>
          ))}
        </div>

        <MediaUploader projectId={id} />
      </section>
    </>
  );
}
