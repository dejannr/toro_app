import { apiFetch } from "@/lib/api";
import type {
  ForgotPasswordValues,
  LoginValues,
  RegisterValues,
  ResetPasswordValues
} from "@/lib/validations/auth";

export type CurrentUser = {
  id: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
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

export function register(values: RegisterValues): Promise<CurrentUser> {
  return apiFetch<CurrentUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify(values)
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
