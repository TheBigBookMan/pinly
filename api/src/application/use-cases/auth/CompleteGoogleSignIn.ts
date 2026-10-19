import { IdentityProvider, PendingAuthorization } from "@/application/ports/IdentityProvider";
import { UserRepository } from "@/application/ports/UserRepository";
import { SessionService } from "@/application/services/SessionService";
import { ConflictError, UnauthorizedError } from "@/domain/errors";
import { normalizeEmail } from "@/domain/user/credentials";
import { ProviderIdentity, usernameBase } from "@/domain/user/oauth";
import { User } from "@/domain/user/User";

export class CompleteGoogleSignIn {
  constructor(
    private readonly provider: IdentityProvider,
    private readonly users: UserRepository,
    private readonly sessions: SessionService
  ) {}

  async execute(input: {callbackUrl: string; pending: PendingAuthorization}) {
    const identity = await this.provider.complete(input);

    const existing = await this.users.findByIdentity(identity.provider, identity.subject);
    if (existing) return {user: existing, session: await this.sessions.issue(existing.id)};

    if (!identity.emailVerified) throw new UnauthorizedError("email_not_verified", "Google has not verified that email address.");

    const email = normalizeEmail(identity.email);
    if (await this.users.findCredentialsByEmail(email)) throw new ConflictError("account_exists", "An account with that email already exists");

    const user = await this.createWithFreeUsername(email, identity);
    return {user, session: await this.sessions.issue(user.id)};
  }

  private async createWithFreeUsername(email: string, identity: ProviderIdentity): Promise<User> {
    const base = usernameBase(email);

    for (let attempt = 0; attempt < 5; attempt++) {
      const suffix = String(crypto.getRandomValues(new Uint32Array(1))[0]! % 10000).padStart(4, "0");

      try {
        return await this.users.createFromIdentity({
          email,
          username: `${base}_${suffix}`,
          provider: identity.provider,
          subject: identity.subject
        })
      } catch (err) {
        if (!(err instanceof ConflictError && err.code === "username_taken")) throw err;
      }
    }
    throw new ConflictError("username taken", "Could not find a free username.");
  }
}