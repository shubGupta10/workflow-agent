"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ComingSoonPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

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
                    We're putting the finishing touches on RepoFlow. Join the waitlist to be notified when we launch.
                </p>

                {submitted ? (
                    <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 font-medium">
                        Thanks! We'll keep you posted.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto mt-8">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-background"
                        />
                        <Button type="submit">Notify Me</Button>
                    </form>
                )}

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
