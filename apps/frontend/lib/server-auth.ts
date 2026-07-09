import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getCurrentUser, type CurrentUser } from "@/lib/auth";

export async function requireCurrentUser(): Promise<{
  user: CurrentUser;
  cookieHeader: string;
}> {
  const cookieHeader = (await cookies()).toString();
  const user = await getCurrentUser(cookieHeader);
  const hasAccessToken = cookieHeader.includes("access_token=");

  if (user === null) {
    redirect(hasAccessToken ? "/app/logout" : "/app/login");
  }

  return { user, cookieHeader };
}
