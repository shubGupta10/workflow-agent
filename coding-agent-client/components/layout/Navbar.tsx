"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { useSidebarToggle } from "@/lib/store/sidebarToggleStore";

export function Navbar() {
    const toggleSidebar = useSidebarToggle((state) => state.toggle);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center">
                    {/* Logo/Brand */}
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-bold">Coding Agent</span>
                    </Link>
                    {/* Mobile menu toggle button - visible only on small screens */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden" // Hide on medium and larger screens
                        onClick={toggleSidebar}
                        aria-label="Toggle mobile menu"
                    >
                        <MenuIcon className="h-6 w-6" />
                    </Button>
                </div>
                {/* Main Nav Links - hidden on small screens, flex on medium and larger */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    <Link href="/features" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Features
                    </Link>
                    <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Pricing
                    </Link>
                </nav>
                {/* Right section: Auth/Action Buttons - hidden on small screens, flex on medium and larger */}
                <div className="hidden md:flex flex-1 items-center justify-end space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link href="/chat">Start Coding</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}