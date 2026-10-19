import rateLimit from "express-rate-limit";

const tooMany = {error: {code: "rate_limited", message: "Too many requests. Try again later."}};

const base = {standardHeaders: "draft-7", legacyHeaders: false, message: tooMany} as const;

export const apiLimiter = rateLimit({...base, windowMs: 60_000, limit: 300});

export const loginIpLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60_000,
  limit: 10,
  skipSuccessfulRequests: true
});

export const loginAccountLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60_000,
  limit: 20,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    const email: unknown = req.body?.email;
    return typeof email === "string" ? email.trim().toLowerCase().slice(0, 254) : "no-email";
  }
});

export const registerLimiter = rateLimit({...base, windowMs: 60 * 60_000, limit: 5});
export const refreshLimiter = rateLimit({...base, windowMs: 15 * 60_000, limit: 60});

export const oauthLimiter = rateLimit({ ...base, windowMs: 15 * 60_000, limit: 30 });