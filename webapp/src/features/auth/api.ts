import { api, http, setAccessToken } from "@/lib/api";
import { type AuthResponse, type UserType } from "@/types/auth";

export const registerRequest = (input: {email: string; username: string; password: string}) => http<{user: UserType}>("/auth/register", {method: "POST", body: JSON.stringify(input)});

export async function loginRequest(input: {email: string; password: string}): Promise<UserType>{
  const result = await http<AuthResponse>("/auth/login", {method: "POST", body: JSON.stringify(input)});
  setAccessToken(result.accessToken);
  return result.user;
}

export async function logoutRequest(): Promise<void> {
  try {
    await http<void>("/auth/logout", {method: "POST"});
  } finally {
    setAccessToken(null);
  }
}

export const fetchMe = () => api<{user: UserType}>("/auth/me").then((result) => result.user);