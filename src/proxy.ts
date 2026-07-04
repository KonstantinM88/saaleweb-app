import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { SESSION_COOKIE, verifySessionToken } from "./features/auth/jwt";
import { detectAiAgent } from "./features/analytics/aiTraffic";

const intlMiddleware = createMiddleware(routing);

function trackAiVisit(req: NextRequest, event: NextFetchEvent) {
  if (req.method !== "GET") return;
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin")) return;

  const userAgent = req.headers.get("user-agent") ?? "";
  const bot = detectAiAgent(userAgent);
  if (!bot) return;

  const ingestSecret = process.env.AI_TRAFFIC_INGEST_SECRET || process.env.AUTH_SECRET || "";
  const url = req.nextUrl.clone();
  url.pathname = "/api/ai-visit";
  url.search = "";

  event.waitUntil(
    fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-ai-ingest-secret": ingestSecret,
      },
      body: JSON.stringify({
        path: pathname,
        bot,
        referrer: req.headers.get("referer") ?? null,
        userAgent,
      }),
    }).catch(() => undefined),
  );
}

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;
  trackAiVisit(req, event);

  // Admin area is not localized and is protected here (defense in depth).
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();

    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  // Match all paths except API routes, Next internals and static files
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
