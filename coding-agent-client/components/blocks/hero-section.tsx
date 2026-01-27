"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Glow } from "@/components/ui/glow";

interface HeroAction {
    text: string;
    href: string;
    icon?: React.ReactNode;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link";
}

interface HeroProps {
    badge?: {
        text: string;
        action: {
            text: string;
            href: string;
        };
    };
    title: string;
    description: string;
    actions: HeroAction[];
}

export function HeroSection({
    badge,
    title,
    description,
    actions,
}: HeroProps) {
    return (
        <section
            className={cn(
                "bg-background text-foreground",
                "pt-4 pb-0 px-4",
                "relative overflow-hidden flex flex-col items-center justify-start min-h-screen"
            )}
        >
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Glow variant="top" className="opacity-30" />
            </div>

            <div className="mx-auto flex max-w-[800px] flex-col gap-6 items-center justify-center text-center relative z-10 pt-10 pb-16">
                {/* Badge */}
                {badge && (
                    <Badge variant="outline" className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100 gap-2 cursor-pointer rounded-full px-4 py-1.5 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors mb-6">
                        <span className="text-muted-foreground">{badge.text}</span>
                        <a href={badge.action.href} className="flex items-center gap-1 font-medium hover:text-primary transition-colors">
                            {badge.action.text}
                            <ArrowRightIcon className="h-3 w-3" />
                        </a>
                    </Badge>
                )}

                {/* Title */}
                <h1 className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-5xl font-extrabold tracking-tighter text-transparent sm:text-7xl md:text-8xl leading-[1] drop-shadow-sm">
                    {title}
                </h1>

                {/* Description */}
                <p className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed mt-4">
                    {description}
                </p>

                {/* Actions */}
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 flex flex-wrap justify-center gap-4 mt-8">
                    {actions.map((action, index) => (
                        <Button key={index} variant={action.variant} size="lg" asChild className="h-12 px-8 text-base rounded-full">
                            <a href={action.href} className="flex items-center gap-2">
                                {action.icon}
                                {action.text}
                            </a>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Ambient Bottom Glow - Positioned to blend perfectly */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100%] h-[400px] bg-[radial-gradient(ellipse_at_bottom,_var(--primary)_0%,_transparent_70%)] opacity-40 blur-[80px] pointer-events-none z-0 mix-blend-screen translate-y-[30%]" />
        </section>
    );
}
