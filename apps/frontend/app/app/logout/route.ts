import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { logout } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await logout(request.headers.get("cookie") ?? undefined);
  } catch {
    // Local cookies are still cleared when the backend is unavailable.
  }

  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  return NextResponse.redirect(new URL("/app/login", request.nextUrl.origin));
}
