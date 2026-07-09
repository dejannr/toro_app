import { apiFetch } from "@/lib/api";
import type {
  CompanyOnboardingValues,
  ForgotPasswordValues,
  LoginValues,
  RegisterValues,
  ResetPasswordValues
} from "@/lib/validations/auth";

export type CurrentUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  job_title: string | null;
  is_active: boolean;
  is_verified: boolean;
  company: {
    id: string;
    legal_name: string;
    role: string;
  } | null;
};

export type NotificationPreferences = {
  fuel_management_enabled: boolean;
  marketplace_enabled: boolean;
  tracking: {
    predicted_late: boolean;
    arrival: boolean;
    detention_alert: boolean;
    departure: boolean;
    load_complete: boolean;
    receive_attachments: boolean;
    only_my_loads: boolean;
    channels: {
      desktop: boolean;
      email: boolean;
      sms: boolean;
    };
  };
  other_enabled: boolean;
};

export type AccountProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  job_title: string | null;
  company: CurrentUser["company"];
  notification_preferences: NotificationPreferences;
};

type RegisterPayload = Omit<RegisterValues, "confirmPassword">;
type RegisterResponse = {
  message: string;
  fake_email: {
    to: string;
    subject: string;
    verify_url: string;
  };
};
type VerifyEmailResponse = {
  message: string;
  onboarding_path: string;
  user: CurrentUser;
};

export async function getCurrentUser(
  cookieHeader?: string
): Promise<CurrentUser | null> {
  try {
    return await apiFetch<CurrentUser>("/auth/me", {
      method: "GET",
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined
    });
  } catch {
    return null;
  }
}

export function login(values: LoginValues): Promise<CurrentUser> {
  return apiFetch<CurrentUser>("/auth/login", {
    method: "POST",
    body: JSON.stringify(values)
  });
}

export function register(values: RegisterPayload): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(values)
  });
}

export function verifyEmail(token: string): Promise<VerifyEmailResponse> {
  return apiFetch<VerifyEmailResponse>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token })
  });
}

export function logout(cookieHeader?: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/logout", {
    method: "POST",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined
  });
}

export function requestPasswordReset(
  values: ForgotPasswordValues
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(values)
  });
}

export function resetPassword(
  values: ResetPasswordValues
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(values)
  });
}

export function createCompanyOnboarding(
  values: CompanyOnboardingValues
): Promise<{ id: string; legal_name: string; role: string }> {
  return apiFetch<{ id: string; legal_name: string; role: string }>(
    "/companies/onboarding",
    {
      method: "POST",
      body: JSON.stringify({
        legal_name: values.legal_name,
        trade_name: values.trade_name || null
      })
    }
  );
}

export function getAccountProfile(cookieHeader?: string) {
  return apiFetch<AccountProfile>("/auth/account", {
    method: "GET",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined
  });
}

export function updateAccountProfile(values: {
  first_name: string;
  last_name: string;
  phone_number: string | null;
  job_title: string | null;
}) {
  return apiFetch<AccountProfile>("/auth/account", {
    method: "PATCH",
    body: JSON.stringify(values)
  });
}

export function changeAccountPassword(values: {
  current_password: string;
  new_password: string;
}) {
  return apiFetch<{ message: string }>("/auth/account/password", {
    method: "PATCH",
    body: JSON.stringify(values)
  });
}

export function updateNotificationPreferences(notification_preferences: NotificationPreferences) {
  return apiFetch<AccountProfile>("/auth/account/notifications", {
    method: "PATCH",
    body: JSON.stringify({ notification_preferences })
  });
}
