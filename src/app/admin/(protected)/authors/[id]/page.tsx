import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { GenericForm, type GenericDefaults } from "@/widgets/admin/GenericForm";
import { updateAuthor } from "@/features/admin/authors/actions";
import { authorTopFields, authorLocaleFields, AUTHOR_TR_FIELDS } from "@/features/admin/authors/config";
import { buildTranslationDefaults } from "@/features/admin/crud";
export const dynamic = "force-dynamic";
type Entity = { id: string; name: string; avatarUrl: string | null; translations: { locale: string; role: string; bio: string }[] };
export default async function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; let e: Entity | null = null;
  try { e = (await prisma.author.findUnique({ where: { id }, include: { translations: true } })) as Entity | null; } catch { e = null; }
  if (!e) notFound();
  const defaults: GenericDefaults = { top: { name: e.name, avatarUrl: e.avatarUrl ?? "" }, translations: buildTranslationDefaults(e.translations, AUTHOR_TR_FIELDS) };
  return (<><PageHeader title="Autor bearbeiten" /><GenericForm action={updateAuthor.bind(null, id)} topFields={authorTopFields} localeFields={authorLocaleFields} defaults={defaults} submitLabel="Speichern" /></>);
}
