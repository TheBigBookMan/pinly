import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  CORS_ORIGIN: z.string().url().default("http://localhost:5173"),
  JWT_ACCESS_SECRET: z.string().min(32),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().min(1).max(90).default(30) ,
  TRUST_PROXY_HOPE: z.coerce.number().int().min(0).max(5).default(0),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().url(),
  OAUTH_COOKIE_SECRET: z.string().min(32)
});

const result = schema.safeParse(process.env);
if (!result.success) {
  console.error("Invalid environment:", result.error.issues);
  process.exit(1);
};

export const env = result.data;