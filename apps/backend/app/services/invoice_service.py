import asyncio
from collections.abc import Sequence
from datetime import UTC, date, datetime, time, timedelta
from decimal import Decimal
from io import BytesIO

from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.company import Company
from app.models.invoice import Invoice, InvoiceStatus
from app.schemas.dashboard import (
    DashboardChartsData,
    DashboardInvoice,
    DashboardSummary,
    InvoiceCreationBucket,
    InvoiceCreationChart,
    InvoiceStatusDistributionChart,
    InvoiceStatusDistributionItem,
    PaidTotalsBucket,
    PaidTotalsChart,
)
from app.schemas.invoice import (
    CreateInvoiceRequest,
    InvoiceDraftResponse,
    InvoiceRead,
    InvoiceSendEmailResponse,
    InvoiceTableRow,
)
from app.services.company_service import get_company_setup_summary

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


def get_recent_month_periods(now: datetime) -> list[tuple[date, date]]:
    current_month = now.date().replace(day=1)
    months: list[tuple[date, date]] = []

    for offset in range(5, -1, -1):
        month_index = current_month.month - 1 - offset
        year = current_month.year + month_index // 12
        month = month_index % 12 + 1
        period_start = date(year, month, 1)
        period_end = date(year + 1, 1, 1) if month == 12 else date(year, month + 1, 1)
        months.append((period_start, period_end))

    return months


def get_recent_week_periods(now: datetime) -> list[tuple[date, date]]:
    current_week_start = now.date() - timedelta(days=now.weekday())
    earliest_week_start = current_week_start - timedelta(weeks=11)
    return [
        (week_start, week_start + timedelta(days=7))
        for week_start in (
            earliest_week_start + timedelta(weeks=offset) for offset in range(12)
        )
    ]


def period_start_date(value: date | datetime) -> date:
    return value.date() if isinstance(value, datetime) else value


async def get_dashboard_summary(
    session: AsyncSession,
    company: Company,
    now: datetime | None = None,
) -> DashboardSummary:
    now = now or datetime.now(UTC)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    next_month_start = (
        month_start.replace(year=month_start.year + 1, month=1)
        if month_start.month == 12
        else month_start.replace(month=month_start.month + 1)
    )

    status_result = await session.execute(
        select(
            Invoice.status,
            func.count(Invoice.id),
            func.coalesce(func.sum(Invoice.total_amount), 0),
        )
        .where(Invoice.company_id == company.id)
        .group_by(Invoice.status)
    )
    status_totals = {
        status: (int(count), Decimal(str(total)))
        for status, count, total in status_result.all()
    }
    total_invoices = sum(count for count, _ in status_totals.values())
    unpaid_invoices, unpaid_total = status_totals.get(
        InvoiceStatus.UNPAID.value,
        (0, Decimal("0.00")),
    )
    draft_invoices = status_totals.get(InvoiceStatus.DRAFT.value, (0, Decimal("0.00")))[
        0
    ]

    paid_result = await session.execute(
        select(
            func.count(Invoice.id),
            func.coalesce(func.sum(Invoice.total_amount), 0),
        ).where(
            Invoice.company_id == company.id,
            Invoice.status == InvoiceStatus.PAID.value,
            Invoice.paid_at >= month_start,
            Invoice.paid_at < next_month_start,
        )
    )
    paid_this_month_invoices, paid_this_month_total = paid_result.one()

    created_this_month_result = await session.execute(
        select(func.count(Invoice.id)).where(
            Invoice.company_id == company.id,
            Invoice.created_at >= month_start,
            Invoice.created_at < next_month_start,
        )
    )

    recent_result = await session.execute(
        select(Invoice)
        .where(Invoice.company_id == company.id)
        .order_by(Invoice.updated_at.desc(), Invoice.created_at.desc())
        .limit(5)
    )
    recent_invoices = list(recent_result.scalars().all())
    month_periods = get_recent_month_periods(now)
    paid_range_start = datetime.combine(month_periods[0][0], time.min, tzinfo=UTC)
    paid_range_end = datetime.combine(month_periods[-1][1], time.min, tzinfo=UTC)
    # Truncate in UTC so PostgreSQL's session timezone cannot shift a month or
    # week boundary after asyncpg converts the value back to UTC.
    paid_period = func.date_trunc(
        "month",
        func.timezone("UTC", Invoice.paid_at),
    ).label("paid_period")
    paid_chart_result = await session.execute(
        select(
            paid_period,
            func.count(Invoice.id),
            func.coalesce(func.sum(Invoice.total_amount), 0),
        )
        .where(
            Invoice.company_id == company.id,
            Invoice.status == InvoiceStatus.PAID.value,
            Invoice.paid_at.is_not(None),
            Invoice.paid_at >= paid_range_start,
            Invoice.paid_at < paid_range_end,
        )
        .group_by(paid_period)
    )
    paid_totals_by_month = {
        period_start_date(period_start): (int(count), Decimal(str(total)))
        for period_start, count, total in paid_chart_result.all()
    }

    week_periods = get_recent_week_periods(now)
    creation_range_start = datetime.combine(week_periods[0][0], time.min, tzinfo=UTC)
    creation_range_end = datetime.combine(week_periods[-1][1], time.min, tzinfo=UTC)
    created_period = func.date_trunc(
        "week",
        func.timezone("UTC", Invoice.created_at),
    ).label("created_period")
    creation_chart_result = await session.execute(
        select(
            created_period,
            func.count(Invoice.id),
        )
        .where(
            Invoice.company_id == company.id,
            Invoice.created_at >= creation_range_start,
            Invoice.created_at < creation_range_end,
        )
        .group_by(created_period)
    )
    invoice_counts_by_week = {
        period_start_date(period_start): int(count)
        for period_start, count in creation_chart_result.all()
    }
    status_distribution = InvoiceStatusDistributionChart(
        currency="USD",
        items=[
            InvoiceStatusDistributionItem(
                status=status,
                invoice_count=status_totals.get(status, (0, Decimal("0.00")))[0],
                invoice_total=status_totals.get(status, (0, Decimal("0.00")))[1],
            )
            for status in (
                InvoiceStatus.UNPAID.value,
                InvoiceStatus.DRAFT.value,
                InvoiceStatus.PAID.value,
            )
        ]
        + [
            InvoiceStatusDistributionItem(
                status=status,
                invoice_count=count,
                invoice_total=total,
            )
            for status, (count, total) in status_totals.items()
            if status
            not in {
                InvoiceStatus.UNPAID.value,
                InvoiceStatus.DRAFT.value,
                InvoiceStatus.PAID.value,
            }
        ],
    )

    return DashboardSummary(
        total_invoices=total_invoices,
        invoices_created_this_month=int(created_this_month_result.scalar_one() or 0),
        unpaid_invoices=unpaid_invoices,
        unpaid_total=unpaid_total,
        paid_this_month_invoices=int(paid_this_month_invoices or 0),
        paid_this_month_total=Decimal(str(paid_this_month_total)),
        draft_invoices=draft_invoices,
        recent_invoices=[
            DashboardInvoice(
                id=str(invoice.id),
                invoice_number=invoice.invoice_number,
                customer=invoice.customer_name,
                amount=invoice.total_amount,
                status=invoice.status,
                date=invoice.updated_at.date(),
            )
            for invoice in recent_invoices
        ],
        company_setup=get_company_setup_summary(company),
        charts=DashboardChartsData(
            paid_totals=PaidTotalsChart(
                range_start=month_periods[0][0],
                range_end=month_periods[-1][1],
                currency="USD",
                buckets=[
                    PaidTotalsBucket(
                        period_start=period_start,
                        period_end=period_end,
                        paid_invoice_count=paid_totals_by_month.get(
                            period_start,
                            (0, Decimal("0.00")),
                        )[0],
                        paid_total=paid_totals_by_month.get(
                            period_start,
                            (0, Decimal("0.00")),
                        )[1],
                    )
                    for period_start, period_end in month_periods
                ],
            ),
            invoice_creation=InvoiceCreationChart(
                range_start=week_periods[0][0],
                range_end=week_periods[-1][1],
                buckets=[
                    InvoiceCreationBucket(
                        period_start=period_start,
                        period_end=period_end,
                        invoice_count=invoice_counts_by_week.get(period_start, 0),
                    )
                    for period_start, period_end in week_periods
                ],
            ),
            status_distribution=status_distribution,
        ),
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
