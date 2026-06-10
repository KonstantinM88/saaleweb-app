import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { GenericForm, type GenericDefaults } from "@/widgets/admin/GenericForm";
import { updateTestimonial } from "@/features/admin/testimonials/actions";
import { testiTopFields, testiLocaleFields, TESTI_TR_FIELDS } from "@/features/admin/testimonials/config";
import { buildTranslationDefaults } from "@/features/admin/crud";
export const dynamic = "force-dynamic";
type Entity = { id: string; rating: number; avatarUrl: string | null; order: number; published: boolean; translations: { locale: string; quote: string; clientName: string; company: string | null }[] };
export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; let e: Entity | null = null;
  try { e = (await prisma.testimonial.findUnique({ where: { id }, include: { translations: true } })) as Entity | null; } catch { e = null; }
  if (!e) notFound();
  const defaults: GenericDefaults = { top: { rating: e.rating, avatarUrl: e.avatarUrl ?? "", order: e.order, published: e.published }, translations: buildTranslationDefaults(e.translations, TESTI_TR_FIELDS) };
  return (<><PageHeader title="Testimonial bearbeiten" /><GenericForm action={updateTestimonial.bind(null, id)} topFields={testiTopFields} localeFields={testiLocaleFields} defaults={defaults} submitLabel="Speichern" /></>);
}
