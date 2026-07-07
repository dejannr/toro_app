import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const cookieHeader = (await cookies()).toString();
  const user = await getCurrentUser(cookieHeader);

  if (user === null) {
    redirect("/app/login");
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
        <section className="max-w-3xl space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-foreground">
              Welcome to Toro
            </h1>
            <p className="text-sm leading-7 text-muted-foreground">
              Your user account is active. You can create a company workspace now,
              or wait and join an existing company later.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-[#EFE7D4] bg-white p-6">
              <p className="text-sm font-medium text-foreground">
                Create a company
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Start a new Toro workspace and become the owner account.
              </p>
              <Link
                href="/app/onboarding"
                className="mt-5 inline-flex rounded-md bg-[#161616] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#161616]/90"
              >
                Create workspace
              </Link>
            </div>
            <div className="rounded-3xl border border-[#EFE7D4] bg-white p-6">
              <p className="text-sm font-medium text-foreground">
                Join later
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Keep your personal account ready and join an existing company when
                invite or membership flow is added.
              </p>
            </div>
          </div>
        </section>
      )}
    </AppShell>
  );
}
