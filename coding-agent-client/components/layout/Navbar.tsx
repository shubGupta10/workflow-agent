"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, Menu, X, User, Settings, LogOut } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { useAuthStore } from "@/lib/store/userStore";
import { useSidebarToggle } from "@/lib/store/sidebarToggleStore";
import { ModeToggle } from "@/components/layout/toggleButton";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, clearUser } = useAuthStore();
  const { toggleSidebar } = useSidebarToggle();

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, [pathname]);

  const handleLoginClick = () => {
    if (process.env.NODE_ENV === "development") {
      router.push("/login");
    } else {
      router.push("/coming-soon");
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('coding_agent_token');
      document.cookie = 'coding_agent_token=; path=/; max-age=0; SameSite=Lax';
    }
    clearUser();
    setIsAuth(false);
    setMobileMenuOpen(false);
    router.push("/login");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="w-full border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo and Sidebar Toggle */}
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle - Show on /chat page for mobile */}
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
                RepoFlow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isAuth && (
              <>
                <Link href="/chat">
                  <Button
                    variant="ghost"
                    className="text-foreground"
                  >
                    Chat
                  </Button>
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <ModeToggle />

            {/* Auth Section */}
            {isAuth ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 cursor-pointer"
                  >
                    <Avatar
                      fallback={user?.name || "User"}
                      className="h-10 w-10 cursor-pointer"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} variant="destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleLoginClick} variant="default">
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuth ? (
                <>
                  {/* User Info */}
                  <div className="px-3 py-2 border-b border-border mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar
                        fallback={user?.name || "User"}
                        className="h-10 w-10"
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <Button
                    variant={pathname === "/chat" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleNavigation("/chat")}
                  >
                    Chat
                  </Button>
                  <Button
                    variant={pathname === "/profile" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleNavigation("/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant={pathname === "/settings" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleNavigation("/settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <div className="pt-2 border-t border-border mt-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  onClick={handleLoginClick}
                  variant="default"
                  className="w-full"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

