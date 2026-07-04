import { NextResponse } from "next/server";
import { detectAiAgent } from "@/features/analytics/aiTraffic";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AiVisitPayload = {
  path?: unknown;
  bot?: unknown;
  referrer?: unknown;
  userAgent?: unknown;
};

function expectedSecret(): string | undefined {
  return process.env.AI_TRAFFIC_INGEST_SECRET?.trim() || process.env.AUTH_SECRET?.trim() || undefined;
}

function textValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function safePath(value: unknown): string {
  const path = textValue(value, "/");
  return path.startsWith("/") ? path.slice(0, 512) : "/";
}

export async function POST(req: Request) {
  const secret = expectedSecret();
  if (secret && req.headers.get("x-ai-ingest-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as AiVisitPayload;
    const userAgent = textValue(body.userAgent, req.headers.get("user-agent") ?? "").slice(0, 512);
    const bot = detectAiAgent(userAgent) || textValue(body.bot, "").slice(0, 120);

    if (!bot) {
      return NextResponse.json({ ok: true, tracked: false }, { headers: { "Cache-Control": "no-store" } });
    }

    await prisma.aiBotVisit.create({
      data: {
        bot,
        path: safePath(body.path),
        referrer: textValue(body.referrer, req.headers.get("referer") ?? "").slice(0, 512) || null,
        userAgent: userAgent || null,
      },
    });

    return NextResponse.json({ ok: true, tracked: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.warn("[ai-visit] AI visit tracking skipped.", {
      message: error instanceof Error ? error.message : "Unknown AI tracking error",
    });
    return NextResponse.json({ ok: true, tracked: false }, { headers: { "Cache-Control": "no-store" } });
  }
}
