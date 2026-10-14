import { UserRepository } from "@/application/ports/UserRepository";
import { UnauthorizedError } from "@/domain/errors";
import { User } from "@/domain/user/User";

export class GetCurrentUser {
  constructor(private readonly users: UserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.users.findById(userId);
    if (!user) throw new UnauthorizedError("session_invalid", "Your session has ended. Sign in again.");
    return user;
  }
}