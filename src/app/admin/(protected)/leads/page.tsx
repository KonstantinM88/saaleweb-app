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
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  source: string | null;
  status: string;
  locale: string;
  createdAt: Date;
  attribution: {
    firstSource: string | null;
    firstMedium: string | null;
    firstLandingPage: string | null;
    lastSource: string | null;
    lastMedium: string | null;
    lastChannel: string | null;
    lastCampaign: string | null;
    conversionPage: string | null;
    deviceCategory: string | null;
    captureMode: string | null;
  } | null;
};

async function getLeads(): Promise<Lead[]> {
  try {
    return (await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: { attribution: true },
    })) as Lead[];
  } catch {
    return [];
  }
}

export default async function LeadsAdminPage() {
  const leads = await getLeads();

  return (
    <>
      <PageHeader title="Anfragen" subtitle="Eingegangene Leads aus Formularen und dem AI-Assistenten." />
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
              <th className="px-4 py-3">Attribution</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
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
                  {l.email && (
                    <a href={`mailto:${l.email}`} className="block text-xs text-brand-purple">
                      {l.email}
                    </a>
                  )}
                  {l.phone && (
                    <a href={`tel:${l.phone}`} className="block text-xs text-brand-purple">
                      {l.phone}
                    </a>
                  )}
                  {l.company && <div className="text-xs text-muted">{l.company}</div>}
                  {l.source && <div className="text-[11px] text-line">{l.source}</div>}
                </td>
                <td className="max-w-xs px-4 py-3 text-muted">
                  <p className="line-clamp-3">{l.message ?? "—"}</p>
                </td>
                <td className="min-w-64 px-4 py-3 text-xs leading-relaxed text-muted">
                  {l.attribution ? (
                    <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
                      <dt className="font-semibold text-dark">Channel</dt>
                      <dd>{l.attribution.lastChannel || "—"}</dd>
                      <dt className="font-semibold text-dark">First</dt>
                      <dd>{[l.attribution.firstSource, l.attribution.firstMedium].filter(Boolean).join(" / ") || "—"}</dd>
                      <dt className="font-semibold text-dark">First landing</dt>
                      <dd className="break-all">{l.attribution.firstLandingPage || "—"}</dd>
                      <dt className="font-semibold text-dark">Last</dt>
                      <dd>{[l.attribution.lastSource, l.attribution.lastMedium].filter(Boolean).join(" / ") || "—"}</dd>
                      <dt className="font-semibold text-dark">Campaign</dt>
                      <dd>{l.attribution.lastCampaign || "—"}</dd>
                      <dt className="font-semibold text-dark">Conversion</dt>
                      <dd className="break-all">{l.attribution.conversionPage || "—"}</dd>
                      <dt className="font-semibold text-dark">Device</dt>
                      <dd>{l.attribution.deviceCategory || "—"}</dd>
                      <dt className="font-semibold text-dark">Mode</dt>
                      <dd>{l.attribution.captureMode || "—"}</dd>
                    </dl>
                  ) : (
                    <span>Keine Daten</span>
                  )}
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
