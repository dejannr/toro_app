from datetime import UTC, date, datetime
from decimal import Decimal
from unittest.mock import AsyncMock

from app.models.company import Company
from app.models.invoice import Invoice
from app.services.company_service import get_company_setup_summary
from app.services.invoice_service import (
    build_invoice_email_preview,
    build_next_invoice_number,
    get_dashboard_summary,
)


class QueryResult:
    def __init__(self, value: object):
        self.value = value

    def all(self):
        return self.value

    def one(self):
        return self.value

    def scalar_one(self):
        return self.value

    def scalars(self):
        return self


def test_build_next_invoice_number_uses_prefix_and_sequence():
    company = Company(
        legal_name="Toro Freight",
        invoice_prefix="TOR",
        payment_terms_label="Net 30",
        payment_terms_days=30,
    )

    assert build_next_invoice_number(company, 0) == "TOR-1001"
    assert build_next_invoice_number(company, 14) == "TOR-1015"


def test_build_invoice_email_preview_returns_fake_payload():
    invoice = Invoice(
        company_id="00000000-0000-0000-0000-000000000000",
        invoice_number="INV-1001",
        customer_name="ABC Logistics",
        customer_email="billing@abc.test",
        load_number="123456",
        pickup_location="Chicago, IL",
        delivery_location="Dallas, TX",
        pickup_date=date(2026, 7, 10),
        delivery_date=date(2026, 7, 12),
        linehaul_amount=Decimal("2350.00"),
        additional_charges_amount=Decimal("0.00"),
        total_amount=Decimal("2350.00"),
        due_date=date(2026, 8, 11),
        payment_terms="Net 30",
        status="Unpaid",
        bol_filename="bol.pdf",
        rate_confirmation_filename="ratecon.pdf",
    )

    preview = build_invoice_email_preview(invoice)

    assert preview.fake_email["to"] == "billing@abc.test"
    assert preview.fake_email["subject"] == "Invoice INV-1001"
    assert "123456" in preview.fake_email["body"]


def test_company_setup_summary_uses_company_settings_groups():
    company = Company(
        legal_name="Toro Freight",
        billing_email="billing@toro.test",
        phone_number="555-0100",
        address_line1="100 Main Street",
        city="Chicago",
        state="IL",
        postal_code="60601",
        remittance_name="Toro Freight",
        remittance_address_line1="100 Main Street",
        remittance_city="Chicago",
        remittance_state="IL",
        remittance_postal_code="60601",
        invoice_prefix="TOR",
        payment_terms_label="Net 30",
        payment_terms_days=30,
    )

    summary = get_company_setup_summary(company)

    assert summary.completed_sections == 3
    assert all(section.complete for section in summary.sections)


def test_company_setup_summary_keeps_incomplete_groups_visible():
    company = Company(
        legal_name="Toro Freight",
        invoice_prefix="TOR",
        payment_terms_label="Net 30",
        payment_terms_days=30,
    )

    summary = get_company_setup_summary(company)

    assert summary.completed_sections == 1
    assert [section.key for section in summary.sections if not section.complete] == [
        "company_profile",
        "billing_remittance",
    ]


async def test_dashboard_summary_uses_real_invoice_aggregates_and_recent_rows():
    company = Company(
        legal_name="Toro Freight",
        billing_email="billing@toro.test",
        phone_number="555-0100",
        address_line1="100 Main Street",
        city="Chicago",
        state="IL",
        postal_code="60601",
        remittance_name="Toro Freight",
        remittance_address_line1="100 Main Street",
        remittance_city="Chicago",
        remittance_state="IL",
        remittance_postal_code="60601",
        invoice_prefix="TOR",
        payment_terms_label="Net 30",
        payment_terms_days=30,
    )
    invoice = Invoice(
        company_id=company.id,
        invoice_number="TOR-1003",
        customer_name="ABC Logistics",
        load_number="123456",
        pickup_location="Chicago, IL",
        delivery_location="Dallas, TX",
        pickup_date=date(2026, 7, 10),
        delivery_date=date(2026, 7, 12),
        linehaul_amount=Decimal("2350.00"),
        additional_charges_amount=Decimal("0.00"),
        total_amount=Decimal("2350.00"),
        due_date=date(2026, 8, 11),
        payment_terms="Net 30",
        status="Unpaid",
        bol_filename="bol.pdf",
        rate_confirmation_filename="ratecon.pdf",
        created_at=datetime(2026, 7, 12, tzinfo=UTC),
        updated_at=datetime(2026, 7, 13, tzinfo=UTC),
    )
    session = AsyncMock()
    session.execute.side_effect = [
        QueryResult(
            [
                ("Draft", 1, Decimal("100.00")),
                ("Unpaid", 2, Decimal("2500.00")),
                ("Paid", 3, Decimal("5000.00")),
            ]
        ),
        QueryResult((2, Decimal("3100.00"))),
        QueryResult(4),
        QueryResult([invoice]),
    ]

    summary = await get_dashboard_summary(session, company)

    assert summary.total_invoices == 6
    assert summary.unpaid_invoices == 2
    assert summary.unpaid_total == Decimal("2500.00")
    assert summary.paid_this_month_invoices == 2
    assert summary.paid_this_month_total == Decimal("3100.00")
    assert summary.invoices_created_this_month == 4
    assert summary.draft_invoices == 1
    assert summary.recent_invoices[0].invoice_number == "TOR-1003"
    assert summary.recent_invoices[0].date == date(2026, 7, 13)
    assert summary.company_setup.completed_sections == 3
    assert "paid_at" in str(session.execute.call_args_list[1].args[0])
