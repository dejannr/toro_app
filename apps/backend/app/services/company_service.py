from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.company import Company
from app.models.company_membership import CompanyMembership
from app.models.user import User
from app.schemas.dashboard import CompanySetupSection, CompanySetupSummary


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


def get_company_setup_summary(company: Company) -> CompanySetupSummary:
    """Derive dashboard setup groups from fields already managed in Company settings."""

    sections = [
        CompanySetupSection(
            key="company_profile",
            label="Company profile",
            complete=all(
                [
                    company.legal_name,
                    company.billing_email,
                    company.phone_number,
                    company.address_line1,
                    company.city,
                    company.state,
                    company.postal_code,
                ]
            ),
        ),
        CompanySetupSection(
            key="billing_remittance",
            label="Billing and remittance",
            complete=all(
                [
                    company.remittance_name,
                    company.remittance_address_line1,
                    company.remittance_city,
                    company.remittance_state,
                    company.remittance_postal_code,
                ]
            ),
        ),
        CompanySetupSection(
            key="invoice_settings",
            label="Invoice settings",
            complete=all(
                [
                    company.invoice_prefix,
                    company.payment_terms_label,
                    company.payment_terms_days >= 0,
                ]
            ),
        ),
    ]
    completed_sections = sum(section.complete for section in sections)

    return CompanySetupSummary(
        completed_sections=completed_sections,
        total_sections=len(sections),
        sections=sections,
    )


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
    phone_number: str | None,
    website: str | None,
    dot_number: str | None,
    mc_number: str | None,
    ein_number: str | None,
    address_line1: str | None,
    address_line2: str | None,
    city: str | None,
    state: str | None,
    postal_code: str | None,
    remittance_name: str | None,
    remittance_address_line1: str | None,
    remittance_address_line2: str | None,
    remittance_city: str | None,
    remittance_state: str | None,
    remittance_postal_code: str | None,
    invoice_prefix: str,
    payment_terms_label: str,
    payment_terms_days: int,
) -> Company:
    company.legal_name = legal_name.strip()
    company.trade_name = trade_name.strip() if trade_name else None
    company.billing_email = billing_email.strip() if billing_email else None
    company.phone_number = phone_number.strip() if phone_number else None
    company.website = website.strip() if website else None
    company.dot_number = dot_number.strip() if dot_number else None
    company.mc_number = mc_number.strip() if mc_number else None
    company.ein_number = ein_number.strip() if ein_number else None
    company.address_line1 = address_line1.strip() if address_line1 else None
    company.address_line2 = address_line2.strip() if address_line2 else None
    company.city = city.strip() if city else None
    company.state = state.strip() if state else None
    company.postal_code = postal_code.strip() if postal_code else None
    company.remittance_name = remittance_name.strip() if remittance_name else None
    company.remittance_address_line1 = (
        remittance_address_line1.strip() if remittance_address_line1 else None
    )
    company.remittance_address_line2 = (
        remittance_address_line2.strip() if remittance_address_line2 else None
    )
    company.remittance_city = remittance_city.strip() if remittance_city else None
    company.remittance_state = remittance_state.strip() if remittance_state else None
    company.remittance_postal_code = (
        remittance_postal_code.strip() if remittance_postal_code else None
    )
    company.invoice_prefix = invoice_prefix.strip()
    company.payment_terms_label = payment_terms_label.strip()
    company.payment_terms_days = payment_terms_days

    session.add(company)
    await session.commit()
    await session.refresh(company)
    return company
