import { apiFetch, getApiBaseUrl } from "@/lib/api";

export type InvoiceDraft = {
  invoice_number: string;
  bill_to: {
    broker_name: string;
    address: string | null;
    email: string | null;
  };
  load_information: {
    load_number: string;
    pickup: string;
    delivery: string;
    pickup_date: string;
    delivery_date: string;
  };
  charges: {
    linehaul: number;
    additional_charges: number;
    total: number;
  };
  payment_terms: {
    due_date: string;
    payment_terms: string;
  };
  bol_filename: string;
  rate_confirmation_filename: string;
};

export type InvoiceRow = {
  id: string;
  invoice_number: string;
  customer: string;
  load_number: string;
  amount: number;
  status: string;
  date: string;
};

export type InvoiceDetails = {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_address: string | null;
  customer_email: string | null;
  load_number: string;
  pickup_location: string;
  delivery_location: string;
  pickup_date: string;
  delivery_date: string;
  linehaul_amount: number;
  additional_charges_amount: number;
  total_amount: number;
  due_date: string;
  payment_terms: string;
  status: string;
  bol_filename: string;
  rate_confirmation_filename: string;
  created_at: string;
  paid_at: string | null;
};

export type CreateInvoicePayload = InvoiceDraft;

export function generateInvoiceDraft(
  bolFile: File,
  rateConfirmationFile: File
): Promise<InvoiceDraft> {
  const formData = new FormData();
  formData.append("bol_file", bolFile);
  formData.append("rate_confirmation_file", rateConfirmationFile);

  return apiFetch<InvoiceDraft>("/invoices/draft", {
    method: "POST",
    body: formData
  });
}

export function createInvoice(payload: CreateInvoicePayload) {
  return apiFetch<InvoiceDetails>("/invoices", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getInvoices(cookieHeader?: string) {
  return apiFetch<InvoiceRow[]>("/invoices", {
    method: "GET",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined
  });
}

export function getInvoice(invoiceId: string, cookieHeader?: string) {
  return apiFetch<InvoiceDetails>(`/invoices/${invoiceId}`, {
    method: "GET",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined
  });
}

export function markInvoicePaid(invoiceId: string) {
  return apiFetch<InvoiceDetails>(`/invoices/${invoiceId}/mark-paid`, {
    method: "PATCH"
  });
}

export function sendInvoiceEmail(invoiceId: string) {
  return apiFetch<{ message: string; fake_email: Record<string, string> }>(
    `/invoices/${invoiceId}/send-email`,
    {
      method: "POST"
    }
  );
}

export function deleteInvoice(invoiceId: string) {
  return apiFetch<{ message: string }>(`/invoices/${invoiceId}`, {
    method: "DELETE"
  });
}

export function getInvoiceDownloadUrl(invoiceId: string) {
  return `${getApiBaseUrl()}/invoices/${invoiceId}/download`;
}
