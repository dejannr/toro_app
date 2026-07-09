from datetime import date, datetime

from pydantic import BaseModel, EmailStr, Field


class InvoiceDraftBillTo(BaseModel):
    broker_name: str = Field(min_length=1, max_length=160)
    address: str | None = Field(default=None, max_length=320)
    email: EmailStr | None = None


class InvoiceDraftLoadInformation(BaseModel):
    load_number: str = Field(min_length=1, max_length=80)
    pickup: str = Field(min_length=1, max_length=160)
    delivery: str = Field(min_length=1, max_length=160)
    pickup_date: date
    delivery_date: date


class InvoiceDraftCharges(BaseModel):
    linehaul: float = Field(ge=0)
    additional_charges: float = Field(ge=0, default=0)
    total: float = Field(ge=0)


class InvoiceDraftPaymentTerms(BaseModel):
    due_date: date
    payment_terms: str = Field(min_length=1, max_length=80)


class InvoiceDraftResponse(BaseModel):
    invoice_number: str
    bill_to: InvoiceDraftBillTo
    load_information: InvoiceDraftLoadInformation
    charges: InvoiceDraftCharges
    payment_terms: InvoiceDraftPaymentTerms
    bol_filename: str
    rate_confirmation_filename: str


class CreateInvoiceRequest(BaseModel):
    invoice_number: str = Field(min_length=1, max_length=40)
    bill_to: InvoiceDraftBillTo
    load_information: InvoiceDraftLoadInformation
    charges: InvoiceDraftCharges
    payment_terms: InvoiceDraftPaymentTerms
    bol_filename: str = Field(min_length=1, max_length=255)
    rate_confirmation_filename: str = Field(min_length=1, max_length=255)


class InvoiceRead(BaseModel):
    id: str
    invoice_number: str
    customer_name: str
    customer_address: str | None = None
    customer_email: EmailStr | None = None
    load_number: str
    pickup_location: str
    delivery_location: str
    pickup_date: date
    delivery_date: date
    linehaul_amount: float
    additional_charges_amount: float
    total_amount: float
    due_date: date
    payment_terms: str
    status: str
    bol_filename: str
    rate_confirmation_filename: str
    created_at: datetime
    paid_at: datetime | None = None


class InvoiceTableRow(BaseModel):
    id: str
    invoice_number: str
    customer: str
    load_number: str
    amount: float
    status: str
    date: date


class InvoiceSendEmailResponse(BaseModel):
    message: str
    fake_email: dict[str, str]
