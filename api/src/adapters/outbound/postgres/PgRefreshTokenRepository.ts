import { ConsumeResult, RefreshTokenRepository } from "@/application/ports/RefreshTokenRepository";
import PG from "pg";

export class PgRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly pool: PG.Pool) {}

  async create(token: {userId: string; familyId: string; tokenHash: string; expiresAt: Date}) {
    await this.pool.query(
      "INSERT INTO refresh_token (user_id, family_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)",
      [token.userId, token.familyId, token.tokenHash, token.expiresAt]
    );
  }

  async consume(tokenHash: string): Promise<ConsumeResult> {
    const spent = await this.pool.query<{user_id: string; family_id: string}>(
      `UPDATE refresh_token SET used_at = now()
      WHERE token_hash = $1 AND used_at IS NULL AND revoked_at IS NULL AND expires_at > now()
      RETURNING user_id, family_id`,
      [tokenHash]
    );
    const ok = spent.rows[0];
    if(ok) return {status: "consumed", userId: ok.user_id, familyId: ok.family_id};

    const found = await this.pool.query<{family_id: string; used_at: Date | null; revoked_at: Date | null}>(
      "SELECT family_id, used_at, revoked_at FROM refresh_token WHERE token_hash = $1",
      [tokenHash]
    );
    const row = found.rows[0];
    if (row?.used_at && !row.revoked_at) return {status: "reused", familyId: row.family_id};

    return {status: "invalid"};
  }

  async revokeFamily(familyId: string) {
    await this.pool.query(
      "UPDATE refresh_token SET revoke_at = now() WHERE family_id = $1 AND revoked_at IS NULL",
      [familyId]
    );
  }

  async revokeFamilyByTokenHash(tokenHash: string): Promise<void> {
    await this.pool.query(
      `UPDATE refresh_token SET revoked_at = now()
      WHERE revoked_at IS NULL
      AND family_id = (SELECT family_id FROM refresh_token WHERE token_hash = $1)`,
      [tokenHash]
    );
  }
}