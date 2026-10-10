export interface TokenService {
  signAccessToken(userId: string): Promise<{token: string, expiresInSeconds: number}>;
  verifyAccessToken(token: string): Promise<{userId: string}>;
  generateRefreshToken(): {token: string; hash: string};
  hashRefreshToken(token: string): string;
}