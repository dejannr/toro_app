import { CompanyEmptyState } from "@/components/company/company-empty-state";
import { CompanySettingsView } from "@/components/company/company-settings-view";
import { AppShell } from "@/components/layout/app-shell";
import { getCompanyMembers, getCurrentCompany } from "@/lib/company";
import { requireCurrentUser } from "@/lib/server-auth";

export default async function CompanyPage() {
  const { user, cookieHeader } = await requireCurrentUser();

  if (!user.company) {
    return (
      <AppShell user={user}>
        <CompanyEmptyState />
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
