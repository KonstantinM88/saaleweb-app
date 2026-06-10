import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { GenericForm, type GenericDefaults } from "@/widgets/admin/GenericForm";
import { updateFaq } from "@/features/admin/faq/actions";
import { faqTopFields, faqLocaleFields, FAQ_TR_FIELDS } from "@/features/admin/faq/config";
import { buildTranslationDefaults } from "@/features/admin/crud";

export const dynamic = "force-dynamic";

type Entity = { id: string; category: string | null; order: number; published: boolean; translations: { locale: string; question: string; answer: string }[] };

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let e: Entity | null = null;
  try {
    e = (await prisma.faq.findUnique({ where: { id }, include: { translations: true } })) as Entity | null;
  } catch {
    e = null;
  }
  if (!e) notFound();

  const defaults: GenericDefaults = {
    top: { category: e.category ?? "", order: e.order, published: e.published },
    translations: buildTranslationDefaults(e.translations, FAQ_TR_FIELDS),
  };

  return (
    <>
      <PageHeader title="FAQ bearbeiten" />
      <GenericForm action={updateFaq.bind(null, id)} topFields={faqTopFields} localeFields={faqLocaleFields} defaults={defaults} submitLabel="Speichern" />
    </>
  );
}
