export class User {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly username: string
  ) {}
}

export interface NewUser {
  email: string,
  username: string,
  passwordHash: string
}

export interface UserCredentials {
  user: User;
  passwordHash: string | null;
}