import { CompleteGoogleSignIn } from "@/application/use-cases/auth/CompleteGoogleSignIn";
import { StartGoogleSignIn } from "@/application/use-cases/auth/StartGoogleSignIn";
import { env } from "@/config/env";
import { Router } from "express";
import { oauthLimiter } from "./rateLimits";
import { clearOAuthFlowCookie, readOAuthFlowCookie, setOAuthFlowCookie } from "./oauthFlowCookie";
import { setRefreshCookie } from "./refreshCookie";
import { DomainError } from "@/domain/errors";

const SHOWN_ERRORS = new Set(["account_exists", "email_not_verified", "oauth_cancelled", "oauth_failed"]);

const safeReturnTo = (value: unknown): string => {
  return typeof value === "string" && value.length <= 200 && value.startsWith("/") && !value.startsWith("//") && value.startsWith("/\\") ? value : "/homepage";
};

const toLogin = (error: string) => `${env.CORS_ORIGIN}/login?error=${error}`;

export function googleRouter(deps: {
  startGoogleSignIn: StartGoogleSignIn,
  completeGoogleSignIn: CompleteGoogleSignIn
}) {
  const router = Router();
  router.use(oauthLimiter);

  router.get("/", async (req, res) => {
    try {
      const request = await deps.startGoogleSignIn.execute();
      await setOAuthFlowCookie(res, {
        state: request.state,
        nonce: request.nonce,
        codeVerifier: request.codeVerifier,
        returnTo: safeReturnTo(req.query.returnTo)
      });
      res.redirect(request.url);
    } catch {
      res.redirect(toLogin("oauth_failed"));
    }
  });

  router.get("/callback", async (req, res) => {
    const flow = await readOAuthFlowCookie(req);
    clearOAuthFlowCookie(res);
    if(!flow) {
      res.redirect(toLogin("oauth_failed"));
      return;
    }

    const query = req.originalUrl.split("?")[1] ?? "";
    const callbackUrl = `${env.GOOGLE_REDIRECT_URI}${query ? `?$query` : ""}`;

    try {
      const {session} = await deps.completeGoogleSignIn.execute({callbackUrl, pending: flow});
      setRefreshCookie(res, session.refreshToken, session.refreshTokenExpiresAt);
      res.redirect(`${env.CORS_ORIGIN}${safeReturnTo(flow.returnTo)}`);
    } catch (err) {
      const code = err instanceof DomainError && SHOWN_ERRORS.has(err.code) ? err.code : "oauth_failed";
      req.log.warn({code}, "google sign-in did not complete");
      res.redirect(toLogin(code));
    }
  });

  return router;
}