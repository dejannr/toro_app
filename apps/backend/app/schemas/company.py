from pydantic import BaseModel, EmailStr, Field


class CompanySummary(BaseModel):
    id: str
    legal_name: str
    role: str


class CompanyOnboardingRequest(BaseModel):
    legal_name: str = Field(min_length=1, max_length=160)
    trade_name: str | None = Field(default=None, max_length=160)


class CompanyInformation(BaseModel):
    id: str
    legal_name: str
    trade_name: str | None = None
    billing_email: EmailStr | None = None
    address_line1: str | None = None
    address_line2: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    invoice_prefix: str
    payment_terms_label: str
    payment_terms_days: int


class CompanyUpdateRequest(BaseModel):
    legal_name: str = Field(min_length=1, max_length=160)
    trade_name: str | None = Field(default=None, max_length=160)
    billing_email: EmailStr | None = None
    address_line1: str | None = Field(default=None, max_length=160)
    address_line2: str | None = Field(default=None, max_length=160)
    city: str | None = Field(default=None, max_length=120)
    state: str | None = Field(default=None, max_length=120)
    postal_code: str | None = Field(default=None, max_length=40)
    invoice_prefix: str = Field(min_length=1, max_length=20)
    payment_terms_label: str = Field(min_length=1, max_length=80)
    payment_terms_days: int = Field(ge=0, le=180)


class CompanyMemberRead(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    role: str
