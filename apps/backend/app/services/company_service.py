from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.company import Company
from app.models.company_membership import CompanyMembership
from app.models.user import User


async def get_user_with_company(session: AsyncSession, user_id: object) -> User | None:
    result = await session.execute(
        select(User)
        .options(
            selectinload(User.company_memberships).selectinload(
                CompanyMembership.company,
            )
        )
        .where(User.id == user_id)
    )
    return result.scalar_one_or_none()


def get_primary_membership(user: User) -> CompanyMembership | None:
    if not user.company_memberships:
        return None
    return user.company_memberships[0]


async def create_company_with_owner(
    session: AsyncSession,
    user: User,
    legal_name: str,
    trade_name: str | None,
) -> CompanyMembership:
    company = Company(
        legal_name=legal_name.strip(),
        trade_name=trade_name.strip() if trade_name else None,
    )
    membership = CompanyMembership(user=user, company=company, role="owner")
    session.add(company)
    session.add(membership)
    await session.commit()
    await session.refresh(membership, attribute_names=["company", "user"])
    return membership
