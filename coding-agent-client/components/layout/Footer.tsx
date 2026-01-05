"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  
  if (pathname === "/chat") {
    return null;
  }

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Coding Agent • Built with AI
          </p>
        </div>
      </div>
    </footer>
  );
}

