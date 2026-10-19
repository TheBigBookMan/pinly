import pg from "pg"
import { createApp } from "@/adapters/inbound/http/createApp"
import { env } from "@/config/env"
import { logger } from "@/config/logger"
import { RegisterUser } from "./application/use-cases/auth/RegisterUser"
import { PgUserRepository } from "./adapters/outbound/postgres/PgUserRepository"
import { Argon2PasswordHasher } from "./adapters/outbound/security/Argon2PasswordHasher"
import { PgRefreshTokenRepository } from "./adapters/outbound/postgres/PgRefreshTokenRepository"
import { JwtTokenService } from "./adapters/outbound/security/JWTTokenService"
import { SessionService } from "./application/services/SessionService"
import { LoginWithPassword } from "./application/use-cases/auth/LoginWithPassword"
import { RefreshSession } from "./application/use-cases/auth/RefreshSession"
import { Logout } from "./application/use-cases/auth/Logout"
import { GetCurrentUser } from "./application/use-cases/auth/GetCurrentUser"
import { PinoSecurityEvents } from "./adapters/outbound/logging/PinoSecurityEvents"
import { PwnedPasswordsChecker } from "./adapters/outbound/security/PwnedPasswordsChecker"
import { GoogleIdentityProvider } from "./adapters/outbound/oauth/GoogleIdentityProvider"
import { StartGoogleSignIn } from "./application/use-cases/auth/StartGoogleSignIn"
import { CompleteGoogleSignIn } from "./application/use-cases/auth/CompleteGoogleSignIn"

const pool = new pg.Pool({ connectionString: env.DATABASE_URL, max: 10 });

const userRepository = new PgUserRepository(pool);
const refreshTokenRepository = new PgRefreshTokenRepository(pool);
const hasher = new Argon2PasswordHasher();
const tokens = new JwtTokenService(env.JWT_ACCESS_SECRET);
const sessions = new SessionService(tokens, refreshTokenRepository, env.REFRESH_TOKEN_TTL_DAYS);
const events = new PinoSecurityEvents();
const breachedPasswords = new PwnedPasswordsChecker();
const google = new GoogleIdentityProvider(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, env.GOOGLE_REDIRECT_URI);

const app = createApp({
  checkDb: async () => {
    await pool.query("SELECT 1")
  },
  registerUser: new RegisterUser(userRepository, hasher, breachedPasswords),
  loginWithPassword: new LoginWithPassword(userRepository, hasher, sessions),
  refreshSession: new RefreshSession(userRepository, refreshTokenRepository, tokens, sessions, events),
  logout: new Logout(refreshTokenRepository, tokens),
  tokens,
  getCurrentUser: new GetCurrentUser(userRepository),
  startGoogleSignIn: new StartGoogleSignIn(google),
  completeGoogleSignIn: new CompleteGoogleSignIn(google, userRepository, sessions)
})

const server = app.listen(env.PORT, () => {
  logger.info(`API listening on http://localhost:${env.PORT}`)
})

const shutdown = (signal: string) => {
  logger.info({ signal }, "shutting down")
  server.close(() => {
    void pool.end().then(() => process.exit(0))
  })
}
process.on("SIGINT", () => shutdown("SIGINT"))
process.on("SIGTERM", () => shutdown("SIGTERM"))