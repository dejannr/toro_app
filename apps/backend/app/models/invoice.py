from datetime import date, datetime
from decimal import Decimal
from enum import StrEnum
from uuid import UUID, uuid4

from sqlalchemy import Date, DateTime, ForeignKey, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class InvoiceStatus(StrEnum):
    DRAFT = "Draft"
    UNPAID = "Unpaid"
    PAID = "Paid"


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    company_id: Mapped[UUID] = mapped_column(
        ForeignKey("companies.id", ondelete="CASCADE"),
        index=True,
    )
    invoice_number: Mapped[str] = mapped_column(String(40), index=True)
    customer_name: Mapped[str] = mapped_column(String(160))
    customer_address: Mapped[str | None] = mapped_column(String(320), nullable=True)
    customer_email: Mapped[str | None] = mapped_column(String(320), nullable=True)
    load_number: Mapped[str] = mapped_column(String(80))
    pickup_location: Mapped[str] = mapped_column(String(160))
    delivery_location: Mapped[str] = mapped_column(String(160))
    pickup_date: Mapped[date] = mapped_column(Date)
    delivery_date: Mapped[date] = mapped_column(Date)
    linehaul_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    additional_charges_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
    )
    total_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    due_date: Mapped[date] = mapped_column(Date)
    payment_terms: Mapped[str] = mapped_column(String(80))
    status: Mapped[str] = mapped_column(String(20), default=InvoiceStatus.UNPAID.value)
    bol_filename: Mapped[str] = mapped_column(String(255))
    rate_confirmation_filename: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
    paid_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    company = relationship("Company", back_populates="invoices")
