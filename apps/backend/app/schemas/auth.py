from pydantic import BaseModel, EmailStr, Field


class UserRead(BaseModel):
    id: str
    email: EmailStr
    is_active: bool
    is_verified: bool


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=16)
    password: str = Field(min_length=8)


class MessageResponse(BaseModel):
    message: str
