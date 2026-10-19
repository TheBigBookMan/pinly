import { ValidationError } from "../errors";

export const normalizeEmail = (email: string) => email.trim().toLocaleLowerCase();

export const normalizePassword = (password: string) => password.normalize("NFKC");

export function assertValidPassword(password: string) {
  const length = [...password].length;
  if (length < 12) throw new ValidationError("Password must be more than 12 characters.");
  if (length > 128) throw new ValidationError("Password must be less than 128 characters.");
}

const USERNAME = /^[A-Za-z0-9_]{3,30}$/;

export function assertValidUsername(username: string) {
  if (!USERNAME.test(username)) throw new ValidationError("Username must be 3 to 30 letters, numbers or underscores.");
}