import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { ConfirmButton } from "@/widgets/admin/ConfirmButton";
import { adminBtnGhost, adminCard, adminInput } from "@/widgets/admin/ui";
import {
  blockAssistantIp,
  deleteAssistantConversation,
  unblockAssistantIp,
} from "@/features/admin/assistant/actions";
import { readAssistantSalesProfile } from "@/features/assistant/profile";

export const dynamic = "force-dynamic";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}

function locationLabel(item: { country: string | null; city: string | null; region: string | null }) {
  return [item.city, item.region, item.country].filter(Boolean).join(", ") || "-";
}

function preview(text?: string | null) {
  if (!text) return "-";
  return text.length > 120 ? `${text.slice(0, 120)}...` : text;
}

async function getData() {
  try {
    const [conversations, blockedIps] = await Promise.all([
      prisma.assistantConversation.findMany({
        orderBy: { lastMessageAt: "desc" },
        take: 80,
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      }),
      prisma.blockedIp.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    return { conversations, blockedIps };
  } catch {
    return { conversations: [], blockedIps: [] };
  }
}

export default async function AssistantConversationsAdminPage() {
  const { conversations, blockedIps } = await getData();
  const blockedSet = new Set(blockedIps.map((item) => item.ipAddress));

  return (
    <>
      <PageHeader
        title="AI-Dialoge"
        subtitle="Gespeicherte Gespräche mit dem öffentlichen SaaleWeb Assistenten."
      />

      <div className={`${adminCard} overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-surface text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Letzte Aktivität</th>
              <th className="px-4 py-3">Besucher</th>
              <th className="px-4 py-3">Kontext</th>
              <th className="px-4 py-3">Letzte Nachricht</th>
              <th className="px-4 py-3 text-right">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {conversations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Noch keine AI-Dialoge.
                </td>
              </tr>
            )}
            {conversations.map((conversation) => {
              const blocked = conversation.ipAddress ? blockedSet.has(conversation.ipAddress) : false;
              const profile = readAssistantSalesProfile(conversation.salesProfile);
              return (
                <tr key={conversation.id} className="border-b border-line align-top last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 text-muted">
                    {formatDate(conversation.lastMessageAt)}
                    <div className="text-xs text-line">{conversation.messageCount} Nachrichten</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs text-dark">{conversation.ipAddress ?? "no-ip"}</div>
                    <div className="mt-1 text-xs text-muted">{locationLabel(conversation)}</div>
                    <div className="mt-1 break-all text-[11px] text-line">{conversation.visitorKey}</div>
                    {blocked ? (
                      <span className="mt-2 inline-flex rounded-full bg-red-50 px-2 py-1 text-[11px] font-bold text-red-600">
                        blockiert
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    <div>Seite: {conversation.pagePath ?? "-"}</div>
                    <div>
                      Sprache: {conversation.locale} / Antwort: {conversation.responseLocale}
                    </div>
                    <div className="mt-1 font-semibold text-dark">
                      Funnel: {conversation.funnelStage}
                      {conversation.leadId ? " · Lead erstellt" : ""}
                    </div>
                    {profile.businessType && <div className="mt-1">Branche: {profile.businessType}</div>}
                    <div className="mt-1 max-w-[260px] truncate" title={conversation.userAgent ?? undefined}>
                      UA: {conversation.userAgent ?? "-"}
                    </div>
                  </td>
                  <td className="max-w-sm px-4 py-3 text-muted">
                    <p className="line-clamp-3">{preview(conversation.messages[0]?.content)}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-col items-end gap-2">
                      <Link href={`/admin/assistant/${conversation.id}`} className={adminBtnGhost}>
                        Lesen
                      </Link>
                      {conversation.ipAddress ? (
                        blocked ? (
                          <form action={unblockAssistantIp.bind(null, conversation.ipAddress)}>
                            <button className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-dark hover:bg-surface">
                              IP freigeben
                            </button>
                          </form>
                        ) : (
                          <form action={blockAssistantIp.bind(null, conversation.ipAddress)} className="flex gap-2">
                            <input
                              name="reason"
                              placeholder="Grund"
                              className={`${adminInput} h-8 w-32 text-xs`}
                            />
                            <ConfirmButton
                              message="Diese IP blockieren?"
                              className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              IP blockieren
                            </ConfirmButton>
                          </form>
                        )
                      ) : null}
                      <form action={deleteAssistantConversation.bind(null, conversation.id)}>
                        <ConfirmButton
                          message="Diesen AI-Dialog löschen?"
                          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Löschen
                        </ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-dark">Blockierte IPs</h2>
        <div className={`${adminCard} mt-4 overflow-x-auto`}>
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-surface text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">Grund</th>
                <th className="px-4 py-3">Seit</th>
                <th className="px-4 py-3 text-right">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {blockedIps.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted">
                    Keine blockierten IPs.
                  </td>
                </tr>
              )}
              {blockedIps.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-dark">{item.ipAddress}</td>
                  <td className="px-4 py-3 text-muted">{item.reason ?? "-"}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <form action={unblockAssistantIp.bind(null, item.ipAddress)}>
                      <button className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-dark hover:bg-surface">
                        Freigeben
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
