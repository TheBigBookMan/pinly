import request from "supertest"
import { describe, expect, it } from "vitest"
import { createApp } from "@/adapters/inbound/http/createApp"

describe("GET /health", () => {
  it("returns ok when the database check passes", async () => {
    const app = createApp({ checkDb: async () => {} })
    const res = await request(app).get("/health")
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: "ok" })
  })

  it("returns 500 when the database check fails", async () => {
    const app = createApp({
      checkDb: async () => {
        throw new Error("db down")
      },
    })
    const res = await request(app).get("/health")
    expect(res.status).toBe(500)
  })
})