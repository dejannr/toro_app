import {
  DashboardCompanyRequired,
  DashboardErrorState,
  DashboardOverview
} from "@/components/dashboard/dashboard-overview";
import { AppShell } from "@/components/layout/app-shell";
import { getDashboardSummary } from "@/lib/dashboard";
import { requireCurrentUser } from "@/lib/server-auth";

export default async function DashboardPage() {
  const { user, cookieHeader } = await requireCurrentUser();

  if (!user.company) {
    return (
      <AppShell user={user}>
        <DashboardCompanyRequired />
      </AppShell>
    );
  }

  try {
    const summary = await getDashboardSummary(cookieHeader);

    return (
      <AppShell user={user}>
        <DashboardOverview summary={summary} />
      </AppShell>
    );
  } catch {
    return (
      <AppShell user={user}>
        <DashboardErrorState />
      </AppShell>
    );
  }
}
