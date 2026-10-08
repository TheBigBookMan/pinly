import js from "@eslint/js"
import tseslint from "typescript-eslint"

const infraPackages = [
  "express", "pg", "zod", "jose", "pino", "pino-http", "cors", "helmet",
  "cookie-parser", "express-rate-limit", "openid-client", "@node-rs/*", "@aws-sdk/*",
]

export default [
  { ignores: ["dist", "node_modules"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Express error handlers need an unused `_next` parameter.
    rules: { "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }] },
  },
  {
    // The domain imports nothing but itself.
    files: ["src/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          { group: ["**/adapters/**", "**/application/**", "**/config/**"], message: "The domain can't depend on outer layers." },
          { group: [...infraPackages, "node:*"], message: "The domain stays free of packages and Node APIs." },
        ],
      }],
    },
  },
  {
    // Use cases and ports know nothing about HTTP, databases or SDKs.
    files: ["src/application/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          { group: ["**/adapters/**"], message: "The application layer can't depend on adapters." },
          { group: infraPackages, message: "Put infrastructure behind a port and implement it in an adapter." },
        ],
      }],
    },
  },
]