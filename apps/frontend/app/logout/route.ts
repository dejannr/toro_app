import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { logout } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await logout(request.headers.get("cookie") ?? undefined);
  } catch {
    // The local cookies are cleared even when the backend is temporarily unavailable.
  }

  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
}
