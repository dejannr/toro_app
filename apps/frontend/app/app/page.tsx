import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

export default async function AppIndexPage() {
  const cookieHeader = (await cookies()).toString();
  const user = await getCurrentUser(cookieHeader);

  if (user === null) {
    redirect("/app/login");
  }

  redirect("/app/dashboard");
}
