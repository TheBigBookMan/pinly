import type { AuthResponse } from "@/types/auth";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type Init = Omit<RequestInit, "headers" | "credentials">
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details: { path: string; message: string }[] = []
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const messageOf = (err: unknown): string =>
  err instanceof ApiError ? err.message : "Could not reach the server. Try again.";

let accessToken: string | null = null;
let onSessionEnded: (() => void) | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
}

export const setSessionEndedHandler = (handler: (() => void) | null) => {
  onSessionEnded = handler;
}

export async function http<T>(path: string, init: Init = {}, token?: string | null): Promise<T> {
  const response = await fetch(`${BASE_URL}/api${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  
  if (response.status === 204) return undefined as T;

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      body?.error?.code ?? "unknown_error",
      body?.error?.message ?? "Something went wrong.",
      body?.error?.details ?? []
    );
  }
  return body as T;
}

let refreshing: Promise<AuthResponse> | null = null;
const withTabLock = <T>(task: () => Promise<T>): Promise<T> =>
 "locks" in navigator ? navigator.locks.request("pinly-refresh", task) : task();

export function refreshSession(): Promise<AuthResponse> {
  refreshing ??= withTabLock(() => http<AuthResponse>("/auth/refresh", { method: "POST" }))
    .then((result) => {
      accessToken = result.accessToken;
      return result;
    })
    .finally(() => {
      refreshing = null;
    })
  return refreshing;
}

export async function api<T>(path: string, init: Init = {}): Promise<T> {
  try {
    return await http<T>(path, init, accessToken);
  } catch (err) {
    if (!(err instanceof ApiError) || err.status !== 401) throw err;

    try {
      await refreshSession();
    } catch {
      accessToken = null;
      onSessionEnded?.();
      throw err;
    }
    return http<T>(path, init, accessToken);
  }
}
