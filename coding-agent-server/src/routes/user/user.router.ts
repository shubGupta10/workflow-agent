import { Router } from "express";
import { githubRedirect, githubCallback, getMe } from "../../modules/auth/auth.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const authRoutes = Router();

authRoutes.get("/github", githubRedirect);
authRoutes.get("/github/callback", githubCallback);
authRoutes.get("/me", requireAuth, getMe as any);

export default authRoutes;