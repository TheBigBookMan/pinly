import { PasswordHasher } from "@/application/ports/PasswordHasher";
import { UserRepository } from "@/application/ports/UserRepository";
import { SessionService } from "@/application/services/SessionService";
import { UnauthorizedError } from "@/domain/errors";
import { normalizeEmail, normalizePassword } from "@/domain/user/credentials";

export class LoginWithPassword {
  private dummyHash: Promise<string> | undefined;

  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly sessions: SessionService
  ) {}

  async execute(input: {email: string, password: string}) {
    const credentials = await this.users.findCredentialsByEmail(normalizeEmail(input.email));
    const password = normalizePassword(input.password);

    const hash = credentials?.passwordHash ?? (await (this.dummyHash ?? this.hasher.hash("pinly-timing-dummy")));
    const passwordOk = await this.hasher.verify(hash, password);

    if (!credentials || !credentials.passwordHash || !passwordOk) {
      throw new UnauthorizedError("invalid_credentials", "Incorrect email or password.");
    }

    const session = await this.sessions.issue(credentials.user.id);
    return {user: credentials.user, session};
  }
}