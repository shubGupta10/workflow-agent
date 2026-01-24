"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ComingSoonPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
            <div className="space-y-6 max-w-md">
                <div className="flex justify-center mb-8">
                    <div className="p-4 bg-primary/10 rounded-full animate-pulse">
                        <Sparkles className="w-12 h-12 text-primary" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                    Coming Soon
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed">
                    We're putting the finishing touches on RepoFlow. Stay tuned!
                </p>

                <div className="pt-12">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
