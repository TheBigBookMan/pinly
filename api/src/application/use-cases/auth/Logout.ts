import { RefreshTokenRepository } from "@/application/ports/RefreshTokenRepository";
import { TokenService } from "@/application/ports/TokenService";

export class Logout {
  constructor(
    private readonly refreshTokens: RefreshTokenRepository,
    private readonly tokens: TokenService
  ) {}

  async execute(rawCard: string): Promise<void> {
    await this.refreshTokens.revokeFamilyByTokenHash(this.tokens.hashRefreshToken(rawCard));
  }
}