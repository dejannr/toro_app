import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = [
  "/app/dashboard",
  "/app/invoices",
  "/app/create-invoice",
  "/app/company",
  "/app/account",
  "/app/onboarding"
];
const authRoutes = ["/app/login", "/app/register"];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(pathname);

  if (isProtectedRoute && !accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/app/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/app/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/app/dashboard/:path*",
    "/app/invoices/:path*",
    "/app/create-invoice/:path*",
    "/app/company/:path*",
    "/app/account/:path*",
    "/app/onboarding/:path*",
    "/app/login",
    "/app/register"
  ]
};
