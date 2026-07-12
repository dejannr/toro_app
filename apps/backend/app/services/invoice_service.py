import asyncio
from collections.abc import Sequence
from datetime import UTC, date, datetime, timedelta
from decimal import Decimal
from io import BytesIO

from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.company import Company
from app.models.invoice import Invoice, InvoiceStatus
from app.schemas.dashboard import DashboardSummary
from app.schemas.invoice import (
    CreateInvoiceRequest,
    InvoiceDraftResponse,
    InvoiceRead,
    InvoiceSendEmailResponse,
    InvoiceTableRow,
)

MOCK_DRAFT = {
    "broker_name": "ABC Logistics",
    "address": "455 W Monroe Street, Chicago, IL 60606",
    "email": "ap@abclogistics.com",
    "load_number": "123456",
    "pickup": "Chicago, IL",
    "delivery": "Dallas, TX",
    "pickup_date": date(2026, 7, 10),
    "delivery_date": date(2026, 7, 12),
    "linehaul": Decimal("2350.00"),
    "additional_charges": Decimal("0.00"),
}


def build_next_invoice_number(company: Company, existing_count: int) -> str:
    prefix = company.invoice_prefix.strip() or "INV"
    return f"{prefix}-{1001 + existing_count}"


async def generate_mock_invoice_draft(
    session: AsyncSession,
    company: Company,
    bol_filename: str,
    rate_confirmation_filename: str,
) -> InvoiceDraftResponse:
    await asyncio.sleep(1.2)
    count = await count_company_invoices(session, company.id)
    invoice_number = build_next_invoice_number(company, count)
    total = MOCK_DRAFT["linehaul"] + MOCK_DRAFT["additional_charges"]
    due_date = MOCK_DRAFT["delivery_date"] + timedelta(days=company.payment_terms_days)

    return InvoiceDraftResponse(
        invoice_number=invoice_number,
        bill_to={
            "broker_name": MOCK_DRAFT["broker_name"],
            "address": MOCK_DRAFT["address"],
            "email": MOCK_DRAFT["email"],
        },
        load_information={
            "load_number": MOCK_DRAFT["load_number"],
            "pickup": MOCK_DRAFT["pickup"],
            "delivery": MOCK_DRAFT["delivery"],
            "pickup_date": MOCK_DRAFT["pickup_date"],
            "delivery_date": MOCK_DRAFT["delivery_date"],
        },
        charges={
            "linehaul": float(MOCK_DRAFT["linehaul"]),
            "additional_charges": float(MOCK_DRAFT["additional_charges"]),
            "total": float(total),
        },
        payment_terms={
            "due_date": due_date,
            "payment_terms": company.payment_terms_label,
        },
        bol_filename=bol_filename,
        rate_confirmation_filename=rate_confirmation_filename,
    )


async def count_company_invoices(session: AsyncSession, company_id: object) -> int:
    result = await session.execute(
        select(func.count(Invoice.id)).where(Invoice.company_id == company_id)
    )
    return int(result.scalar_one() or 0)


def invoice_to_read(invoice: Invoice) -> InvoiceRead:
    return InvoiceRead(
        id=str(invoice.id),
        invoice_number=invoice.invoice_number,
        customer_name=invoice.customer_name,
        customer_address=invoice.customer_address,
        customer_email=invoice.customer_email,
        load_number=invoice.load_number,
        pickup_location=invoice.pickup_location,
        delivery_location=invoice.delivery_location,
        pickup_date=invoice.pickup_date,
        delivery_date=invoice.delivery_date,
        linehaul_amount=float(invoice.linehaul_amount),
        additional_charges_amount=float(invoice.additional_charges_amount),
        total_amount=float(invoice.total_amount),
        due_date=invoice.due_date,
        payment_terms=invoice.payment_terms,
        status=invoice.status,
        bol_filename=invoice.bol_filename,
        rate_confirmation_filename=invoice.rate_confirmation_filename,
        created_at=invoice.created_at,
        paid_at=invoice.paid_at,
    )


def invoice_to_table_row(invoice: Invoice) -> InvoiceTableRow:
    return InvoiceTableRow(
        id=str(invoice.id),
        invoice_number=invoice.invoice_number,
        customer=invoice.customer_name,
        load_number=invoice.load_number,
        amount=float(invoice.total_amount),
        status=invoice.status,
        date=invoice.created_at.date(),
    )


async def create_invoice(
    session: AsyncSession,
    company: Company,
    payload: CreateInvoiceRequest,
) -> Invoice:
    invoice = Invoice(
        company_id=company.id,
        invoice_number=payload.invoice_number.strip(),
        customer_name=payload.bill_to.broker_name.strip(),
        customer_address=(
            payload.bill_to.address.strip() if payload.bill_to.address else None
        ),
        customer_email=str(payload.bill_to.email) if payload.bill_to.email else None,
        load_number=payload.load_information.load_number.strip(),
        pickup_location=payload.load_information.pickup.strip(),
        delivery_location=payload.load_information.delivery.strip(),
        pickup_date=payload.load_information.pickup_date,
        delivery_date=payload.load_information.delivery_date,
        linehaul_amount=Decimal(str(payload.charges.linehaul)),
        additional_charges_amount=Decimal(str(payload.charges.additional_charges)),
        total_amount=Decimal(str(payload.charges.total)),
        due_date=payload.payment_terms.due_date,
        payment_terms=payload.payment_terms.payment_terms.strip(),
        status=InvoiceStatus.UNPAID.value,
        bol_filename=payload.bol_filename.strip(),
        rate_confirmation_filename=payload.rate_confirmation_filename.strip(),
    )
    session.add(invoice)
    await session.commit()
    await session.refresh(invoice)
    return invoice


async def list_company_invoices(
    session: AsyncSession,
    company_id: object,
) -> list[Invoice]:
    result = await session.execute(
        select(Invoice)
        .where(Invoice.company_id == company_id)
        .order_by(Invoice.created_at.desc())
    )
    return list(result.scalars().all())


async def get_company_invoice(
    session: AsyncSession,
    company_id: object,
    invoice_id: object,
) -> Invoice | None:
    result = await session.execute(
        select(Invoice).where(
            Invoice.company_id == company_id,
            Invoice.id == invoice_id,
        )
    )
    return result.scalar_one_or_none()


async def mark_invoice_paid(session: AsyncSession, invoice: Invoice) -> Invoice:
    invoice.status = InvoiceStatus.PAID.value
    invoice.paid_at = datetime.now(UTC)
    session.add(invoice)
    await session.commit()
    await session.refresh(invoice)
    return invoice


async def delete_invoice(session: AsyncSession, invoice: Invoice) -> None:
    await session.delete(invoice)
    await session.commit()


async def get_dashboard_summary(
    session: AsyncSession,
    company_id: object,
) -> DashboardSummary:
    invoices = await list_company_invoices(session, company_id)
    now = datetime.now(UTC)
    paid_this_month = Decimal("0.00")

    for invoice in invoices:
        if (
            invoice.status == InvoiceStatus.PAID.value
            and invoice.paid_at is not None
            and invoice.paid_at.year == now.year
            and invoice.paid_at.month == now.month
        ):
            paid_this_month += Decimal(str(invoice.total_amount))

    recent = [invoice_to_table_row(invoice) for invoice in invoices[:5]]
    unpaid_count = sum(
        1 for invoice in invoices if invoice.status == InvoiceStatus.UNPAID.value
    )

    return DashboardSummary(
        unpaid_invoices=unpaid_count,
        paid_this_month=float(paid_this_month),
        recent_invoices=recent,
    )


def build_invoice_email_preview(invoice: Invoice) -> InvoiceSendEmailResponse:
    return InvoiceSendEmailResponse(
        message="Invoice email queued in fake mode",
        fake_email={
            "to": invoice.customer_email or "billing@example.com",
            "subject": f"Invoice {invoice.invoice_number}",
            "body": (
                f"Attached invoice {invoice.invoice_number} for load "
                f"{invoice.load_number} in the amount of "
                f"${float(invoice.total_amount):,.2f}."
            ),
        },
    )


def build_invoice_pdf(invoice: Invoice, company: Company) -> bytes:
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=LETTER)
    width, height = LETTER
    y = height - 72

    rows: Sequence[tuple[str, str]] = (
        ("Company", company.legal_name),
        ("Invoice #", invoice.invoice_number),
        ("Customer", invoice.customer_name),
        ("Load #", invoice.load_number),
        ("Pickup", invoice.pickup_location),
        ("Delivery", invoice.delivery_location),
        ("Pickup Date", invoice.pickup_date.isoformat()),
        ("Delivery Date", invoice.delivery_date.isoformat()),
        ("Linehaul", f"${float(invoice.linehaul_amount):,.2f}"),
        ("Additional Charges", f"${float(invoice.additional_charges_amount):,.2f}"),
        ("Total", f"${float(invoice.total_amount):,.2f}"),
        ("Status", invoice.status),
    )

    pdf.setTitle(f"{invoice.invoice_number}.pdf")
    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(72, y, "Toro Invoice")
    y -= 36

    pdf.setFont("Helvetica", 11)
    for label, value in rows:
        pdf.drawString(72, y, f"{label}: {value}")
        y -= 20

    pdf.showPage()
    pdf.save()
    return buffer.getvalue()
