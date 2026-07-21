import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/session";
import { getAdminLocale } from "@/features/admin/i18n.server";
import { AdminLocaleProvider } from "@/features/admin/AdminLocaleProvider";
import { AdminShell } from "@/widgets/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const locale = await getAdminLocale();

  return (
    <AdminLocaleProvider initialLocale={locale}>
      <AdminShell email={session.email}>{children}</AdminShell>
    </AdminLocaleProvider>
  );
}
