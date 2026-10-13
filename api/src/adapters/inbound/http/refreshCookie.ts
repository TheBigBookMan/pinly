import { env } from "@/config/env";
import type { Request, Response } from "express";

const NAME = "pinly_refresh";

const options = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: "strict" as const,
  path: "/api/auth"
};

export const setFreshCookie = (res: Response, card: string, expiresAt: Date) => {
  res.cookie(NAME, card, {...options, expires: expiresAt});
}

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie(NAME, options);
}

export const readRefreshCookie = (req: Request): string | undefined => {
  const value: unknown = req.cookies?.[NAME];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}