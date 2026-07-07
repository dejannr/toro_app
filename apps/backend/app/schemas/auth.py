from pydantic import AnyHttpUrl, BaseModel, EmailStr, Field


class CompanySummary(BaseModel):
    id: str
    legal_name: str
    role: str


class UserRead(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    is_active: bool
    is_verified: bool
    company: CompanySummary | None = None


class RegisterRequest(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8)


class FakeEmailPreview(BaseModel):
    to: EmailStr
    subject: str
    verify_url: AnyHttpUrl


class RegisterResponse(BaseModel):
    message: str
    fake_email: FakeEmailPreview


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class VerifyEmailRequest(BaseModel):
    token: str = Field(min_length=16)


class VerifyEmailResponse(BaseModel):
    message: str
    onboarding_path: str
    user: UserRead


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=16)
    password: str = Field(min_length=8)


class CompanyOnboardingRequest(BaseModel):
    legal_name: str = Field(min_length=1, max_length=160)
    trade_name: str | None = Field(default=None, max_length=160)


class MessageResponse(BaseModel):
    message: str
