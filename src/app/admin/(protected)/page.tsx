import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/widgets/admin/PageHeader";
import { adminCard } from "@/widgets/admin/ui";

export const dynamic = "force-dynamic";

async function count(fn: () => Promise<number>): Promise<number> {
  try {
    return await fn();
  } catch {
    return 0;
  }
}

export default async function AdminDashboard() {
  const [newLeads, services, industries, posts] = await Promise.all([
    count(() => prisma.lead.count({ where: { status: "NEW" } })),
    count(() => prisma.service.count()),
    count(() => prisma.industry.count()),
    count(() => prisma.blogPost.count()),
  ]);

  const cards = [
    { label: "Neue Anfragen", value: newLeads, href: "/admin/leads" },
    { label: "Leistungen", value: services, href: "/admin/services" },
    { label: "Branchen", value: industries, href: "/admin/industries" },
    { label: "Artikel", value: posts, href: "/admin/blog" },
  ];

  return (
    <>
      <PageHeader title="Übersicht" subtitle="Schnellzugriff auf Inhalte und Anfragen." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`${adminCard} p-5 transition hover:-translate-y-0.5 hover:shadow-sm`}
          >
            <div className="text-3xl font-bold text-dark">{c.value}</div>
            <div className="mt-1 text-sm text-muted">{c.label}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
