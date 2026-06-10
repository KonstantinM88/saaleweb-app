import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { ConfirmButton } from "@/widgets/admin/ConfirmButton";
import { adminCard, adminBtnGhost } from "@/widgets/admin/ui";
import { deleteCategory } from "@/features/admin/categories/actions";
export const dynamic = "force-dynamic";
type Row = { id: string; key: string; translations: { locale: string; name: string }[] };
async function getRows(): Promise<Row[]> { try { return (await prisma.blogCategory.findMany({ include: { translations: true } })) as Row[]; } catch { return []; } }
export default async function CategoriesAdminPage() {
  const rows = await getRows();
  return (<>
    <PageHeader title="Blog-Kategorien" subtitle="Kategorien für Artikel (DE/EN/RU)." actionHref="/admin/categories/new" actionLabel="Neu" />
    <div className={`${adminCard} overflow-hidden`}><table className="w-full text-sm">
      <thead className="border-b border-line bg-surface text-left text-xs uppercase tracking-wide text-muted"><tr><th className="px-4 py-3">Name (DE)</th><th className="px-4 py-3">Key</th><th className="px-4 py-3 text-right">Aktionen</th></tr></thead>
      <tbody>
        {rows.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-muted">Noch keine Kategorien.</td></tr>}
        {rows.map((r) => { const de = r.translations.find((t) => t.locale === "de") ?? r.translations[0]; return (
          <tr key={r.id} className="border-b border-line last:border-0">
            <td className="px-4 py-3 font-medium text-dark">{de?.name ?? "—"}</td>
            <td className="px-4 py-3 font-mono text-xs text-muted">{r.key}</td>
            <td className="px-4 py-3"><div className="flex justify-end gap-2"><Link href={`/admin/categories/${r.id}`} className={adminBtnGhost}>Bearbeiten</Link><form action={deleteCategory.bind(null, r.id)}><ConfirmButton message="Kategorie löschen?" className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Löschen</ConfirmButton></form></div></td>
          </tr>); })}
      </tbody></table></div>
  </>);
}
