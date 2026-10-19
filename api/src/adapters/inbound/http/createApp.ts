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
import { randomUUID } from "node:crypto";
import { apiLimiter } from "./rateLimits";
import { StartGoogleSignIn } from "@/application/use-cases/auth/StartGoogleSignIn";
import { CompleteGoogleSignIn } from "@/application/use-cases/auth/CompleteGoogleSignIn";
import { googleRouter } from "./googleRouter";

type Deps = {
  checkDb: () => Promise<void>;
  tokens: TokenService;
  registerUser: RegisterUser;
  loginWithPassword: LoginWithPassword;
  refreshSession: RefreshSession;
  logout: Logout;
  getCurrentUser: GetCurrentUser;
  startGoogleSignIn: StartGoogleSignIn;
  completeGoogleSignIn: CompleteGoogleSignIn
}

export function createApp(deps: Deps) {
  const app = express();
  const requireAuth = makeRequireAuth(deps.tokens);

  app.set("trust proxy", env.TRUST_PROXY_HOPE);

  app.use(pinoHttp({ 
    logger, 
    genReqId: (_req, res) => {
      const id = randomUUID();
      res.setHeader("X-Request-Id", id);
      return id;
    },
    customLogLevel: (_req, res, err) => err || res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info",
    redact: ["req.headers.authorization", "req.headers.cookie", "res.headers['set-cookie']"],
    serializers: {
      req: (req) => {
        req.url = req.url?.split("?")[0];
        return req;
      }
    }
  }));

  app.use(helmet({
    contentSecurityPolicy: {useDefaults: false, directives: {defaultSrc: ["'none'"], frameAncestors: ["'none'"]}}
  }));

  app.use(cors({ 
    origin: env.CORS_ORIGIN, 
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 600
  }));

  app.get("/health", async (_req, res) => {
    await deps.checkDb();
    res.json({ status: "ok" });
  });

  app.use("/api", (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
  });

  app.use("/api", apiLimiter);
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  app.use("/api/auth/google", googleRouter(deps));
  app.use("/api/auth", authRouter({...deps, requireAuth}));

  app.use("/api", requireAuth);

  app.use((_req, res) => {
    res.status(404).json({ error: { code: "not_found", message: "Not found" } });
  })
  app.use(errorHandler);

  return app;
}