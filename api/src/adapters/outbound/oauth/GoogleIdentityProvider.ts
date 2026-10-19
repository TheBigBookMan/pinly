import { AuthorisationRequest, IdentityProvider, PendingAuthorization } from "@/application/ports/IdentityProvider";
import { logger } from "@/config/logger";
import { UnauthorizedError } from "@/domain/errors";
import { ProviderIdentity } from "@/domain/user/oauth";
import * as client from "openid-client";

const ISSUER = new URL("https://accounts.google.com");

export class GoogleIdentityProvider implements IdentityProvider {
  private config: Promise<client.Configuration>  | undefined;

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly redirectUri: string
  ) {}

  private getConfig(): Promise<client.Configuration> {
    this.config ??= client.discovery(ISSUER, this.clientId, this.clientSecret).catch((err) => {
      this.config = undefined;
      throw err;
    });
    return this.config;
  }

  async start(): Promise<AuthorisationRequest> {
    try {
      const config = await this.getConfig();
      const codeVerifier = client.randomPKCECodeVerifier();
      const state = client.randomState();
      const nonce = client.randomNonce();

      const url = client.buildAuthorizationUrl(config, {
        redirect_uri: this.redirectUri,
        scope: "openid email",
        code_challenge: await client.calculatePKCECodeChallenge(codeVerifier),
        code_challenge_mode: "S256",
        state,
        nonce,
        prompt: "select_account"
      });
      return {url: url.href, state, nonce, codeVerifier};
    } catch (err) {
      logger.error({err}, "could not start google sign in");
      throw new UnauthorizedError("oauth_failed", "Google sign in could not be started.");
    }
  }

  async complete(input: {callbackUrl: string; pending: PendingAuthorization}): Promise<ProviderIdentity> {
    const callback = new URL(input.callbackUrl);

    if (callback.searchParams.get("error") === "access_denied") throw new UnauthorizedError("oauth_cancelled", "Google sign-in was cancelled.");

    try {
      const config = await this.getConfig();
      const tokens = await client.authorizationCodeGrant(config, callback, {
        pkceCodeVerifier: input.pending.codeVerifier,
        expectedState: input.pending.state,
        expectedNonce: input.pending.nonce
      });
      const claims = tokens.claims();

      if (!claims || !claims.sub || typeof claims.email !== "string") throw new Error("ID token has no sub or email");

      return {
        provider: "google",
        subject: claims.sub,
        email: claims.email,
        emailVerified: claims.email_verified === true
      }
    } catch (err) {
      logger.warn({err}, "google sign-in failed");
      throw new UnauthorizedError("oauth_failed", "Google sign-in could not be completed");
    }
  }
}