import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CompanySetupPanel } from "@/components/dashboard/company-setup-panel";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const cookieHeader = (await cookies()).toString();
  const user = await getCurrentUser(cookieHeader);
  const hasAccessToken = cookieHeader.includes("access_token=");

  if (user === null) {
    redirect(hasAccessToken ? "/app/logout" : "/app/login");
  }

  return (
    <AppShell>
      {user.company ? (
        <section className="space-y-3">
          <h1 className="text-2xl font-semibold text-foreground">
            {user.company.legal_name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Dashboard placeholder for the Toro app workspace.
          </p>
        </section>
      ) : (
        <CompanySetupPanel />
      )}
    </AppShell>
  );
}
