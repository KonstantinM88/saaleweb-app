import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const LOCALES = ["de", "en", "ru"];

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.path !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const path = body.path.slice(0, 512);
    if (path.startsWith("/admin")) return NextResponse.json({ ok: true });
    const locale = LOCALES.includes(body.locale) ? body.locale : "de";
    const referrer =
      typeof body.referrer === "string" && body.referrer ? body.referrer.slice(0, 512) : null;

    await prisma.pageView.create({ data: { path, locale, referrer } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
