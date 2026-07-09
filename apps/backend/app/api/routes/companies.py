from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.schemas.company import (
    CompanyInformation,
    CompanyMemberRead,
    CompanyOnboardingRequest,
    CompanySummary,
    CompanyUpdateRequest,
)
from app.services.company_service import (
    create_company_with_owner,
    get_company_for_user,
    get_company_members,
    get_primary_membership,
    get_user_with_company,
    update_company,
)

router = APIRouter(prefix="/companies", tags=["companies"])


@router.post(
    "/onboarding",
    response_model=CompanySummary,
    status_code=status.HTTP_201_CREATED,
)
async def create_company_onboarding(
    payload: CompanyOnboardingRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> CompanySummary:
    hydrated_user = await get_user_with_company(session, user.id) or user
    if not hydrated_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Confirm your email before creating a company",
        )

    existing_membership = get_primary_membership(hydrated_user)
    if existing_membership is not None and existing_membership.company is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A company is already linked to this account",
        )

    membership = await create_company_with_owner(
        session,
        hydrated_user,
        payload.legal_name,
        payload.trade_name,
    )
    return CompanySummary(
        id=str(membership.company.id),
        legal_name=membership.company.legal_name,
        role=membership.role,
    )


@router.get("/current", response_model=CompanyInformation)
async def get_current_company(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> CompanyInformation:
    company = await get_company_for_user(session, user)
    if company is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No company is linked to this account",
        )

    return CompanyInformation(
        id=str(company.id),
        legal_name=company.legal_name,
        trade_name=company.trade_name,
        billing_email=company.billing_email,
        address_line1=company.address_line1,
        address_line2=company.address_line2,
        city=company.city,
        state=company.state,
        postal_code=company.postal_code,
        invoice_prefix=company.invoice_prefix,
        payment_terms_label=company.payment_terms_label,
        payment_terms_days=company.payment_terms_days,
    )


@router.patch("/current", response_model=CompanyInformation)
async def patch_current_company(
    payload: CompanyUpdateRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> CompanyInformation:
    hydrated_user = await get_user_with_company(session, user.id) or user
    membership = get_primary_membership(hydrated_user)
    if membership is None or membership.company is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No company is linked to this account",
        )
    if membership.role != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the owner can update company settings",
        )

    company = await update_company(
        session,
        membership.company,
        legal_name=payload.legal_name,
        trade_name=payload.trade_name,
        billing_email=str(payload.billing_email) if payload.billing_email else None,
        address_line1=payload.address_line1,
        address_line2=payload.address_line2,
        city=payload.city,
        state=payload.state,
        postal_code=payload.postal_code,
        invoice_prefix=payload.invoice_prefix,
        payment_terms_label=payload.payment_terms_label,
        payment_terms_days=payload.payment_terms_days,
    )
    return CompanyInformation(
        id=str(company.id),
        legal_name=company.legal_name,
        trade_name=company.trade_name,
        billing_email=company.billing_email,
        address_line1=company.address_line1,
        address_line2=company.address_line2,
        city=company.city,
        state=company.state,
        postal_code=company.postal_code,
        invoice_prefix=company.invoice_prefix,
        payment_terms_label=company.payment_terms_label,
        payment_terms_days=company.payment_terms_days,
    )


@router.get("/current/members", response_model=list[CompanyMemberRead])
async def get_current_company_members(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[CompanyMemberRead]:
    company = await get_company_for_user(session, user)
    if company is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No company is linked to this account",
        )

    memberships = await get_company_members(session, company.id)
    return [
        CompanyMemberRead(
            id=str(membership.user.id),
            full_name=f"{membership.user.first_name} {membership.user.last_name}",
            email=membership.user.email,
            role=membership.role,
        )
        for membership in memberships
    ]
