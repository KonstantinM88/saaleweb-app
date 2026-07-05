import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { ConfirmButton } from "@/widgets/admin/ConfirmButton";
import { adminBtnGhost, adminCard, adminInput } from "@/widgets/admin/ui";
import {
  blockAssistantIp,
  deleteAssistantConversation,
  unblockAssistantIp,
} from "@/features/admin/assistant/actions";

export const dynamic = "force-dynamic";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(value);
}

function locationLabel(item: { country: string | null; city: string | null; region: string | null }) {
  return [item.city, item.region, item.country].filter(Boolean).join(", ") || "-";
}

export default async function AssistantConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const conversation = await prisma.assistantConversation.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!conversation) notFound();

  const blocked = conversation.ipAddress
    ? await prisma.blockedIp.findUnique({ where: { ipAddress: conversation.ipAddress } })
    : null;

  return (
    <>
      <PageHeader
        title="AI-Dialog lesen"
        subtitle={`Besucher ${conversation.ipAddress ?? conversation.visitorKey}`}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/admin/assistant" className={adminBtnGhost}>
          Zur Übersicht
        </Link>
        {conversation.ipAddress ? (
          blocked ? (
            <form action={unblockAssistantIp.bind(null, conversation.ipAddress)}>
              <button className="rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-dark hover:bg-surface">
                IP freigeben
              </button>
            </form>
          ) : (
            <form action={blockAssistantIp.bind(null, conversation.ipAddress)} className="flex flex-wrap gap-2">
              <input name="reason" placeholder="Grund" className={`${adminInput} w-52`} />
              <ConfirmButton
                message="Diese IP blockieren?"
                className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                IP blockieren
              </ConfirmButton>
            </form>
          )
        ) : null}
        <form action={deleteAssistantConversation.bind(null, conversation.id)}>
          <ConfirmButton
            message="Diesen AI-Dialog löschen?"
            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Dialog löschen
          </ConfirmButton>
        </form>
      </div>

      <section className={`${adminCard} p-5`}>
        <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">IP</dt>
            <dd className="mt-1 font-mono text-dark">{conversation.ipAddress ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Ort</dt>
            <dd className="mt-1 text-dark">{locationLabel(conversation)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Sprache</dt>
            <dd className="mt-1 text-dark">
              {conversation.locale} / {conversation.responseLocale}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Status</dt>
            <dd className="mt-1 text-dark">{blocked ? `Blockiert: ${blocked.reason ?? "-"}` : "Nicht blockiert"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-muted">Besucher-ID</dt>
            <dd className="mt-1 break-all font-mono text-xs text-dark">{conversation.visitorKey}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Seite</dt>
            <dd className="mt-1 text-dark">{conversation.pagePath ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Letzte Aktivität</dt>
            <dd className="mt-1 text-dark">{formatDate(conversation.lastMessageAt)}</dd>
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <dt className="text-xs uppercase tracking-wide text-muted">User Agent</dt>
            <dd className="mt-1 break-all text-xs text-muted">{conversation.userAgent ?? "-"}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 space-y-3">
        {conversation.messages.length === 0 && (
          <div className={`${adminCard} p-6 text-center text-sm text-muted`}>Keine Nachrichten.</div>
        )}
        {conversation.messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <article
              key={message.id}
              className={`${adminCard} p-4 ${isUser ? "border-brand-purple/30 bg-brand-soft/30" : "bg-white"}`}
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                <span className="font-bold uppercase tracking-wide text-dark">{isUser ? "Besucher" : "Assistent"}</span>
                <span>
                  {formatDate(message.createdAt)}
                  {message.model ? ` · ${message.model}` : ""}
                  {message.responseLocale ? ` · ${message.responseLocale}` : ""}
                  {message.scoped === false ? " · off-topic" : ""}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-dark">{message.content}</p>
            </article>
          );
        })}
      </section>
    </>
  );
}
