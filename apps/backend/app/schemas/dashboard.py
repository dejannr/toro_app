from datetime import date
from decimal import Decimal

from pydantic import BaseModel


class DashboardInvoice(BaseModel):
    id: str
    invoice_number: str
    customer: str
    amount: Decimal
    status: str
    date: date


class InvoiceStatusSummary(BaseModel):
    status: str
    count: int
    total: Decimal


class CompanySetupSection(BaseModel):
    key: str
    label: str
    complete: bool


class CompanySetupSummary(BaseModel):
    completed_sections: int
    total_sections: int
    sections: list[CompanySetupSection]


class DashboardSummary(BaseModel):
    total_invoices: int
    invoices_created_this_month: int
    unpaid_invoices: int
    unpaid_total: Decimal
    paid_this_month_invoices: int
    paid_this_month_total: Decimal
    draft_invoices: int
    status_breakdown: list[InvoiceStatusSummary]
    recent_invoices: list[DashboardInvoice]
    company_setup: CompanySetupSummary
