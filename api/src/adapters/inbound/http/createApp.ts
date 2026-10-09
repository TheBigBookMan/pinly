import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env } from "@/config/env";
import { logger } from "@/config/logger";
import type { RegisterUser } from "@/application/use-cases/auth/RegisterUser";
import { errorHandler } from "./errorHandler";
import { authRouter } from "./authRouter";

type Deps = {
  checkDb: () => Promise<void>;
  registerUser: RegisterUser;
}

export function createApp(deps: Deps) {
  const app = express();

  app.use(pinoHttp({ logger, redact: ["req.headers.authorization", "req.headers.cookie"] }));
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/health", async (_req, res) => {
    await deps.checkDb();
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRouter(deps));

  app.use((_req, res) => {
    res.status(404).json({ error: { code: "not_found", message: "Not found" } });
  })
  app.use(errorHandler);

  return app;
}