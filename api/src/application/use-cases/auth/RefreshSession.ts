import { RefreshTokenRepository } from "@/application/ports/RefreshTokenRepository";
import { SecurityEvents } from "@/application/ports/SecurityEvents";
import { TokenService } from "@/application/ports/TokenService";
import { UserRepository } from "@/application/ports/UserRepository";
import { SessionService } from "@/application/services/SessionService";
import { UnauthorizedError } from "@/domain/errors";

const ended = () => new UnauthorizedError("session_invalid", "Your session has ended. Sign in again.");

export class RefreshSession {
  constructor(
    private readonly users: UserRepository,
    private readonly refreshTokens: RefreshTokenRepository,
    private readonly tokens: TokenService,
    private readonly sessions: SessionService,
    private readonly events: SecurityEvents
  ) {}

  async execute(rawCard: string) {
    const result = await this.refreshTokens.consume(this.tokens.hashRefreshToken(rawCard));

    if (result.status === 'reused') {
      this.events.refreshTokenReused(result.familyId);
      await this.refreshTokens.revokeFamily(result.familyId);
      throw ended();
    }

    if (result.status === 'invalid') throw ended();

    const user = await this.users.findById(result.userId);
    if (!user) throw ended();

    const session = await this.sessions.issue(user.id, result.familyId);
    return {user, session};
  }
}