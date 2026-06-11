import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { GenericForm, type GenericDefaults } from "@/widgets/admin/GenericForm";
import { updatePricingPlan } from "@/features/admin/pricing/actions";
import { pricingTopFields, pricingLocaleFields } from "@/features/admin/pricing/config";
export const dynamic = "force-dynamic";
type Tr = { locale: string; name: string; sub: string | null; price: string; features: string[] };
type Entity = { id: string; featured: boolean; published: boolean; order: number; translations: Tr[] };
export default async function EditPricingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; let e: Entity | null = null;
  try { e = (await prisma.pricingPlan.findUnique({ where: { id }, include: { translations: true } })) as Entity | null; } catch { e = null; }
  if (!e) notFound();
  const translations = Object.fromEntries(
    routing.locales.map((l) => {
      const t = e!.translations.find((x) => x.locale === l);
      return [l, { name: t?.name ?? "", sub: t?.sub ?? "", price: t?.price ?? "", features: (t?.features ?? []).join("\n") }];
    }),
  );
  const defaults: GenericDefaults = { top: { order: e.order, featured: e.featured, published: e.published }, translations };
  return (<><PageHeader title="Preispaket bearbeiten" /><GenericForm action={updatePricingPlan.bind(null, id)} topFields={pricingTopFields} localeFields={pricingLocaleFields} defaults={defaults} submitLabel="Speichern" /></>);
}
