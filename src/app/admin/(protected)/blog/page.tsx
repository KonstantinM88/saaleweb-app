import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { ConfirmButton } from "@/widgets/admin/ConfirmButton";
import { adminCard, adminBtnGhost } from "@/widgets/admin/ui";
import { deletePost, togglePostPublished } from "@/features/admin/blog/actions";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  published: boolean;
  publishedAt: Date | null;
  translations: { locale: string; title: string }[];
  category: { translations: { locale: string; name: string }[] } | null;
};

async function getRows(): Promise<Row[]> {
  try {
    return (await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { translations: true, category: { include: { translations: true } } },
    })) as Row[];
  } catch {
    return [];
  }
}

export default async function BlogAdminPage() {
  const rows = await getRows();

  return (
    <>
      <PageHeader
        title="Blog"
        subtitle="Artikel verwalten (DE/EN/RU)."
        actionHref="/admin/blog/new"
        actionLabel="Neu"
      />
      <div className={`${adminCard} overflow-hidden`}>
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-surface text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Titel (DE)</th>
              <th className="px-4 py-3">Kategorie</th>
              <th className="px-4 py-3">Datum</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Noch keine Artikel.
                </td>
              </tr>
            )}
            {rows.map((r) => {
              const de = r.translations.find((t) => t.locale === "de") ?? r.translations[0];
              const cat = r.category?.translations.find((t) => t.locale === "de");
              return (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-dark">{de?.title ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{cat?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">
                    {r.publishedAt ? new Date(r.publishedAt).toLocaleDateString("de-DE") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <form action={togglePostPublished.bind(null, r.id, !r.published)}>
                      <button
                        className={
                          r.published
                            ? "rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700"
                            : "rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500"
                        }
                      >
                        {r.published ? "Online" : "Entwurf"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/blog/${r.id}`} className={adminBtnGhost}>
                        Bearbeiten
                      </Link>
                      <form action={deletePost.bind(null, r.id)}>
                        <ConfirmButton
                          message="Diesen Artikel wirklich löschen?"
                          className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
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
    </>
  );
}
