import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyNewsletterToken } from "@/features/newsletter/token";
import { siteConfig } from "@/shared/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function statusUrl(locale: string, status: string): string {
  const prefix = locale === "en" ? "/en" : locale === "ru" ? "/ru" : "";
  return `${siteConfig.url}${prefix}/newsletter?status=${status}`;
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const payload = await verifyNewsletterToken(token, "newsletter-unsubscribe");

  if (!payload) {
    return NextResponse.redirect(statusUrl("de", "invalid"));
  }

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: payload.email },
    });
    const locale = subscriber?.locale ?? "de";
    // GDPR-friendly: unsubscribing removes the record entirely.
    await prisma.newsletterSubscriber.deleteMany({ where: { email: payload.email } });
    return NextResponse.redirect(statusUrl(locale, "unsubscribed"));
  } catch {
    return NextResponse.redirect(statusUrl("de", "invalid"));
  }
}
