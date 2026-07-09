import { CompanyOnboardingForm } from "@/components/auth/company-onboarding-form";
import { CompanySettingsView } from "@/components/company/company-settings-view";
import { AppShell } from "@/components/layout/app-shell";
import { getCompanyMembers, getCurrentCompany } from "@/lib/company";
import { requireCurrentUser } from "@/lib/server-auth";

export default async function CompanyPage() {
  const { user, cookieHeader } = await requireCurrentUser();

  if (!user.company) {
    return (
      <AppShell user={user}>
        <section className="max-w-xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-[#161616]">Company</h1>
            <p className="text-sm leading-7 text-muted-foreground">
              Create your company workspace now, or come back here later.
            </p>
          </div>
          <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
            <CompanyOnboardingForm submitLabel="Create workspace" />
          </div>
        </section>
      </AppShell>
    );
  }

  const [company, members] = await Promise.all([
    getCurrentCompany(cookieHeader),
    getCompanyMembers(cookieHeader)
  ]);

  return (
    <AppShell user={user}>
      <CompanySettingsView
        company={company}
        isOwner={user.company.role === "owner"}
        members={members}
      />
    </AppShell>
  );
}
