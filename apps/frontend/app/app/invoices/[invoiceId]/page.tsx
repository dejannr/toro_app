import { notFound } from "next/navigation";

import { CompanyAccessRequired } from "@/components/company/company-access-required";
import { InvoiceDetailView } from "@/components/invoices/invoice-detail-view";
import { AppShell } from "@/components/layout/app-shell";
import { ApiRequestError } from "@/lib/api";
import { getInvoice } from "@/lib/invoices";
import { requireCurrentUser } from "@/lib/server-auth";

type InvoiceDetailsPageProps = {
  params: {
    invoiceId: string;
  };
};

export default async function InvoiceDetailsPage({
  params
}: InvoiceDetailsPageProps) {
  const { user, cookieHeader } = await requireCurrentUser();

  if (!user.company) {
    return (
      <AppShell user={user}>
        <CompanyAccessRequired
          title="Company access required"
          description="You need to create or join a company before you can view invoice details."
        />
      </AppShell>
    );
  }

  try {
    const invoice = await getInvoice(params.invoiceId, cookieHeader);

    return (
      <AppShell user={user}>
        <InvoiceDetailView invoice={invoice} />
      </AppShell>
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}
