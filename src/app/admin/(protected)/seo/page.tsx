import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { ConfirmButton } from "@/widgets/admin/ConfirmButton";
import { adminCard, adminBtnGhost } from "@/widgets/admin/ui";
import { deleteSEOPage } from "@/features/admin/seo/actions";
export const dynamic = "force-dynamic";
type Row = { id: string; path: string; translations: { locale: string; title: string }[] };
async function getRows(): Promise<Row[]> { try { return (await prisma.sEOPage.findMany({ orderBy: { path: "asc" }, include: { translations: true } })) as Row[]; } catch { return []; } }
export default async function SeoAdminPage() {
  const rows = await getRows();
  return (<>
    <PageHeader title="SEO-Seiten" subtitle="Title / Description / OG-Bild pro Pfad (DE/EN/RU)." actionHref="/admin/seo/new" actionLabel="Neu" />
    <div className={`${adminCard} overflow-hidden`}><table className="w-full text-sm">
      <thead className="border-b border-line bg-surface text-left text-xs uppercase tracking-wide text-muted"><tr><th className="px-4 py-3">Pfad</th><th className="px-4 py-3">Title (DE)</th><th className="px-4 py-3 text-right">Aktionen</th></tr></thead>
      <tbody>
        {rows.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-muted">Noch keine Einträge.</td></tr>}
        {rows.map((r) => { const de = r.translations.find((t) => t.locale === "de") ?? r.translations[0]; return (
          <tr key={r.id} className="border-b border-line last:border-0">
            <td className="px-4 py-3 font-mono text-xs text-dark">{r.path}</td>
            <td className="px-4 py-3 text-muted">{de?.title ?? "—"}</td>
            <td className="px-4 py-3"><div className="flex justify-end gap-2"><Link href={`/admin/seo/${r.id}`} className={adminBtnGhost}>Bearbeiten</Link><form action={deleteSEOPage.bind(null, r.id)}><ConfirmButton message="Eintrag löschen?" className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Löschen</ConfirmButton></form></div></td>
          </tr>); })}
      </tbody></table></div>
  </>);
}
