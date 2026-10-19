import { ProviderIdentity } from "@/domain/user/oauth";

export interface PendingAuthorization {
  state: string;
  nonce: string;
  codeVerifier: string;
}

export type AuthorisationRequest = PendingAuthorization & {
  url: string;
}

export interface IdentityProvider {
  start(): Promise<AuthorisationRequest>;
  complete(input: {callbackUrl: string; pending: PendingAuthorization}): Promise<ProviderIdentity>;
}