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
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResetPasswordRequest,
    UserRead,
)
from app.services.auth_service import (
    authenticate_user,
    consume_password_reset_token,
    create_password_reset_token,
    create_user,
    get_user_by_email,
    get_user_by_id,
    update_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def user_to_read(user: User) -> UserRead:
    return UserRead(
        id=str(user.id),
        email=user.email,
        is_active=user.is_active,
        is_verified=user.is_verified,
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


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(
    payload: RegisterRequest,
    response: Response,
    session: AsyncSession = Depends(get_db_session),
) -> UserRead:
    existing_user = await get_user_by_email(session, payload.email)
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )
    user = await create_user(session, payload.email, payload.password)
    set_auth_cookies(response, user)
    return user_to_read(user)


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
    set_auth_cookies(response, user)
    return user_to_read(user)


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
    set_auth_cookies(response, user)
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
async def me(user: User = Depends(get_current_user)) -> UserRead:
    return user_to_read(user)
