import { UserRepository } from "@/application/ports/UserRepository";
import { ConflictError } from "@/domain/errors";
import { OAuthProvider } from "@/domain/user/oauth";
import { NewUser, User, UserCredentials } from "@/domain/user/User";
import pg from "pg";

export class PgUserRepository implements UserRepository {
  constructor(private readonly pool: pg.Pool) {}

  async create(newUser: NewUser): Promise<User | undefined> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");
      const result = await client.query<{id: string}>(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id", [newUser.email, newUser.passwordHash]
      );
      const id = result.rows[0]!.id;
      await client.query("INSERT INTO profile (user_id, username) VALUES ($1, $2)", [id, newUser.username]);
      await client.query("COMMIT");

      return new User(id, newUser.email, newUser.username);

    } catch (err) {
      await client.query("ROLLBACK");

      if (err instanceof pg.DatabaseError && err.code === '23505') {
        if (err.constraint === 'users_email_key') {
          throw new ConflictError("email_taken", "That email already in use.");
        }

        if (err.constraint === 'profile_username_key') {
          throw new ConflictError('username_taken', 'That username is taken.')
        }
      }

    } finally {
      client.release();
    }
  }

  async findCredentialsByEmail(email: string): Promise<UserCredentials | null> {
    const result = await this.pool.query<{id: string; email: string; username: string; password_hash: string | null}>(
      `SELECT u.id, u.email, u.password_hash, p.username
      FROM users u JOIN profile p ON p.user_id = u.id
      WHERE u.email = $1`,
      [email]
    );
    const row = result.rows[0];
    if(!row) return null;

    return {user: new User(row.id, row.email, row.username), passwordHash: row.password_hash};
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.pool.query<{id: string; email: string; username: string}>(
      `SELECT u.id, u.email, p.username
      FROM users u JOIN profile p ON p.user_id = u.id
      WHERE u.id = $1`,
      [id]
    );
    const row = result.rows[0];
    return row ? new User(row.id, row.email, row.username) : null;
  }

  async findByIdentity(provider: OAuthProvider, subject: string): Promise<User | null> {
    const result = await this.pool.query<{id: string; email: string; username: string}>(
      `SELECT u.id, u.email, p.username
      FROM auth_identity i
      JOIN users ON u.id = i.user_id
      JOIN profile p ON p.user_id = u.id
      WHERE i.provider = $1 AND i.provider_subject = $2`,
      [provider, subject]
    );
    const row = result.rows[0];
    return row ? new User(row.id, row.email, row.username) : null;
  }

  async createFromIdentity(input: {
    email: string,
    username: string,
    provider: OAuthProvider,
    subject: string
  }): Promise<User> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");

      const user = await client.query<{id: string}>(
        "INSERT INTO users (email, email_verified_at) VALUES ($1, now()) RETURNING id",
        [input.email]
      );
      const id = user.rows[0]!.id;
      await client.query("INSERT INTO profile (user_id, username) VALUES ($1, $2)", [id, input.username]);

      await client.query("INSERT INTO auth_identity (provider, provider_subject, user_id) VALUES ($1, $2, $3)", [input.provider, input.subject, id]);

      await client.query("COMMIT");
      return new User(id, input.email, input.username);
    } catch (err) {
      await client.query("ROLLBACK");
      if (err instanceof pg.DatabaseError && err.code === "23505") {
        if (err.constraint === "users_email_key") throw new ConflictError("email_taken", "That email is already in use.");
        if (err.constraint === "profile_username_key") throw new ConflictError("username_taken", "That username is taken.");
        if (err.constraint === "auth_identity_pkey") throw new ConflictError("identity_taken", "That Google account is already linked.");
      }
      throw err;
    } finally {
      client.release();
    }
  }
}