import { SecurityEvents } from "@/application/ports/SecurityEvents";
import { logger } from "@/config/logger";

const security = logger.child({channel: "security"});

export class PinoSecurityEvents implements SecurityEvents {
  refreshTokenReused(familyId: string): void {
    security.warn({event: "refresh_token_reused", familyId}, "a spent refresh token was replayed");
  }
}