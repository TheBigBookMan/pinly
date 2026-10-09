import type { NewUser, User } from "@/domain/user/User";

export interface UserRepository {
  create(newUser: NewUser): Promise<User | undefined>
}