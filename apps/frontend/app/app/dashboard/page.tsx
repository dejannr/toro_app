import { CompanyAccessRequired } from "@/components/company/company-access-required";
import { AppShell } from "@/components/layout/app-shell";
import { getDashboardSummary } from "@/lib/dashboard";
import { requireCurrentUser } from "@/lib/server-auth";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export default async function DashboardPage() {
  const { user, cookieHeader } = await requireCurrentUser();
  const summary = user.company ? await getDashboardSummary(cookieHeader) : null;

  return (
    <AppShell user={user}>
      {user.company && summary ? (
        <section className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-[#161616]">Dashboard</h1>
            <p className="text-sm leading-7 text-muted-foreground">
              A fast view of invoice activity for {user.company.legal_name}.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
              <p className="text-sm font-medium text-[#161616]">Create Invoice</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Start the upload, review, and create flow from here.
              </p>
            </div>
            <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
              <p className="text-sm font-medium text-[#161616]">Unpaid Invoices</p>
              <p className="mt-3 text-3xl font-semibold text-[#161616]">
                {summary.unpaid_invoices}
              </p>
            </div>
            <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
              <p className="text-sm font-medium text-[#161616]">Paid This Month</p>
              <p className="mt-3 text-3xl font-semibold text-[#161616]">
                {formatMoney(summary.paid_this_month)}
              </p>
            </div>
            <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
              <p className="text-sm font-medium text-[#161616]">Recent Invoices</p>
              <p className="mt-3 text-3xl font-semibold text-[#161616]">
                {summary.recent_invoices.length}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#161616]">
                  Recent Invoices
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  The latest activity in your company workspace.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {summary.recent_invoices.length ? (
                summary.recent_invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="grid gap-3 rounded-xl border border-[#EAEAEA] bg-white px-4 py-4 md:grid-cols-[1.1fr_1fr_0.7fr_0.6fr]"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#161616]">
                        {invoice.invoice_number}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {invoice.customer}
                      </p>
                    </div>
                    <div className="text-sm text-[#161616]">Load {invoice.load_number}</div>
                    <div className="text-sm text-[#161616]">
                      {formatMoney(invoice.amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">{invoice.status}</div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No invoices yet. Use Create Invoice to generate your first one.
                </p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <CompanyAccessRequired
          title="Company access required"
          description="You need to create or join a company before you can use the dashboard."
        />
      )}
    </AppShell>
  );
}
