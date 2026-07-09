import { AppShell } from "@/components/layout/app-shell";
import { requireCurrentUser } from "@/lib/server-auth";

export default async function AccountPage() {
  const { user } = await requireCurrentUser();

  return (
    <AppShell user={user}>
      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-[#161616]">Account</h1>
          <p className="text-sm leading-7 text-muted-foreground">
            Personal account information for your Toro login.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Name
            </p>
            <p className="mt-2 text-lg font-semibold text-[#161616]">
              {user.first_name} {user.last_name}
            </p>
          </div>
          <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Email
            </p>
            <p className="mt-2 text-lg font-semibold text-[#161616]">{user.email}</p>
          </div>
          <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Company
            </p>
            <p className="mt-2 text-lg font-semibold text-[#161616]">
              {user.company ? user.company.legal_name : "No company"}
            </p>
          </div>
          <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Role
            </p>
            <p className="mt-2 text-lg font-semibold text-[#161616]">
              {user.company ? user.company.role : "Personal account"}
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
