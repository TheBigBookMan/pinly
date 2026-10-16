import { BreachedPasswordChecker } from "@/application/ports/BreachedPasswordChecker";
import { logger } from "@/config/logger";
import { createHash } from "node:crypto";

export class PwnedPasswordsChecker implements BreachedPasswordChecker {
  async isBreached(password: string): Promise<boolean> {
    const sha1 = createHash("sha1").update(password).digest("hex").toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(3);

    try {
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
        headers: {"Add-Padding": "true", "User-Agent": "Pinly"},
        signal: AbortSignal.timeout(2000)
      });
      if (!response.ok) throw new Error(`Pwned Passwords answered ${response.status}`);

      const body = await response.text();
      return body.split("\n").some((line) => {
        const [hashSuffix, count] = line.trim().split(":");
        return hashSuffix === suffix && Number(count) > 0;
      })
    } catch(err) {
      logger.warn({err}, "Breached password check unavailabe");
      return false;
    }
  }
}