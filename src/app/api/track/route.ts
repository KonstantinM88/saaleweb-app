import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { isbot } from "isbot";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const LOCALES = ["de", "en", "ru"];

function clientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() ?? "";
  return req.headers.get("x-real-ip") ?? "";
}

// Cookieless visitor id: daily salted hash from date + IP + user-agent.
// The raw IP is used only for this one-way hash and is never stored.
function createVisitorHash(req: Request, userAgent: string): string {
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.ANALYTICS_SALT || process.env.AUTH_SECRET || "saaleweb-analytics";

  return createHash("sha256")
    .update(`${day}|${clientIp(req)}|${userAgent}|${salt}`)
    .digest("hex")
    .slice(0, 32);
}

export async function POST(req: Request) {
  try {
    const userAgent = req.headers.get("user-agent") ?? "";
    if (!userAgent || isbot(userAgent)) {
      return NextResponse.json({ ok: true });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body.path !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const path = body.path.slice(0, 512);
    if (path.startsWith("/admin")) return NextResponse.json({ ok: true });
    const locale = LOCALES.includes(body.locale) ? body.locale : "de";
    const referrer =
      typeof body.referrer === "string" && body.referrer ? body.referrer.slice(0, 512) : null;

    await prisma.pageView.create({
      data: { path, locale, referrer, visitorHash: createVisitorHash(req, userAgent) },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
