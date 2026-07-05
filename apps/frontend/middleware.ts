import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/account"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(pathname);

  if (isProtectedRoute && !accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*", "/login", "/register"]
};
