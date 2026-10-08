import cors from "cors"
import express, { type ErrorRequestHandler } from "express"
import helmet from "helmet"
import pinoHttp from "pino-http"
import { env } from "@/config/env"
import { logger } from "@/config/logger"

type Deps = {
  checkDb: () => Promise<void>
}

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  req.log.error({ err }, "unhandled error")
  res.status(500).json({ error: { code: "internal_error", message: "Something went wrong." } })
}

export function createApp(deps: Deps) {
  const app = express()

  app.use(pinoHttp({ logger }))
  app.use(helmet())
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
  app.use(express.json({ limit: "100kb" }))

  app.get("/health", async (_req, res) => {
    await deps.checkDb()
    res.json({ status: "ok" })
  })

  app.use((_req, res) => {
    res.status(404).json({ error: { code: "not_found", message: "Not found" } })
  })
  app.use(errorHandler)

  return app
}