import { AccountSettingsView } from "@/components/account/account-settings-view";
import { AppShell } from "@/components/layout/app-shell";
import { getAccountProfile } from "@/lib/auth";
import { requireCurrentUser } from "@/lib/server-auth";

export default async function AccountPage() {
  const { user, cookieHeader } = await requireCurrentUser();
  const profile = await getAccountProfile(cookieHeader);

  return (
    <AppShell user={user}>
      <AccountSettingsView profile={profile} />
    </AppShell>
  );
}
