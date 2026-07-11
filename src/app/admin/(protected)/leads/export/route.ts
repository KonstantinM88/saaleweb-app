import { getSession } from "@/features/auth/session";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadRow = {
  createdAt: Date | null;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  source: string | null;
  status: string;
  locale: string;
};

function cell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",;\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  let leads: LeadRow[] = [];
  try {
    leads = (await prisma.lead.findMany({ orderBy: { createdAt: "desc" } })) as LeadRow[];
  } catch {
    leads = [];
  }

  const header = ["createdAt", "name", "email", "phone", "company", "message", "source", "status", "locale"];
  const lines = leads.map((l) =>
    [
      l.createdAt ? new Date(l.createdAt).toISOString() : "",
      l.name,
      l.email,
      l.phone,
      l.company,
      l.message,
      l.source,
      l.status,
      l.locale,
    ]
      .map(cell)
      .join(";"),
  );

  // BOM so Excel detects UTF-8; ";" delimiter for DE locale.
  const csv = "\uFEFF" + [header.join(";"), ...lines].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
