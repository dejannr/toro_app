import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

export default async function AppIndexPage() {
  const cookieHeader = (await cookies()).toString();
  const user = await getCurrentUser(cookieHeader);
  const hasAccessToken = cookieHeader.includes("access_token=");

  if (user === null) {
    redirect(hasAccessToken ? "/app/logout" : "/app/login");
  }

  redirect("/app/dashboard");
}
