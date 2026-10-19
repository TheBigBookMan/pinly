import { AuthorisationRequest, IdentityProvider } from "@/application/ports/IdentityProvider";

export class StartGoogleSignIn {
  constructor(private readonly provider: IdentityProvider) {}

  execute(): Promise<AuthorisationRequest> {
    return this.provider.start();
  }
}