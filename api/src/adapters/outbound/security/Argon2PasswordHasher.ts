import type { PasswordHasher } from '@/application/ports/PasswordHasher';
import {hash, verify} from '@node-rs/argon2';

const OPTIONS = {memoryCost: 19456, timeCost: 2, parallelism: 1};

export class Argon2PasswordHasher implements PasswordHasher {
  hash(plain: string): Promise<string> {
    return hash(plain, OPTIONS);
  }

  async verify(hashed: string, plain: string): Promise<boolean> {
    try {
      return await verify(hashed, plain);
    } catch {
      return false;
    }
  }
}