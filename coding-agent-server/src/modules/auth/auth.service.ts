import axios from "axios";
import jwt from "jsonwebtoken";
import { Octokit } from "@octokit/rest";
import { User } from "../user/user.model";

export const handleGithubCallback = async (code: string): Promise<string> => {
  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    },
    {
      headers: { Accept: "application/json" },
    }
  );

  const accessToken = tokenRes.data.access_token;
  if (!accessToken) {
    throw new Error("Failed to get GitHub access token");
  }

  const octokit = new Octokit({
    auth: accessToken,
  });

  const { data: githubUser } = await octokit.rest.users.getAuthenticated();
  const { data: emails } = await octokit.rest.users.listEmailsForAuthenticated();

  const primaryEmail = emails.find(
    (e) => e.primary && e.verified
  )?.email;

  if (!primaryEmail) {
    throw new Error("No verified email found");
  }

  let user = await User.findOne({ githubId: githubUser.id.toString() });

  if (!user) {
    user = await User.create({
      name: githubUser.name || githubUser.login,
      email: primaryEmail,
      githubId: githubUser.id.toString(),
      githubAccessToken: accessToken,
    });
  } else {
    user.githubAccessToken = accessToken;
    await user.save();
  }

  const jwtToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  return jwtToken;
};

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
