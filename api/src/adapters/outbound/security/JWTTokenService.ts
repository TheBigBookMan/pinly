import { TokenService } from "@/application/ports/TokenService";
import { UnauthorizedError } from "@/domain/errors";
import { jwtVerify, SignJWT } from "jose";
import { createHash, randomBytes } from "node:crypto";

const ISSUER = "pinly-api";
const AUDIENCE = "pinly";
const ACCESS_TTL_SECONDS = 15 * 60;

export class JwtTokenService implements TokenService {
  private readonly key: Uint8Array;

  constructor(secret: string) {
    this.key = new TextEncoder().encode(secret);
  }

  async signAccessToken(userId: string) {
    const now = Math.floor(Date.now() / 1000);
    const token = await new SignJWT({})
      .setProtectedHeader({alg: "HS256"})
      .setSubject(userId)
      .setIssuer(ISSUER)
      .setAudience(AUDIENCE)
      .setIssuedAt(now)
      .setExpirationTime(now + ACCESS_TTL_SECONDS)
      .sign(this.key);
    
      return {token, expiresInSeconds: ACCESS_TTL_SECONDS};
  }

  async verifyAccessToken(token: string) {
    try {
      const {payload} = await jwtVerify(token, this.key, {
        issuer: ISSUER,
        audience: AUDIENCE,
        algorithms: ["HS256"]
      });
      if(typeof payload.sub !== "string") throw new Error("missing subject");
      return {userId: payload.sub};
    } catch {
      throw new UnauthorizedError("invalid_token", "Your session has expired. Sign in again.");
    }
  }

  hashRefreshToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  generateRefreshToken() {
    const token = randomBytes(32).toString("base64url")
    return {token, hash: this.hashRefreshToken(token)};
  }
}