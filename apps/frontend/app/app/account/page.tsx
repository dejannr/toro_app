import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/lib/auth";

export default async function AccountPage() {
  const cookieHeader = (await cookies()).toString();
  const user = await getCurrentUser(cookieHeader);

  if (user === null) {
    redirect("/app/login");
  }

  return (
    <AppShell>
      <section className="space-y-2">
        <h1 className="text-xl font-semibold">Account</h1>
        <p className="text-sm text-foreground">
          {user.first_name} {user.last_name}
        </p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <p className="pt-3 text-sm text-muted-foreground">
          {user.company ? user.company.legal_name : "No company onboarded yet"}
        </p>
      </section>
    </AppShell>
  );
}
