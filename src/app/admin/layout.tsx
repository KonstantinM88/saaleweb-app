import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../globals.css";
import { getAdminLocale } from "@/features/admin/i18n.server";

export const metadata: Metadata = {
  title: "Admin | SaaleWeb",
  robots: { index: false, follow: false },
};

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getAdminLocale();
  return (
    <html lang={locale} className={GeistSans.variable}>
      <body className="min-h-screen bg-surface font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
