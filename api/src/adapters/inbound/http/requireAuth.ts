import { TokenService } from "@/application/ports/TokenService";
import { UnauthorizedError } from "@/domain/errors";
import { RequestHandler, Response } from "express";

const BEARER = /^Bearer\s+(.+)$/i;

export const makeRequireAuth = (tokens: TokenService): RequestHandler => async (req, res, next) => {
  const match = BEARER.exec(req.headers.authorization ?? "");

  try {
    if (!match) throw new UnauthorizedError();
    const {userId} = await tokens.verifyAccessToken(match[1]!.trim());
    res.locals.userId;
  } catch (err) {
    res.setHeader("WWW-Authenticate", "Bearer");
    throw err;
  }

  next();
}

export const currentUserId = (res: Response): string => {
  const id: unknown = res.locals.userId;
  if (typeof id !== "string") throw new UnauthorizedError();
  return id;
}