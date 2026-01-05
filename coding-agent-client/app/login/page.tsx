'use client';

import { Button } from "@/components/ui/button";
import { Sparkles, Github } from "lucide-react";

export default function LoginPage() {
  const handleGitHubLogin = () => {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5500";

    window.location.href = `${backendUrl}/api/auth/github`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-2xl font-bold text-foreground">
            Coding Agent
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered code review and task automation
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in with your GitHub account to get started
          </p>

          <Button
            onClick={handleGitHubLogin}
            size="lg"
            className="w-full text-base py-6 h-auto"
          >
            <Github className="w-5 h-5 mr-2" />
            Continue with GitHub
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
