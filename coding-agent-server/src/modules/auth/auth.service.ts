import axios from "axios";
import jwt from "jsonwebtoken";
import { User } from "../user/user.model";

type GithubUser = {
  id: number;
  login: string;
  name: string;
};

type GithubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
};

export const handleGithubCallback = async (code: string): Promise<string> => {
  // 1. Exchange code for access token
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

  // 2. Fetch GitHub user
  const userRes = await axios.get<GithubUser>(
    "https://api.github.com/user",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  // 3. Fetch email (GitHub may hide email)
  const emailRes = await axios.get<GithubEmail[]>(
    "https://api.github.com/user/emails",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const primaryEmail = emailRes.data.find(
    (e) => e.primary && e.verified
  )?.email;

  if (!primaryEmail) {
    throw new Error("No verified email found");
  }

  // 4. Find or create user
  let user = await User.findOne({ githubId: userRes.data.id.toString() });

  if (!user) {
    user = await User.create({
      name: userRes.data.name || userRes.data.login,
      email: primaryEmail,
      githubId: userRes.data.id.toString(),
      githubAccessToken: accessToken,
    });
  } else {
    user.githubAccessToken = accessToken;
    await user.save();
  }

  // 5. Issue JWT
  const jwtToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  return jwtToken;
};



export const getUserById = async (userId: string) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
