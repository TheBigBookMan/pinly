import { apiUrl } from "@/lib/api";

export const googleSignInUrl = (returnTo?: string) => apiUrl(`/auth/google${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`);