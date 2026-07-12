import { apiFetch } from "@/lib/api";

export type DashboardInvoice = {
  id: string;
  invoice_number: string;
  customer: string;
  amount: string;
  status: string;
  date: string;
};

export type InvoiceStatusSummary = {
  status: string;
  count: number;
  total: string;
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
  status_breakdown: InvoiceStatusSummary[];
  recent_invoices: DashboardInvoice[];
  company_setup: CompanySetupSummary;
};

export function getDashboardSummary(cookieHeader?: string) {
  return apiFetch<DashboardSummary>("/dashboard/summary", {
    method: "GET",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined
  });
}
