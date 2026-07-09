from pydantic import BaseModel, EmailStr, Field

from app.schemas.company import CompanySummary


class NotificationChannelSettings(BaseModel):
    desktop: bool = True
    email: bool = True
    sms: bool = False


class TrackingNotificationSettings(BaseModel):
    predicted_late: bool = True
    arrival: bool = True
    detention_alert: bool = False
    departure: bool = True
    load_complete: bool = False
    receive_attachments: bool = False
    only_my_loads: bool = True
    channels: NotificationChannelSettings = NotificationChannelSettings()


class AccountNotifications(BaseModel):
    fuel_management_enabled: bool = False
    marketplace_enabled: bool = False
    tracking: TrackingNotificationSettings = TrackingNotificationSettings()
    other_enabled: bool = False


class AccountProfileRead(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str | None = None
    job_title: str | None = None
    company: CompanySummary | None = None
    notification_preferences: AccountNotifications


class AccountProfileUpdateRequest(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    phone_number: str | None = Field(default=None, max_length=40)
    job_title: str | None = Field(default=None, max_length=100)


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=1)
    new_password: str = Field(min_length=8)


class UpdateNotificationsRequest(BaseModel):
    notification_preferences: AccountNotifications
