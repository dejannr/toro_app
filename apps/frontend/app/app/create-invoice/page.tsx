import { CompanyAccessRequired } from "@/components/company/company-access-required";
import { CreateInvoiceFlow } from "@/components/invoices/create-invoice-flow";
import { AppShell } from "@/components/layout/app-shell";
import { requireCurrentUser } from "@/lib/server-auth";

export default async function CreateInvoicePage() {
  const { user } = await requireCurrentUser();

  if (!user.company) {
    return (
      <AppShell user={user}>
        <CompanyAccessRequired
          title="Company access required"
          description="You need to create or join a company before you can create invoices."
        />
      </AppShell>
    );
  }

  return (
    <AppShell user={user}>
      <CreateInvoiceFlow />
    </AppShell>
  );
}
