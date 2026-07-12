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


class PaidTotalsBucket(BaseModel):
    period_start: date
    period_end: date
    paid_invoice_count: int
    paid_total: Decimal


class PaidTotalsChart(BaseModel):
    range_start: date
    range_end: date
    currency: str
    buckets: list[PaidTotalsBucket]


class InvoiceCreationBucket(BaseModel):
    period_start: date
    period_end: date
    invoice_count: int


class InvoiceCreationChart(BaseModel):
    range_start: date
    range_end: date
    buckets: list[InvoiceCreationBucket]


class InvoiceStatusDistributionItem(BaseModel):
    status: str
    invoice_count: int
    invoice_total: Decimal


class InvoiceStatusDistributionChart(BaseModel):
    currency: str
    items: list[InvoiceStatusDistributionItem]


class DashboardChartsData(BaseModel):
    paid_totals: PaidTotalsChart
    invoice_creation: InvoiceCreationChart
    status_distribution: InvoiceStatusDistributionChart


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
    recent_invoices: list[DashboardInvoice]
    company_setup: CompanySetupSummary
    charts: DashboardChartsData
