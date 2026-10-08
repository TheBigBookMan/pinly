import pg from "pg"
import { createApp } from "@/adapters/inbound/http/createApp"
import { env } from "@/config/env"
import { logger } from "@/config/logger"

const pool = new pg.Pool({ connectionString: env.DATABASE_URL, max: 10 })

const app = createApp({
  checkDb: async () => {
    await pool.query("SELECT 1")
  },
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