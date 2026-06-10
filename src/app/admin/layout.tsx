import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin | SaaleWeb",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={GeistSans.variable}>
      <body className="min-h-screen bg-surface font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
