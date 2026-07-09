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


async def get_company_for_user(session: AsyncSession, user: User) -> Company | None:
    hydrated_user = await get_user_with_company(session, user.id)
    membership = get_primary_membership(hydrated_user or user)
    return membership.company if membership is not None else None


async def get_company_members(
    session: AsyncSession,
    company_id: object,
) -> list[CompanyMembership]:
    result = await session.execute(
        select(CompanyMembership)
        .options(selectinload(CompanyMembership.user))
        .where(CompanyMembership.company_id == company_id)
        .order_by(CompanyMembership.created_at.asc())
    )
    return list(result.scalars().all())


async def update_company(
    session: AsyncSession,
    company: Company,
    *,
    legal_name: str,
    trade_name: str | None,
    billing_email: str | None,
    address_line1: str | None,
    address_line2: str | None,
    city: str | None,
    state: str | None,
    postal_code: str | None,
    invoice_prefix: str,
    payment_terms_label: str,
    payment_terms_days: int,
) -> Company:
    company.legal_name = legal_name.strip()
    company.trade_name = trade_name.strip() if trade_name else None
    company.billing_email = billing_email.strip() if billing_email else None
    company.address_line1 = address_line1.strip() if address_line1 else None
    company.address_line2 = address_line2.strip() if address_line2 else None
    company.city = city.strip() if city else None
    company.state = state.strip() if state else None
    company.postal_code = postal_code.strip() if postal_code else None
    company.invoice_prefix = invoice_prefix.strip()
    company.payment_terms_label = payment_terms_label.strip()
    company.payment_terms_days = payment_terms_days

    session.add(company)
    await session.commit()
    await session.refresh(company)
    return company
