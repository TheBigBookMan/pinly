import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env } from "@/config/env";
import { logger } from "@/config/logger";
import type { RegisterUser } from "@/application/use-cases/auth/RegisterUser";
import { errorHandler } from "./errorHandler";
import { authRouter } from "./authRouter";
import { LoginWithPassword } from "@/application/use-cases/auth/LoginWithPassword";
import { RefreshSession } from "@/application/use-cases/auth/RefreshSession";
import { Logout } from "@/application/use-cases/auth/Logout";
import cookieParser from "cookie-parser";
import type { TokenService } from "@/application/ports/TokenService";
import type { GetCurrentUser } from "@/application/use-cases/auth/GetCurrentUser";
import { makeRequireAuth } from "./requireAuth";

type Deps = {
  checkDb: () => Promise<void>;
  tokens: TokenService;
  registerUser: RegisterUser;
  loginWithPassword: LoginWithPassword;
  refreshSession: RefreshSession;
  logout: Logout;
  getCurrentUser: GetCurrentUser;
}

export function createApp(deps: Deps) {
  const app = express();
  const requireAuth = makeRequireAuth(deps.tokens);

  app.use(pinoHttp({ logger, redact: ["req.headers.authorization", "req.headers.cookie", "res.headers['set-cookie']"] }));
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  app.get("/health", async (_req, res) => {
    await deps.checkDb();
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRouter({...deps, requireAuth}));

  app.use("/api", requireAuth);

  app.use((_req, res) => {
    res.status(404).json({ error: { code: "not_found", message: "Not found" } });
  })
  app.use(errorHandler);

  return app;
}