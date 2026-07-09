import { apiFetch } from "@/lib/api";

export type CompanyInformation = {
  id: string;
  legal_name: string;
  trade_name: string | null;
  billing_email: string | null;
  phone_number: string | null;
  website: string | null;
  dot_number: string | null;
  mc_number: string | null;
  ein_number: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  remittance_name: string | null;
  remittance_address_line1: string | null;
  remittance_address_line2: string | null;
  remittance_city: string | null;
  remittance_state: string | null;
  remittance_postal_code: string | null;
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
