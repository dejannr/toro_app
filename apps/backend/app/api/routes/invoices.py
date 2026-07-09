from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.schemas.invoice import (
    CreateInvoiceRequest,
    InvoiceDraftResponse,
    InvoiceRead,
    InvoiceSendEmailResponse,
    InvoiceTableRow,
)
from app.services.company_service import get_company_for_user
from app.services.invoice_service import (
    build_invoice_email_preview,
    build_invoice_pdf,
    create_invoice,
    generate_mock_invoice_draft,
    get_company_invoice,
    invoice_to_read,
    invoice_to_table_row,
    list_company_invoices,
    mark_invoice_paid,
)

router = APIRouter(prefix="/invoices", tags=["invoices"])


async def require_company(
    session: AsyncSession,
    user: User,
):
    company = await get_company_for_user(session, user)
    if company is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Create or join a company before using invoices",
        )
    return company


@router.post("/draft", response_model=InvoiceDraftResponse)
async def draft_invoice(
    bol_file: UploadFile = File(...),
    rate_confirmation_file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> InvoiceDraftResponse:
    company = await require_company(session, user)
    return await generate_mock_invoice_draft(
        session,
        company,
        bol_file.filename or "bill-of-lading.pdf",
        rate_confirmation_file.filename or "rate-confirmation.pdf",
    )


@router.post("", response_model=InvoiceRead, status_code=status.HTTP_201_CREATED)
async def post_invoice(
    payload: CreateInvoiceRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> InvoiceRead:
    company = await require_company(session, user)
    invoice = await create_invoice(session, company, payload)
    return invoice_to_read(invoice)


@router.get("", response_model=list[InvoiceTableRow])
async def get_invoices(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[InvoiceTableRow]:
    company = await require_company(session, user)
    invoices = await list_company_invoices(session, company.id)
    return [invoice_to_table_row(invoice) for invoice in invoices]


@router.get("/{invoice_id}", response_model=InvoiceRead)
async def get_invoice(
    invoice_id: UUID,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> InvoiceRead:
    company = await require_company(session, user)
    invoice = await get_company_invoice(session, company.id, invoice_id)
    if invoice is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found",
        )
    return invoice_to_read(invoice)


@router.post("/{invoice_id}/send-email", response_model=InvoiceSendEmailResponse)
async def send_invoice_email(
    invoice_id: UUID,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> InvoiceSendEmailResponse:
    company = await require_company(session, user)
    invoice = await get_company_invoice(session, company.id, invoice_id)
    if invoice is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found",
        )
    return build_invoice_email_preview(invoice)


@router.patch("/{invoice_id}/mark-paid", response_model=InvoiceRead)
async def patch_mark_paid(
    invoice_id: UUID,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> InvoiceRead:
    company = await require_company(session, user)
    invoice = await get_company_invoice(session, company.id, invoice_id)
    if invoice is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found",
        )
    invoice = await mark_invoice_paid(session, invoice)
    return invoice_to_read(invoice)


@router.get("/{invoice_id}/download")
async def download_invoice_pdf(
    invoice_id: UUID,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
):
    company = await require_company(session, user)
    invoice = await get_company_invoice(session, company.id, invoice_id)
    if invoice is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found",
        )

    pdf_bytes = build_invoice_pdf(invoice, company)
    return StreamingResponse(
        iter([pdf_bytes]),
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                f'attachment; filename="{invoice.invoice_number}.pdf"'
            )
        },
    )
