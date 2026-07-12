import { apiFetch } from "@/lib/api";

export type DashboardInvoice = {
  id: string;
  invoice_number: string;
  customer: string;
  amount: string;
  status: string;
  date: string;
};

export type PaidTotalsBucket = {
  period_start: string;
  period_end: string;
  paid_invoice_count: number;
  paid_total: string;
};

export type PaidTotalsChart = {
  range_start: string;
  range_end: string;
  currency: string;
  buckets: PaidTotalsBucket[];
};

export type InvoiceCreationBucket = {
  period_start: string;
  period_end: string;
  invoice_count: number;
};

export type InvoiceCreationChart = {
  range_start: string;
  range_end: string;
  buckets: InvoiceCreationBucket[];
};

export type InvoiceStatusDistributionItem = {
  status: string;
  invoice_count: number;
  invoice_total: string;
};

export type DashboardChartsData = {
  paid_totals: PaidTotalsChart;
  invoice_creation: InvoiceCreationChart;
  status_distribution: {
    currency: string;
    items: InvoiceStatusDistributionItem[];
  };
};

export type CompanySetupSection = {
  key: "company_profile" | "billing_remittance" | "invoice_settings";
  label: string;
  complete: boolean;
};

export type CompanySetupSummary = {
  completed_sections: number;
  total_sections: number;
  sections: CompanySetupSection[];
};

export type DashboardSummary = {
  total_invoices: number;
  invoices_created_this_month: number;
  unpaid_invoices: number;
  unpaid_total: string;
  paid_this_month_invoices: number;
  paid_this_month_total: string;
  draft_invoices: number;
  recent_invoices: DashboardInvoice[];
  company_setup: CompanySetupSummary;
  charts: DashboardChartsData;
};

export function getDashboardSummary(cookieHeader?: string) {
  return apiFetch<DashboardSummary>("/dashboard/summary", {
    method: "GET",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined
  });
}
