from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.schemas.dashboard import DashboardSummary
from app.services.company_service import get_company_for_user
from app.services.invoice_service import get_dashboard_summary

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
async def summary(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> DashboardSummary:
    company = await get_company_for_user(session, user)
    if company is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Create or join a company before using the dashboard",
        )
    return await get_dashboard_summary(session, company.id)
