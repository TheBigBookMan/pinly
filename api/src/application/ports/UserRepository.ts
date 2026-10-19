import { OAuthProvider } from "@/domain/user/oauth";
import type { NewUser, User, UserCredentials } from "@/domain/user/User";

export interface UserRepository {
  create(newUser: NewUser): Promise<User | undefined>;
  findCredentialsByEmail(email: string): Promise<UserCredentials | null>;
  findById(id: string): Promise<User | null>;
  findByIdentity(provider: OAuthProvider, subject: string): Promise<User | null>;
  createFromIdentity(input: {
    email: string,
    username: string,
    provider: OAuthProvider,
    subject: string
  }): Promise<User>;
}