import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { GenericForm, type GenericDefaults } from "@/widgets/admin/GenericForm";
import { updateSEOPage } from "@/features/admin/seo/actions";
import { seoTopFields, seoLocaleFields, SEO_TR_FIELDS } from "@/features/admin/seo/config";
import { buildTranslationDefaults } from "@/features/admin/crud";
export const dynamic = "force-dynamic";
type Entity = { id: string; path: string; translations: { locale: string; title: string; description: string; ogImage: string | null }[] };
export default async function EditSeoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; let e: Entity | null = null;
  try { e = (await prisma.sEOPage.findUnique({ where: { id }, include: { translations: true } })) as Entity | null; } catch { e = null; }
  if (!e) notFound();
  const defaults: GenericDefaults = { top: { path: e.path }, translations: buildTranslationDefaults(e.translations, SEO_TR_FIELDS) };
  return (<><PageHeader title="SEO-Seite bearbeiten" /><GenericForm action={updateSEOPage.bind(null, id)} topFields={seoTopFields} localeFields={seoLocaleFields} defaults={defaults} submitLabel="Speichern" /></>);
}
