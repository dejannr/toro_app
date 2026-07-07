from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.schemas.auth import CompanyOnboardingRequest, CompanySummary
from app.services.company_service import (
    create_company_with_owner,
    get_primary_membership,
    get_user_with_company,
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
