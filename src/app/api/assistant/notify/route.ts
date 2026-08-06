import { NextResponse } from "next/server";
import { z } from "zod";
import { assistantRequestMeta } from "@/features/assistant/logging";
import { sendAssistantConversationDigest } from "@/features/notifications/telegramAssistant";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  conversationId: z.string().trim().min(8).max(64).regex(/^[a-zA-Z0-9_-]+$/),
  visitorId: z.string().trim().max(80).optional(),
  reason: z.enum(["idle", "pagehide"]).default("idle"),
});

function noStoreJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return noStoreJson({ ok: false, error: "invalid_request" }, 400);
  }

  const meta = assistantRequestMeta(req, parsed.data.visitorId);

  try {
    const result = await sendAssistantConversationDigest({
      conversationId: parsed.data.conversationId,
      visitorKey: meta.visitorKey,
      // The browser waits a full minute for an open tab. When the document is
      // actually leaving, the completed exchange can be delivered immediately.
      quietSeconds: parsed.data.reason === "idle" ? 55 : 0,
    });

    return noStoreJson({ ok: result.status !== "failed", status: result.status }, result.status === "failed" ? 502 : 200);
  } catch (error) {
    console.warn("[assistant-notify] Telegram digest delivery failed.", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return noStoreJson({ ok: false, error: "delivery_failed" }, 503);
  }
}
