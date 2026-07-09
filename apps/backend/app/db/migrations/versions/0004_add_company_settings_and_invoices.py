"""add company settings and invoices

Revision ID: 0004_invoices
Revises: 0003_companies
Create Date: 2026-07-09 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0004_invoices"
down_revision: str | None = "0003_companies"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "companies",
        sa.Column("billing_email", sa.String(length=320), nullable=True),
    )
    op.add_column(
        "companies",
        sa.Column("address_line1", sa.String(length=160), nullable=True),
    )
    op.add_column(
        "companies",
        sa.Column("address_line2", sa.String(length=160), nullable=True),
    )
    op.add_column(
        "companies",
        sa.Column("city", sa.String(length=120), nullable=True),
    )
    op.add_column(
        "companies",
        sa.Column("state", sa.String(length=120), nullable=True),
    )
    op.add_column(
        "companies",
        sa.Column("postal_code", sa.String(length=40), nullable=True),
    )
    op.add_column(
        "companies",
        sa.Column(
            "invoice_prefix",
            sa.String(length=20),
            nullable=False,
            server_default="INV",
        ),
    )
    op.add_column(
        "companies",
        sa.Column(
            "payment_terms_label",
            sa.String(length=80),
            nullable=False,
            server_default="Net 30",
        ),
    )
    op.add_column(
        "companies",
        sa.Column(
            "payment_terms_days",
            sa.Integer(),
            nullable=False,
            server_default="30",
        ),
    )

    op.create_table(
        "invoices",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("company_id", sa.Uuid(), nullable=False),
        sa.Column("invoice_number", sa.String(length=40), nullable=False),
        sa.Column("customer_name", sa.String(length=160), nullable=False),
        sa.Column("customer_address", sa.String(length=320), nullable=True),
        sa.Column("customer_email", sa.String(length=320), nullable=True),
        sa.Column("load_number", sa.String(length=80), nullable=False),
        sa.Column("pickup_location", sa.String(length=160), nullable=False),
        sa.Column("delivery_location", sa.String(length=160), nullable=False),
        sa.Column("pickup_date", sa.Date(), nullable=False),
        sa.Column("delivery_date", sa.Date(), nullable=False),
        sa.Column("linehaul_amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("additional_charges_amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("total_amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("due_date", sa.Date(), nullable=False),
        sa.Column("payment_terms", sa.String(length=80), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("bol_filename", sa.String(length=255), nullable=False),
        sa.Column("rate_confirmation_filename", sa.String(length=255), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["company_id"], ["companies.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_invoices_company_id"),
        "invoices",
        ["company_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_invoices_invoice_number"),
        "invoices",
        ["invoice_number"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_invoices_invoice_number"), table_name="invoices")
    op.drop_index(op.f("ix_invoices_company_id"), table_name="invoices")
    op.drop_table("invoices")
    op.drop_column("companies", "payment_terms_days")
    op.drop_column("companies", "payment_terms_label")
    op.drop_column("companies", "invoice_prefix")
    op.drop_column("companies", "postal_code")
    op.drop_column("companies", "state")
    op.drop_column("companies", "city")
    op.drop_column("companies", "address_line2")
    op.drop_column("companies", "address_line1")
    op.drop_column("companies", "billing_email")
