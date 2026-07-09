from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import get_settings
from app.core.redis import get_redis
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.db.session import get_db_session
from app.models.user import User
from app.schemas.account import (
    AccountProfileRead,
    AccountProfileUpdateRequest,
    ChangePasswordRequest,
    UpdateNotificationsRequest,
)
from app.schemas.auth import (
    CompanySummary,
    FakeEmailPreview,
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    RegisterResponse,
    ResetPasswordRequest,
    UserRead,
    VerifyEmailRequest,
    VerifyEmailResponse,
)
from app.services.auth_service import (
    authenticate_user,
    consume_email_verification_token,
    consume_password_reset_token,
    create_email_verification_token,
    create_password_reset_token,
    create_user,
    default_notification_preferences,
    get_user_by_email,
    get_user_by_id,
    update_notification_preferences,
    update_password,
    update_user_profile,
    verify_user_email,
)
from app.services.company_service import get_primary_membership, get_user_with_company

router = APIRouter(prefix="/auth", tags=["auth"])


def user_to_read(user: User) -> UserRead:
    membership = get_primary_membership(user)
    return UserRead(
        id=str(user.id),
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone_number=user.phone_number,
        job_title=user.job_title,
        is_active=user.is_active,
        is_verified=user.is_verified,
        company=(
            CompanySummary(
                id=str(membership.company.id),
                legal_name=membership.company.legal_name,
                role=membership.role,
            )
            if membership is not None and membership.company is not None
            else None
        ),
    )


def user_to_account_profile(user: User) -> AccountProfileRead:
    membership = get_primary_membership(user)
    return AccountProfileRead(
        id=str(user.id),
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone_number=user.phone_number,
        job_title=user.job_title,
        company=(
            CompanySummary(
                id=str(membership.company.id),
                legal_name=membership.company.legal_name,
                role=membership.role,
            )
            if membership is not None and membership.company is not None
            else None
        ),
        notification_preferences=(
            user.notification_preferences or default_notification_preferences()
        ),
    )


def set_auth_cookies(response: Response, user: User) -> None:
    settings = get_settings()
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    response.set_cookie(
        "access_token",
        access_token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )
    response.set_cookie(
        "refresh_token",
        refresh_token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
        path="/",
    )


def clear_auth_cookies(response: Response) -> None:
    settings = get_settings()
    for name in ("access_token", "refresh_token"):
        response.delete_cookie(
            name,
            httponly=True,
            secure=settings.cookie_secure,
            samesite=settings.cookie_samesite,
            path="/",
        )


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    payload: RegisterRequest,
    redis: Redis = Depends(get_redis),
    session: AsyncSession = Depends(get_db_session),
) -> RegisterResponse:
    existing_user = await get_user_by_email(session, payload.email)
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    user = await create_user(
        session,
        payload.first_name,
        payload.last_name,
        payload.email,
        payload.password,
    )
    token = await create_email_verification_token(redis, user)
    settings = get_settings()
    verify_url = (
        f"{str(settings.frontend_url).rstrip('/')}/app/verify-email?token={token}"
    )
    return RegisterResponse(
        message="Account created. Confirm your email to continue to onboarding.",
        fake_email=FakeEmailPreview(
            to=user.email,
            subject="Confirm your Toro account",
            verify_url=verify_url,
        ),
    )


@router.post("/verify-email", response_model=VerifyEmailResponse)
async def verify_email(
    payload: VerifyEmailRequest,
    response: Response,
    redis: Redis = Depends(get_redis),
    session: AsyncSession = Depends(get_db_session),
) -> VerifyEmailResponse:
    user_id = await consume_email_verification_token(redis, payload.token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token",
        )

    user = await get_user_by_id(session, UUID(user_id))
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token",
        )

    if not user.is_verified:
        await verify_user_email(session, user)

    hydrated_user = await get_user_with_company(session, user.id) or user
    set_auth_cookies(response, hydrated_user)
    return VerifyEmailResponse(
        message="Email verified",
        onboarding_path="/app/dashboard",
        user=user_to_read(hydrated_user),
    )


@router.post("/login", response_model=UserRead)
async def login(
    payload: LoginRequest,
    response: Response,
    session: AsyncSession = Depends(get_db_session),
) -> UserRead:
    user = await authenticate_user(session, payload.email, payload.password)
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Confirm your email before logging in",
        )

    hydrated_user = await get_user_with_company(session, user.id) or user
    set_auth_cookies(response, hydrated_user)
    return user_to_read(hydrated_user)


@router.post("/logout", response_model=MessageResponse)
async def logout(response: Response) -> MessageResponse:
    clear_auth_cookies(response)
    return MessageResponse(message="Logged out")


@router.post("/refresh", response_model=MessageResponse)
async def refresh(
    response: Response,
    refresh_token: Annotated[str | None, Cookie()] = None,
    session: AsyncSession = Depends(get_db_session),
) -> MessageResponse:
    if refresh_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing refresh token",
        )
    try:
        user_id = decode_token(refresh_token, expected_type="refresh")
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        ) from exc

    user = await get_user_by_id(session, user_id)
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive or missing user",
        )

    hydrated_user = await get_user_with_company(session, user.id) or user
    set_auth_cookies(response, hydrated_user)
    return MessageResponse(message="Token refreshed")


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(
    payload: ForgotPasswordRequest,
    redis: Redis = Depends(get_redis),
    session: AsyncSession = Depends(get_db_session),
) -> MessageResponse:
    user = await get_user_by_email(session, payload.email)
    if user is not None and user.is_active:
        await create_password_reset_token(redis, user)
    return MessageResponse(
        message="If an account exists, reset instructions will be sent",
    )


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(
    payload: ResetPasswordRequest,
    session: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
) -> MessageResponse:
    user_id = await consume_password_reset_token(redis, payload.token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )
    user = await get_user_by_id(session, UUID(user_id))
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )
    await update_password(session, user, payload.password)
    return MessageResponse(message="Password reset complete")


@router.get("/me", response_model=UserRead)
async def me(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> UserRead:
    hydrated_user = await get_user_with_company(session, user.id) or user
    return user_to_read(hydrated_user)


@router.get("/account", response_model=AccountProfileRead)
async def account_profile(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> AccountProfileRead:
    hydrated_user = await get_user_with_company(session, user.id) or user
    return user_to_account_profile(hydrated_user)


@router.patch("/account", response_model=AccountProfileRead)
async def patch_account_profile(
    payload: AccountProfileUpdateRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> AccountProfileRead:
    updated_user = await update_user_profile(
        session,
        user,
        first_name=payload.first_name,
        last_name=payload.last_name,
        phone_number=payload.phone_number,
        job_title=payload.job_title,
    )
    hydrated_user = (
        await get_user_with_company(session, updated_user.id) or updated_user
    )
    return user_to_account_profile(hydrated_user)


@router.patch("/account/password", response_model=MessageResponse)
async def patch_account_password(
    payload: ChangePasswordRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> MessageResponse:
    authenticated_user = await authenticate_user(
        session,
        user.email,
        payload.current_password,
    )
    if authenticated_user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    await update_password(session, user, payload.new_password)
    return MessageResponse(message="Password updated")


@router.patch("/account/notifications", response_model=AccountProfileRead)
async def patch_account_notifications(
    payload: UpdateNotificationsRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> AccountProfileRead:
    updated_user = await update_notification_preferences(
        session,
        user,
        payload.notification_preferences.model_dump(),
    )
    hydrated_user = (
        await get_user_with_company(session, updated_user.id) or updated_user
    )
    return user_to_account_profile(hydrated_user)
