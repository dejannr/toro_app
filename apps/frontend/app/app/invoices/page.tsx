import Link from "next/link";

import { CompanyAccessRequired } from "@/components/company/company-access-required";
import { AppShell } from "@/components/layout/app-shell";
import { getInvoices } from "@/lib/invoices";
import { requireCurrentUser } from "@/lib/server-auth";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

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
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-[#161616]">Invoices</h1>
            <p className="text-sm leading-7 text-muted-foreground">
              Every invoice created from the upload and review flow.
            </p>
          </div>
          <Link
            href="/app/create-invoice"
            className="inline-flex rounded-xl bg-[#161616] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#161616]/90"
          >
            Create Invoice
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA]">
          <div className="grid grid-cols-[1fr_1fr_0.9fr_0.8fr_0.8fr_0.8fr_0.7fr] gap-4 border-b border-[#EAEAEA] px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <span>Invoice #</span>
            <span>Customer</span>
            <span>Load #</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Date</span>
            <span>Action</span>
          </div>

          {invoices.length ? (
            invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="grid grid-cols-[1fr_1fr_0.9fr_0.8fr_0.8fr_0.8fr_0.7fr] gap-4 border-b border-[#EAEAEA] bg-white px-6 py-4 text-sm text-[#161616] last:border-b-0"
              >
                <span>{invoice.invoice_number}</span>
                <span>{invoice.customer}</span>
                <span>{invoice.load_number}</span>
                <span>{formatMoney(invoice.amount)}</span>
                <span>{invoice.status}</span>
                <span>{invoice.date}</span>
                <Link
                  href={`/app/invoices/${invoice.id}`}
                  className="font-medium text-[#161616] underline-offset-4 hover:underline"
                >
                  Open
                </Link>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-sm text-muted-foreground">
              No invoices yet. Create your first invoice from two uploaded
              documents.
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
