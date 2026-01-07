"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { useAuthStore } from "@/lib/store/userStore";
import { useSidebarToggle } from "@/lib/store/sidebarToggleStore";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const { user, clearUser } = useAuthStore();
  const { toggleSidebar } = useSidebarToggle();

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, [pathname]);

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('coding_agent_token');
      document.cookie = 'coding_agent_token=; path=/; max-age=0; SameSite=Lax';
    }
    clearUser();
    setIsAuth(false);
    router.push("/login");
  };

  const handleChatClick = () => {
    router.push("/chat");
  };

  return (
    <nav className="w-full border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu - Mobile Only - Show on /chat page */}
            {pathname === "/chat" && toggleSidebar && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="md:hidden"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}

            {/* Logo / App Name */}
            <Link href={isAuth ? "/chat" : "/"} className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold text-foreground">
                Coding Agent
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            {isAuth ? (
              <>
                {/* Chat Link */}
                <Link href="/chat">
                  <Button
                    variant={pathname === "/chat" ? "default" : "ghost"}
                    className="text-foreground bg-background hover:bg-accent hover:text-foreground hover:cursor-pointer"
                  >
                    Chat
                  </Button>
                </Link>

                {/* User Info / Logout */}
                {user && (
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {user.name}
                  </span>
                )}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="bg-destructive hover:bg-destructive/50 text-accent hover:text-foreground hover:cursor-pointer"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={handleLoginClick}
                variant="outline"
                className="text-foreground"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

