import { Session } from "@/application/services/SessionService";
import { LoginWithPassword } from "@/application/use-cases/auth/LoginWithPassword";
import { Logout } from "@/application/use-cases/auth/Logout";
import { RefreshSession } from "@/application/use-cases/auth/RefreshSession";
import { RegisterUser } from "@/application/use-cases/auth/RegisterUser";
import { User } from "@/domain/user/User";
import { RequestHandler, Response, Router } from "express";
import z from "zod";
import { clearRefreshCookie, readRefreshCookie, setFreshCookie } from "./refreshCookie";
import { UnauthorizedError } from "@/domain/errors";
import type { GetCurrentUser } from "@/application/use-cases/auth/GetCurrentUser";
import { currentUserId } from "./requireAuth";

const email = z.string().trim().email().max(254);

const registerBody = z.object({email, username: z.string().max(100), password: z.string().max(1000)}).strict();
const loginBody = z.object({email, password: z.string().max(1000)}).strict();

type Deps = {
  registerUser: RegisterUser;
  loginWithPassword: LoginWithPassword;
  refreshSession: RefreshSession;
  logout: Logout;
  getCurrentUser: GetCurrentUser;
  requireAuth: RequestHandler;
};

const toDto = (user: User | undefined) => ({id: user?.id, email: user?.email, username: user?.username});

export function authRouter(deps: Deps) {
  const router = Router();

  router.use((_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
  });

  const signedIn = (res: Response, result: {user: User; session: Session}) => {
    setFreshCookie(res, result.session.refreshToken, result.session.refreshTokenExpiresAt);
    res.json({
      accessToken: result.session.accessToken,
      expiresIn: result.session.accessTokenExpiresIn,
      user: toDto(result.user)
    })
  }

  router.post("/register", async (req, res) => {
    const user = await deps.registerUser.execute(registerBody.parse(req.body));
    res.status(201).json({user: toDto(user)});
  })

  router.post("/login", async (req, res) => {
    signedIn(res, await deps.loginWithPassword.execute(loginBody.parse(req.body)));
  })

  router.post("/refresh", async (req, res) => {
    const card = readRefreshCookie(req);
    if (!card) throw new UnauthorizedError("session_invalid", "No active session.");

    try {
      signedIn(res, await deps.refreshSession.execute(card));
    } catch (err) {
      clearRefreshCookie(res);
      throw err;
    }
  });

  router.post("/logout", async (req, res) => {
    const card = readRefreshCookie(req);
    if (card) await deps.logout.execute(card);
    clearRefreshCookie(res);
    res.status(204).end();
  });

  router.get("/me", deps.requireAuth, async (_req, res) => {
    res.json({user: toDto(await deps.getCurrentUser.execute(currentUserId(res)))});
  })

  return router;
}