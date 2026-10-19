import { BreachedPasswordChecker } from "@/application/ports/BreachedPasswordChecker";
import { PasswordHasher } from "@/application/ports/PasswordHasher";
import { UserRepository } from "@/application/ports/UserRepository";
import { ValidationError } from "@/domain/errors";
import { assertValidPassword, assertValidUsername, normalizeEmail, normalizePassword } from "@/domain/user/credentials";

export class RegisterUser {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly breached: BreachedPasswordChecker
  ) {}

  async execute(input: {email: string; username: string; password: string}) {
    const email = normalizeEmail(input.email);
    const username = input.username.trim();
    const password = normalizePassword(input.password);

    assertValidPassword(password);
    assertValidUsername(username);

    if (await this.breached.isBreached(password)) throw new ValidationError("That password has appeared in a data breach. Please choose a different one.");

    const passwordHash = await this.hasher.hash(password);
    return this.users.create({email, username, passwordHash});
  }
}