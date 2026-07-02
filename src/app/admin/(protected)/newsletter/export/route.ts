import { getSession } from "@/features/auth/session";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubscriberRow = {
  createdAt: Date | null;
  email: string;
  locale: string;
  confirmed: boolean;
};

function cell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",;\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  let subscribers: SubscriberRow[] = [];
  try {
    subscribers = (await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    })) as SubscriberRow[];
  } catch {
    subscribers = [];
  }

  const header = ["createdAt", "email", "locale", "confirmed"];
  const lines = subscribers.map((s) =>
    [
      s.createdAt ? new Date(s.createdAt).toISOString() : "",
      s.email,
      s.locale,
      s.confirmed ? "yes" : "no",
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
      "Content-Disposition": `attachment; filename="newsletter-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
