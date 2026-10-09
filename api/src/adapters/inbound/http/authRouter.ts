import { RegisterUser } from "@/application/use-cases/auth/RegisterUser";
import { Router } from "express";
import z from "zod";

const registerBody = z.object({
  email: z.string().trim().email().max(254),
  username: z.string().max(100),
  password: z.string().max(1000)
}).strict();

export function authRouter(deps: {registerUser: RegisterUser}) {
  const router = Router();

  router.post("/register", async (req, res) => {
    const body = registerBody.parse(req.body);
    const user = await deps.registerUser.execute(body);
    res.status(201).json({user: {id: user?.id, email: user?.email, username: user?.username}});
  });

  return router;
}