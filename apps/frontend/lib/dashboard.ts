import { apiFetch } from "@/lib/api";

export type DashboardInvoice = {
  id: string;
  invoice_number: string;
  customer: string;
  load_number: string;
  amount: number;
  status: string;
  date: string;
};

export type DashboardSummary = {
  unpaid_invoices: number;
  paid_this_month: number;
  recent_invoices: DashboardInvoice[];
};

export function getDashboardSummary(cookieHeader?: string) {
  return apiFetch<DashboardSummary>("/dashboard/summary", {
    method: "GET",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined
  });
}
