import { UserRepository } from "@/application/ports/UserRepository";
import { ConflictError } from "@/domain/errors";
import { NewUser, User } from "@/domain/user/User";
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
}