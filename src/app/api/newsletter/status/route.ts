import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterCaptchaConfigured, newsletterSignupsEnabled } from "@/features/newsletter/policy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let enabled = false;
  try {
    enabled = newsletterCaptchaConfigured() && await newsletterSignupsEnabled(prisma);
  } catch {
    // Availability/DB failures must not accidentally enable subscription.
  }
  return NextResponse.json({ enabled }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}
