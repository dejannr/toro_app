import { CompanyAccessRequired } from "@/components/company/company-access-required";
import { InvoicesTableView } from "@/components/invoices/invoices-table-view";
import { AppShell } from "@/components/layout/app-shell";
import { getInvoices } from "@/lib/invoices";
import { requireCurrentUser } from "@/lib/server-auth";

export default async function InvoicesPage() {
  const { user, cookieHeader } = await requireCurrentUser();

  if (!user.company) {
    return (
      <AppShell user={user}>
        <CompanyAccessRequired
          title="Company access required"
          description="You need to create or join a company before you can view invoices."
        />
      </AppShell>
    );
  }

  const invoices = await getInvoices(cookieHeader);

  return (
    <AppShell user={user}>
      <InvoicesTableView invoices={invoices} />
    </AppShell>
  );
}
