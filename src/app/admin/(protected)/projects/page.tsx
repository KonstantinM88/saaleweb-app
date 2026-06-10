import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { ConfirmButton } from "@/widgets/admin/ConfirmButton";
import { adminCard, adminBtnGhost } from "@/widgets/admin/ui";
import { deleteProject, toggleProjectPublished } from "@/features/admin/projects/actions";
export const dynamic = "force-dynamic";
type Row = { id: string; year: number | null; featured: boolean; published: boolean; translations: { locale: string; title: string }[] };
async function getRows(): Promise<Row[]> { try { return (await prisma.project.findMany({ orderBy: { order: "asc" }, include: { translations: true } })) as Row[]; } catch { return []; } }
export default async function ProjectsAdminPage() {
  const rows = await getRows();
  return (<>
    <PageHeader title="Projekte / Cases" subtitle="Referenzen & Fallstudien (DE/EN/RU)." actionHref="/admin/projects/new" actionLabel="Neu" />
    <div className={`${adminCard} overflow-hidden`}><table className="w-full text-sm">
      <thead className="border-b border-line bg-surface text-left text-xs uppercase tracking-wide text-muted"><tr><th className="px-4 py-3">Titel (DE)</th><th className="px-4 py-3">Jahr</th><th className="px-4 py-3">Featured</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Aktionen</th></tr></thead>
      <tbody>
        {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">Noch keine Projekte.</td></tr>}
        {rows.map((r) => { const de = r.translations.find((t) => t.locale === "de") ?? r.translations[0]; return (
          <tr key={r.id} className="border-b border-line last:border-0">
            <td className="px-4 py-3 font-medium text-dark">{de?.title ?? "—"}</td>
            <td className="px-4 py-3 text-muted">{r.year ?? "—"}</td>
            <td className="px-4 py-3 text-muted">{r.featured ? "★" : "—"}</td>
            <td className="px-4 py-3"><form action={toggleProjectPublished.bind(null, r.id, !r.published)}><button className={r.published ? "rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700" : "rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500"}>{r.published ? "Online" : "Entwurf"}</button></form></td>
            <td className="px-4 py-3"><div className="flex justify-end gap-2"><Link href={`/admin/projects/${r.id}`} className={adminBtnGhost}>Bearbeiten</Link><form action={deleteProject.bind(null, r.id)}><ConfirmButton message="Projekt löschen?" className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Löschen</ConfirmButton></form></div></td>
          </tr>); })}
      </tbody></table></div>
  </>);
}
