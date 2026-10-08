import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "src/**/*.test.ts"],
    // Satisfies the env validation, so importing the app in tests doesn't exit the process.
    env: { NODE_ENV: "test", DATABASE_URL: "postgres://test:test@localhost:5432/test" },
  },
})