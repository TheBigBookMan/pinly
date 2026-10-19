export type OAuthProvider = "google";

export interface ProviderIdentity {
  provider: OAuthProvider;
  subject: string;
  email: string;
  emailVerified: boolean;
}

export function usernameBase(email: string): string {
  const local = email.split("@")[0] ?? "";
  return local.replace(/[^A-Za-z0-9_]/g, "_").slice(0, 20) || "user";
}