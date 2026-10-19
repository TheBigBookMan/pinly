import { PendingAuthorization } from "@/application/ports/IdentityProvider";
import { env } from "@/config/env";
import { Request, Response } from "express";
import { EncryptJWT, jwtDecrypt } from "jose";
import { createHash } from "node:crypto";

const NAME = "pinly_oauth";
const TTL_SECONDS = 600;

const key = createHash("sha256").update(env.OAUTH_COOKIE_SECRET).digest();

const options = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth/google"
};

export type OAuthFlow = PendingAuthorization & {returnTo: string};

export async function setOAuthFlowCookie(res: Response, flow: OAuthFlow) {
  const token = await new EncryptJWT({...flow})
    .setProtectedHeader({alg: "dir", enc: "A256GCM"})
    .setIssuedAt()
    .setExpirationTime(`${TTL_SECONDS}s`)
    .encrypt(key);
  res.cookie(NAME, token, {...options, maxAge: TTL_SECONDS * 1000});
}

export async function readOAuthFlowCookie(req: Request): Promise<OAuthFlow | null> {
  const token: unknown = req.cookies?.[NAME];
  if (typeof token !== "string") return null;

  try {
    const {payload} = await jwtDecrypt(token, key);
    const {state, nonce, codeVerifier, returnTo} = payload;

    if (
      typeof state === "string" &&
      typeof nonce === "string" &&
      typeof codeVerifier === "string" &&
      typeof returnTo === "string"
    ) {
      return {state, nonce, codeVerifier, returnTo};
    }
  } catch {}
  return null;
}

export const clearOAuthFlowCookie = (res: Response) => {
  res.clearCookie(NAME, options);
}