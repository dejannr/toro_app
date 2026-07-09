import { apiFetch } from "@/lib/api";

export type CompanyInformation = {
  id: string;
  legal_name: string;
  trade_name: string | null;
  billing_email: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  invoice_prefix: string;
  payment_terms_label: string;
  payment_terms_days: number;
};

export type CompanyMember = {
  id: string;
  full_name: string;
  email: string;
  role: string;
};

export type CompanyUpdateValues = Omit<CompanyInformation, "id">;

export function getCurrentCompany(cookieHeader?: string) {
  return apiFetch<CompanyInformation>("/companies/current", {
    method: "GET",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined
  });
}

export function updateCurrentCompany(values: CompanyUpdateValues) {
  return apiFetch<CompanyInformation>("/companies/current", {
    method: "PATCH",
    body: JSON.stringify(values)
  });
}

export function getCompanyMembers(cookieHeader?: string) {
  return apiFetch<CompanyMember[]>("/companies/current/members", {
    method: "GET",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined
  });
}
