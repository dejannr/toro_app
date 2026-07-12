import {
  AlertCircle,
  ArrowRight,
  Building05,
  CheckCircle,
  File06,
  PlusSquare,
  User01
} from "@untitledui/icons";
import Link from "next/link";

import { DashboardChartsSection } from "@/components/dashboard/dashboard-charts";
import { PageIntro } from "@/components/layout/page-intro";
import type { DashboardSummary } from "@/lib/dashboard";

type DashboardOverviewProps = {
  summary: DashboardSummary;
};

type ActionNeeded = {
  title: string;
  description: string;
  href: string;
  action: string;
};

const statusClassNames: Record<string, string> = {
  Paid: "bg-[#EAF8EF] text-[#2F9E62]",
  Unpaid: "bg-[#FFF4DA] text-[#C98A00]",
  Draft: "bg-[#F0F0F0] text-[#6B6B6B]"
};

function formatMoney(value: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function getActionNeeded(summary: DashboardSummary): ActionNeeded[] {
  const actions: ActionNeeded[] = [];
  const incompleteSections = summary.company_setup.sections.filter(
    (section) => !section.complete
  );

  if (incompleteSections.some((section) => section.key === "company_profile")) {
    actions.push({
      title: "Finish your company profile",
      description: "Add your company contact and business address details.",
      href: "/app/company",
      action: "Open company settings"
    });
  }

  if (
    incompleteSections.some((section) => section.key === "billing_remittance")
  ) {
    actions.push({
      title: "Add remittance details before sending invoices",
      description: "Complete the payment information shown on your invoices.",
      href: "/app/company",
      action: "Complete remittance"
    });
  }

  if (
    incompleteSections.some((section) => section.key === "invoice_settings")
  ) {
    actions.push({
      title: "Finish your invoice settings",
      description: "Set the default prefix and payment terms for new invoices.",
      href: "/app/company",
      action: "Open invoice settings"
    });
  }

  if (summary.unpaid_invoices > 0) {
    actions.push({
      title: `${summary.unpaid_invoices} ${summary.unpaid_invoices === 1 ? "invoice is" : "invoices are"} unpaid`,
      description: `${formatMoney(summary.unpaid_total)} is currently awaiting payment.`,
      href: "/app/invoices",
      action: "View invoices"
    });
  }

  if (summary.total_invoices === 0) {
    actions.push({
      title: "Create your first invoice",
      description: "Start tracking billing activity for your company.",
      href: "/app/create-invoice",
      action: "Create invoice"
    });
  }

  return actions.slice(0, 3);
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClassNames[status] ?? "bg-[#F0F0F0] text-[#6B6B6B]"}`}
    >
      {status}
    </span>
  );
}

function MetricCard({
  label,
  value,
  supportingText,
  href
}: {
  label: string;
  value: string | number;
  supportingText: string;
  href?: string;
}) {
  const content = (
    <>
      <p className="text-sm font-medium text-[#6F6F6F]">{label}</p>
      <p className="mt-4 break-words text-2xl font-semibold tabular-nums text-[#161616]">
        {value}
      </p>
      <p className="mt-2 text-sm text-[#8A8A8A]">{supportingText}</p>
    </>
  );

  const className =
    "rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-5 transition-colors";

  return href ? (
    <Link
      href={href}
      className={`${className} hover:border-[#D8D8D8] hover:bg-white`}
    >
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

export function DashboardOverview({ summary }: DashboardOverviewProps) {
  const actionNeeded = getActionNeeded(summary);
  const setupIsIncomplete =
    summary.company_setup.completed_sections <
    summary.company_setup.total_sections;

  return (
    <section className="space-y-6">
      <PageIntro
        title="Dashboard"
        description="Review invoice activity, outstanding balances, and company setup."
        sticky
        actions={
          <div className="flex flex-wrap items-center gap-3 max-sm:w-full max-sm:flex-col max-sm:items-stretch">
            <Link
              href="/app/invoices"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white px-4 text-sm font-medium text-[#161616] transition-colors hover:bg-[#FAFAFA]"
            >
              View invoices
            </Link>
            <Link
              href="/app/create-invoice"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#161616] px-4 text-sm font-medium text-white transition-colors hover:bg-[#2A2A2A]"
            >
              <PlusSquare className="h-4 w-4" aria-hidden="true" />
              Create invoice
            </Link>
          </div>
        }
      />

      {actionNeeded.length ? (
        <section
          className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-5"
          aria-labelledby="action-needed-title"
        >
          <div className="flex items-center gap-2">
            <AlertCircle
              className="h-5 w-5 text-[#161616]"
              aria-hidden="true"
            />
            <h2
              id="action-needed-title"
              className="text-sm font-semibold text-[#161616]"
            >
              Action needed
            </h2>
          </div>
          <div className="mt-4 divide-y divide-[#E8E8E8]">
            {actionNeeded.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-[#161616]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-[#6F6F6F]">
                    {item.description}
                  </p>
                </div>
                <Link
                  href={item.href}
                  className="shrink-0 text-sm font-medium text-[#161616] underline-offset-4 hover:text-[#6F6F6F] hover:underline"
                >
                  {item.action}
                </Link>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Invoice summary"
      >
        <MetricCard
          label="Unpaid"
          value={formatMoney(summary.unpaid_total)}
          supportingText={
            summary.unpaid_invoices
              ? `Across ${summary.unpaid_invoices} ${summary.unpaid_invoices === 1 ? "invoice" : "invoices"}`
              : "No unpaid invoices"
          }
          href="/app/invoices"
        />
        <MetricCard
          label="Paid this month"
          value={formatMoney(summary.paid_this_month_total)}
          supportingText={
            summary.paid_this_month_invoices
              ? `${summary.paid_this_month_invoices} ${summary.paid_this_month_invoices === 1 ? "invoice" : "invoices"}`
              : "No payments recorded"
          }
        />
        <MetricCard
          label="Total invoices"
          value={summary.total_invoices}
          supportingText={
            summary.invoices_created_this_month
              ? `${summary.invoices_created_this_month} created this month`
              : "No invoices yet"
          }
          href="/app/invoices"
        />
        <MetricCard
          label="Draft invoices"
          value={summary.draft_invoices}
          supportingText={
            summary.draft_invoices ? "Ready to review" : "No drafts to review"
          }
          href="/app/invoices"
        />
      </section>

      <DashboardChartsSection charts={summary.charts} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <section
          className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-5"
          aria-labelledby="recent-invoices-title"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="recent-invoices-title"
                className="text-base font-semibold text-[#161616]"
              >
                Recent invoices
              </h2>
              <p className="mt-1 text-sm text-[#6F6F6F]">
                Your latest invoice activity.
              </p>
            </div>
            <Link
              href="/app/invoices"
              className="shrink-0 text-sm font-medium text-[#161616] underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>

          {summary.recent_invoices.length ? (
            <div className="mt-5">
              <div className="hidden grid-cols-[1fr_1.2fr_0.8fr_0.7fr_auto] gap-4 border-b border-[#E8E8E8] px-3 py-3 text-xs font-medium text-[#8A8A8A] md:grid">
                <span>Invoice no.</span>
                <span>Customer</span>
                <span>Amount</span>
                <span>Status</span>
                <span className="text-right">Updated</span>
              </div>
              <div className="divide-y divide-[#E8E8E8]">
                {summary.recent_invoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/app/invoices/${invoice.id}`}
                    className="block rounded-lg px-3 py-4 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD028] md:grid md:grid-cols-[1fr_1.2fr_0.8fr_0.7fr_auto] md:items-center md:gap-4"
                  >
                    <div className="flex items-start justify-between gap-4 md:block">
                      <p className="text-sm font-medium text-[#161616]">
                        {invoice.invoice_number}
                      </p>
                      <p className="text-sm font-semibold tabular-nums text-[#161616] md:hidden">
                        {formatMoney(invoice.amount)}
                      </p>
                    </div>
                    <p className="mt-1 truncate text-sm text-[#6F6F6F] md:mt-0">
                      {invoice.customer}
                    </p>
                    <p className="mt-3 hidden text-sm font-medium tabular-nums text-[#161616] md:block">
                      {formatMoney(invoice.amount)}
                    </p>
                    <div className="mt-3 md:mt-0">
                      <StatusBadge status={invoice.status} />
                    </div>
                    <p className="mt-3 text-xs text-[#8A8A8A] md:mt-0 md:text-right md:text-sm">
                      {formatDate(invoice.date)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-[#DCDCDC] bg-white px-5 py-8">
              <File06 className="h-5 w-5 text-[#6F6F6F]" aria-hidden="true" />
              <h3 className="mt-4 text-sm font-medium text-[#161616]">
                No invoices yet
              </h3>
              <p className="mt-1 text-sm text-[#6F6F6F]">
                Create your first invoice to start tracking billing activity.
              </p>
              <Link
                href="/app/create-invoice"
                className="mt-4 inline-flex text-sm font-medium text-[#161616] underline-offset-4 hover:underline"
              >
                Create invoice
              </Link>
            </div>
          )}
        </section>

        <section
          className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-5"
          aria-labelledby="quick-actions-title"
        >
          <h2
            id="quick-actions-title"
            className="text-base font-semibold text-[#161616]"
          >
            Quick actions
          </h2>
          <div className="mt-4 divide-y divide-[#E8E8E8]">
            {[
              {
                href: "/app/create-invoice",
                label: "Create invoice",
                description: "Upload documents and prepare a new invoice.",
                icon: PlusSquare
              },
              {
                href: "/app/invoices",
                label: "View invoices",
                description: "Review, send, download, or update invoices.",
                icon: File06
              },
              {
                href: "/app/company",
                label: "Company settings",
                description: setupIsIncomplete
                  ? "Setup needed for invoice details."
                  : "Update company and remittance details.",
                icon: Building05
              },
              {
                href: "/app/account",
                label: "Account settings",
                description:
                  "Manage your profile, password, and notifications.",
                icon: User01
              }
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex min-h-16 items-center gap-3 py-3 first:pt-0 last:pb-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD028]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#161616]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#161616]">
                      {action.label}
                    </p>
                    <p className="mt-0.5 text-sm text-[#6F6F6F]">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-[#6F6F6F]"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </section>
      </section>

      {setupIsIncomplete ? (
        <section
          className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-5"
          aria-labelledby="company-setup-title"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2
                id="company-setup-title"
                className="text-base font-semibold text-[#161616]"
              >
                Company setup
              </h2>
              <p className="mt-1 text-sm text-[#6F6F6F]">
                {summary.company_setup.completed_sections} of{" "}
                {summary.company_setup.total_sections} sections complete
              </p>
            </div>
            <Link
              href="/app/company"
              className="text-sm font-medium text-[#161616] underline-offset-4 hover:underline"
            >
              Complete company setup
            </Link>
          </div>
          <div
            className="mt-5 h-2 overflow-hidden rounded-full bg-[#E8E8E8]"
            aria-label={`${summary.company_setup.completed_sections} of ${summary.company_setup.total_sections} company setup sections complete`}
          >
            <div
              className="h-full rounded-full bg-[#161616]"
              style={{
                width: `${(summary.company_setup.completed_sections / summary.company_setup.total_sections) * 100}%`
              }}
            />
          </div>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {summary.company_setup.sections.map((section) => (
              <li
                key={section.key}
                className="flex items-center gap-2 text-sm text-[#161616]"
              >
                <CheckCircle
                  className={`h-4 w-4 shrink-0 ${section.complete ? "text-[#2F9E62]" : "text-[#A1A1A1]"}`}
                  aria-hidden="true"
                />
                <span>{section.label}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
  );
}

export function DashboardCompanyRequired() {
  return (
    <section className="space-y-6">
      <PageIntro
        title="Dashboard"
        description="Review invoice activity, outstanding balances, and company setup."
        sticky
        actions={
          <Link
            href="/app/company"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#161616] px-4 text-sm font-medium text-white transition-colors hover:bg-[#2A2A2A] max-sm:w-full"
          >
            Create company
          </Link>
        }
      />
      <section
        className="max-w-2xl rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-6"
        aria-labelledby="company-required-title"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#161616]">
          <Building05 className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2
          id="company-required-title"
          className="mt-5 text-lg font-semibold text-[#161616]"
        >
          Create a company to use the dashboard
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#6F6F6F]">
          Toro needs your company information before you can create, manage, and
          track invoices.
        </p>
        <ul className="mt-5 space-y-2 text-sm text-[#161616]">
          <li className="flex items-center gap-2">
            <CheckCircle
              className="h-4 w-4 text-[#6F6F6F]"
              aria-hidden="true"
            />
            Create invoices
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle
              className="h-4 w-4 text-[#6F6F6F]"
              aria-hidden="true"
            />
            Track unpaid and paid invoices
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle
              className="h-4 w-4 text-[#6F6F6F]"
              aria-hidden="true"
            />
            Configure invoice and remittance details
          </li>
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/app/company"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#161616] px-4 text-sm font-medium text-white transition-colors hover:bg-[#2A2A2A]"
          >
            Create company
          </Link>
          <Link
            href="/app/account"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white px-4 text-sm font-medium text-[#161616] transition-colors hover:bg-[#FAFAFA]"
          >
            Go to account settings
          </Link>
        </div>
      </section>
    </section>
  );
}

export function DashboardErrorState() {
  return (
    <section className="space-y-6">
      <PageIntro
        title="Dashboard"
        description="Review invoice activity, outstanding balances, and company setup."
        sticky
      />
      <div className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-6">
        <AlertCircle className="h-5 w-5 text-[#161616]" aria-hidden="true" />
        <h2 className="mt-4 text-base font-semibold text-[#161616]">
          Unable to load dashboard data.
        </h2>
        <p className="mt-1 text-sm text-[#6F6F6F]">Please try again.</p>
        <Link
          href="/app/dashboard"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white px-4 text-sm font-medium text-[#161616] transition-colors hover:bg-[#FAFAFA]"
        >
          Retry
        </Link>
      </div>
    </section>
  );
}
