import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { ConfirmButton } from "@/widgets/admin/ConfirmButton";
import { adminCard, adminBtnGhost } from "@/widgets/admin/ui";
import { deleteSubscriber } from "@/features/admin/newsletter/actions";

export const dynamic = "force-dynamic";

type Subscriber = {
  id: string;
  email: string;
  locale: string;
  confirmed: boolean;
  createdAt: Date;
};

async function getSubscribers(): Promise<Subscriber[]> {
  try {
    return (await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    })) as Subscriber[];
  } catch {
    return [];
  }
}

export default async function NewsletterAdminPage() {
  const subscribers = await getSubscribers();
  const confirmed = subscribers.filter((s) => s.confirmed).length;
  const pending = subscribers.length - confirmed;

  return (
    <>
      <PageHeader
        title="Newsletter"
        subtitle={`Abonnenten mit Double-Opt-In. Bestätigt: ${confirmed} · Ausstehend: ${pending}`}
      />
      <div className="mb-4 flex justify-end">
        <a href="/admin/newsletter/export" className={adminBtnGhost} download>
          CSV Export
        </a>
      </div>
      <div className={`${adminCard} overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-surface text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Datum</th>
              <th className="px-4 py-3">E-Mail</th>
              <th className="px-4 py-3">Sprache</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Noch keine Abonnenten.
                </td>
              </tr>
            )}
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="border-b border-line align-middle last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-muted">
                  {new Date(subscriber.createdAt).toLocaleDateString("de-DE")}
                </td>
                <td className="px-4 py-3">
                  <a href={`mailto:${subscriber.email}`} className="font-medium text-dark">
                    {subscriber.email}
                  </a>
                </td>
                <td className="px-4 py-3 uppercase text-muted">{subscriber.locale}</td>
                <td className="px-4 py-3">
                  {subscriber.confirmed ? (
                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      Bestätigt
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      Ausstehend
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteSubscriber.bind(null, subscriber.id)}>
                    <ConfirmButton
                      message={`Abonnent ${subscriber.email} wirklich löschen?`}
                      className="text-xs text-muted transition-colors hover:text-red-600"
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
