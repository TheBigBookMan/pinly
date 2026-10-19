import type { RefreshTokenRepository } from "../ports/RefreshTokenRepository";
import type { TokenService } from "../ports/TokenService";

export type Session = {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

export class SessionService {
  constructor(
    private readonly tokens: TokenService,
    private readonly refreshTokens: RefreshTokenRepository,
    private readonly refreshTtlDays: number
  ) {}

  async issue(userId: string, familyId: string = crypto.randomUUID()): Promise<Session> {
    const access = await this.tokens.signAccessToken(userId);
    const card = this.tokens.generateRefreshToken();
    const expiresAt = new Date(Date.now() + this.refreshTtlDays * 86_400_000);

    await this.refreshTokens.create({userId, familyId, tokenHash: card.hash, expiresAt});

    return {
      accessToken: access.token,
      accessTokenExpiresIn: access.expiresInSeconds,
      refreshToken: card.token,
      refreshTokenExpiresAt: expiresAt
    }
  }
}