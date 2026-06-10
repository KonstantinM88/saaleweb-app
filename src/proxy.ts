import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { SESSION_COOKIE, verifySessionToken } from "./features/auth/jwt";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
