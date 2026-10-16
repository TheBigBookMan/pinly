import { env } from "@/config/env";
import { RequestHandler } from "express";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export const requireTrustedOrigin: RequestHandler = (req, res, next) => {
  if (!SAFE_METHODS.has(req.method)) {
    const origin = req.headers.origin;
    const site = req.headers["sec-fetch-site"];
    const forged = origin ? origin !== env.CORS_ORIGIN : site === "cross-site";

    if (forged) {
      res.status(403).json({error: {code: "forbidden_origin", message: "Request origin not allowed"}});
      return;
    }
  }

  next();
}