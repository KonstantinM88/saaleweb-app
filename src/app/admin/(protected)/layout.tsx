import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/session";
import { AdminSidebar } from "@/widgets/admin/Sidebar";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar email={session.email} />
      <main className="flex-1 overflow-x-hidden px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}
