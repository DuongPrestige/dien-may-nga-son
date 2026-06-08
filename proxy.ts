import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

import { getRedirectDestination } from "@/src/features/redirects/services/redirects.service";

const adminLoginPath = "/admin/login";

function withPathnameHeader(request: NextRequest): NextResponse {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
    });

    if (pathname === adminLoginPath) {
      if (token) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      return withPathnameHeader(request);
    }

    if (!token) {
      return NextResponse.redirect(new URL(adminLoginPath, request.url));
    }

    return withPathnameHeader(request);
  }

  try {
    const destinationPath = await getRedirectDestination(pathname);

    if (destinationPath && destinationPath !== pathname) {
      const destinationUrl = new URL(destinationPath, request.url);
      destinationUrl.search = request.nextUrl.search;

      return NextResponse.redirect(destinationUrl, 301);
    }
  } catch {
    // Redirect storage must never make a public page unavailable.
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
