from pydantic import BaseModel

from app.schemas.invoice import InvoiceTableRow


class DashboardSummary(BaseModel):
    unpaid_invoices: int
    paid_this_month: float
    recent_invoices: list[InvoiceTableRow]
