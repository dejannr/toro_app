from datetime import date
from decimal import Decimal

from app.models.company import Company
from app.models.invoice import Invoice
from app.services.invoice_service import (
    build_invoice_email_preview,
    build_next_invoice_number,
)


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
