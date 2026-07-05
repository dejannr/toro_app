from hashlib import sha256
from secrets import token_urlsafe

from redis.asyncio import Redis
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password, verify_password
from app.models.user import User

RESET_TOKEN_EXPIRE_SECONDS = 60 * 60


async def get_user_by_email(session: AsyncSession, email: str) -> User | None:
    result = await session.execute(select(User).where(User.email == email.lower()))
    return result.scalar_one_or_none()


async def get_user_by_id(session: AsyncSession, user_id: object) -> User | None:
    return await session.get(User, user_id)


async def create_user(session: AsyncSession, email: str, password: str) -> User:
    user = User(email=email.lower(), hashed_password=hash_password(password))
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def authenticate_user(
    session: AsyncSession,
    email: str,
    password: str,
) -> User | None:
    user = await get_user_by_email(session, email)
    if user is None or not verify_password(password, user.hashed_password):
        return None
    return user


def hash_reset_token(token: str) -> str:
    return sha256(token.encode("utf-8")).hexdigest()


async def create_password_reset_token(redis: Redis, user: User) -> str:
    token = token_urlsafe(32)
    token_hash = hash_reset_token(token)
    await redis.setex(
        f"password-reset:{token_hash}",
        RESET_TOKEN_EXPIRE_SECONDS,
        str(user.id),
    )
    # TODO: Send the raw token through a future email provider integration.
    return token


async def consume_password_reset_token(redis: Redis, token: str) -> str | None:
    token_hash = hash_reset_token(token)
    key = f"password-reset:{token_hash}"
    user_id = await redis.get(key)
    if user_id is not None:
        await redis.delete(key)
    return user_id


async def update_password(session: AsyncSession, user: User, password: str) -> None:
    user.hashed_password = hash_password(password)
    await session.commit()
