const publicBackendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
const serverBackendUrl = process.env.BACKEND_URL ?? publicBackendUrl;

export type ApiError = {
  detail?: string;
};

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

export function getApiBaseUrl() {
  return typeof window === "undefined" ? serverBackendUrl : publicBackendUrl;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const body = init.body;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    cache: init.cache ?? "no-store",
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...init.headers
    }
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      typeof data?.detail === "string" ? data.detail : "Request failed";
    throw new ApiRequestError(message, response.status);
  }

  return data as T;
}
