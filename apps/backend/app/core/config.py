from functools import lru_cache
from urllib.parse import urlsplit

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = Field(alias="DATABASE_URL")
    redis_url: str = Field(alias="REDIS_URL")
    jwt_secret_key: str = Field(alias="JWT_SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(
        default=15,
        alias="ACCESS_TOKEN_EXPIRE_MINUTES",
    )
    refresh_token_expire_days: int = Field(
        default=30,
        alias="REFRESH_TOKEN_EXPIRE_DAYS",
    )
    cookie_secure: bool = Field(default=False, alias="COOKIE_SECURE")
    cookie_samesite: str = Field(default="lax", alias="COOKIE_SAMESITE")
    frontend_url: AnyHttpUrl = Field(
        default="http://localhost:3000",
        alias="FRONTEND_URL",
    )
    backend_url: AnyHttpUrl = Field(
        default="http://localhost:8000",
        alias="BACKEND_URL",
    )

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_allowed_origins(self) -> list[str]:
        frontend_origin = _normalize_origin(str(self.frontend_url))
        origins = {frontend_origin}

        parsed = urlsplit(frontend_origin)
        if parsed.hostname == "localhost":
            origins.add(
                _normalize_origin(
                    f"{parsed.scheme}://127.0.0.1"
                    f"{f':{parsed.port}' if parsed.port else ''}",
                )
            )
        elif parsed.hostname == "127.0.0.1":
            origins.add(
                _normalize_origin(
                    f"{parsed.scheme}://localhost"
                    f"{f':{parsed.port}' if parsed.port else ''}",
                )
            )

        return sorted(origins)


def _normalize_origin(url: str) -> str:
    return url.rstrip("/")


@lru_cache
def get_settings() -> Settings:
    return Settings()
