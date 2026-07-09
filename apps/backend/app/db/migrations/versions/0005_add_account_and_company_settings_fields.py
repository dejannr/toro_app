"""add account and company settings fields

Revision ID: 0005_account_company_settings
Revises: 0004_invoices
Create Date: 2026-07-10 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0005_account_company_settings"
down_revision: str | None = "0004_invoices"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "users", sa.Column("phone_number", sa.String(length=40), nullable=True)
    )
    op.add_column("users", sa.Column("job_title", sa.String(length=100), nullable=True))
    op.add_column(
        "users",
        sa.Column(
            "notification_preferences",
            sa.JSON(),
            nullable=False,
            server_default=sa.text("'{}'::json"),
        ),
    )

    op.add_column(
        "companies", sa.Column("phone_number", sa.String(length=40), nullable=True)
    )
    op.add_column(
        "companies", sa.Column("website", sa.String(length=160), nullable=True)
    )
    op.add_column(
        "companies", sa.Column("dot_number", sa.String(length=40), nullable=True)
    )
    op.add_column(
        "companies", sa.Column("mc_number", sa.String(length=40), nullable=True)
    )
    op.add_column(
        "companies", sa.Column("ein_number", sa.String(length=40), nullable=True)
    )
    op.add_column(
        "companies",
        sa.Column("remittance_name", sa.String(length=160), nullable=True),
    )
    op.add_column(
        "companies",
        sa.Column("remittance_address_line1", sa.String(length=160), nullable=True),
    )
    op.add_column(
        "companies",
        sa.Column("remittance_address_line2", sa.String(length=160), nullable=True),
    )
    op.add_column(
        "companies",
        sa.Column("remittance_city", sa.String(length=120), nullable=True),
    )
    op.add_column(
        "companies",
        sa.Column("remittance_state", sa.String(length=120), nullable=True),
    )
    op.add_column(
        "companies",
        sa.Column("remittance_postal_code", sa.String(length=40), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("companies", "remittance_postal_code")
    op.drop_column("companies", "remittance_state")
    op.drop_column("companies", "remittance_city")
    op.drop_column("companies", "remittance_address_line2")
    op.drop_column("companies", "remittance_address_line1")
    op.drop_column("companies", "remittance_name")
    op.drop_column("companies", "ein_number")
    op.drop_column("companies", "mc_number")
    op.drop_column("companies", "dot_number")
    op.drop_column("companies", "website")
    op.drop_column("companies", "phone_number")
    op.drop_column("users", "notification_preferences")
    op.drop_column("users", "job_title")
    op.drop_column("users", "phone_number")
