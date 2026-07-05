import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/lib/auth";

export default async function AccountPage() {
  const cookieHeader = (await cookies()).toString();
  const user = await getCurrentUser(cookieHeader);

  if (user === null) {
    redirect("/login");
  }

  return (
    <AppShell>
      <section className="space-y-2">
        <h1 className="text-xl font-semibold">Account</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </section>
    </AppShell>
  );
}
