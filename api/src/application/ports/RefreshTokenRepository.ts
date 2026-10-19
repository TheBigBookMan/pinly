export type ConsumeResult =
 | {status: "consumed"; userId: string; familyId: string}
 | {status: "reused"; familyId: string}
 | {status: "invalid"};

export interface RefreshTokenRepository {
  create(token: {userId: string; familyId: string; tokenHash: string; expiresAt: Date}): Promise<void>;
  consume(tokenHash: string): Promise<ConsumeResult>;
  revokeFamily(familyId: string): Promise<void>;
  revokeFamilyByTokenHash(tokenHash: string): Promise<void>;
}