import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { ConfirmButton } from "@/widgets/admin/ConfirmButton";
import { adminCard, adminBtnGhost } from "@/widgets/admin/ui";
import { updateLeadStatus, deleteLead } from "@/features/admin/leads/actions";
import { LEAD_STATUSES } from "@/features/admin/leads/constants";

export const dynamic = "force-dynamic";

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string | null;
  source: string | null;
  status: string;
  locale: string;
  createdAt: Date;
};

async function getLeads(): Promise<Lead[]> {
  try {
    return (await prisma.lead.findMany({ orderBy: { createdAt: "desc" } })) as Lead[];
  } catch {
    return [];
  }
}

export default async function LeadsAdminPage() {
  const leads = await getLeads();

  return (
    <>
      <PageHeader title="Anfragen" subtitle="Eingegangene Leads aus dem Kontaktformular." />
      <div className="mb-4 flex justify-end">
        <a href="/admin/leads/export" className={adminBtnGhost} download>
          CSV Export
        </a>
      </div>
      <div className={`${adminCard} overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-surface text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Datum</th>
              <th className="px-4 py-3">Kontakt</th>
              <th className="px-4 py-3">Nachricht</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Noch keine Anfragen.
                </td>
              </tr>
            )}
            {leads.map((l) => (
              <tr key={l.id} className="border-b border-line align-top last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-muted">
                  {new Date(l.createdAt).toLocaleDateString("de-DE")}
                  <div className="text-xs uppercase text-line">{l.locale}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-dark">{l.name}</div>
                  <a href={`mailto:${l.email}`} className="text-xs text-brand-purple">
                    {l.email}
                  </a>
                  {l.company && <div className="text-xs text-muted">{l.company}</div>}
                  {l.source && <div className="text-[11px] text-line">{l.source}</div>}
                </td>
                <td className="max-w-xs px-4 py-3 text-muted">
                  <p className="line-clamp-3">{l.message ?? "—"}</p>
                </td>
                <td className="px-4 py-3">
                  <form action={updateLeadStatus.bind(null, l.id)} className="flex items-center gap-2">
                    <select
                      name="status"
                      defaultValue={l.status}
                      className="rounded-lg border border-line bg-white px-2 py-1.5 text-xs"
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button className="rounded-md border border-line px-2 py-1.5 text-xs font-medium hover:border-brand-purple">
                      OK
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteLead.bind(null, l.id)}>
                    <ConfirmButton
                      message="Diese Anfrage löschen?"
                      className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Löschen
                    </ConfirmButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
