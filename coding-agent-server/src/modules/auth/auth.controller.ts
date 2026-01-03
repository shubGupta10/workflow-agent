import { Request, Response } from "express";
import { getUserById, handleGithubCallback } from "./auth.service";
import { AuthRequest } from "../../middleware/auth.middleware";

export const githubRedirect = (req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID as string,
    scope: "read:user user:email",
  });

  const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  res.redirect(githubAuthUrl);
};

export const githubCallback = async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ message: "Missing OAuth code" });
  }

  const token = await handleGithubCallback(code);

  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
};



export const getMe = async (req: AuthRequest, res: Response) => {

  if(!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = req.user.userId;

  const user = await getUserById(userId);

  res.json({
    success: true,
    user,
  });
};
