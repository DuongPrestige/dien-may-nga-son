import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

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

export const config = {
  matcher: ["/admin/:path*"],
};
