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

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const isServer = typeof window === "undefined";
  const baseUrl = isServer ? serverBackendUrl : publicBackendUrl;
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    cache: init.cache ?? "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
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
