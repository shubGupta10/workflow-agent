"use client";

import { ArrowRight, Terminal, Bot, User, Check, ChevronRight, Shield, GitBranch, FileCode, Play, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";

export function Hero() {
    return (
        <div className="w-full">
            <section className="w-full py-8 md:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="flex flex-col items-center space-y-6 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.h1
                            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none max-w-5xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                                Development,
                            </span>
                            {" "}Fully Automated
                        </motion.h1>
                        <motion.p
                            className="mx-auto max-w-3xl text-lg sm:text-xl text-muted-foreground leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            AI that understands your code, plans changes, and executes safely.
                        </motion.p>
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <Link href="/coming-soon">
                                <Button className="rounded-xl px-8 h-auto py-3 text-base">
                                    Get Started
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            className="flex flex-col items-center space-y-3 pb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <div className="flex items-center space-x-4 text-sm">
                                <span className="text-primary hover:text-primary/80 transition-colors">
                                    Approval-first
                                </span>
                                <span className="text-muted-foreground/60">
                                    Sandbox execution
                                </span>
                                <span className="text-primary hover:text-primary/80 transition-colors">
                                    Full task history
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground/60">
                                Review every step before execution. Your code, your control.
                            </p>
                        </motion.div>

                        <motion.div
                            className="w-full max-w-5xl mt-16 relative hidden md:block"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            {/* Graphic Container */}
                            <div className="relative w-full p-8 md:p-12 border border-border/40 bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[340px]">
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-40 pointer-events-none" />

                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-5xl gap-8 md:gap-0">

                                    {/* STEP 1: REPO */}
                                    <div className="flex flex-col items-center gap-3 w-40 shrink-0 relative group">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground/60 tracking-widest uppercase">
                                            Step 01
                                        </div>
                                        <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg group-hover:border-blue-500/50 transition-colors z-10">
                                            <FileCode className="w-8 h-8 text-blue-500/80" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-sm font-semibold text-foreground">Repository</h3>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-1">Context Source</p>
                                        </div>
                                    </div>

                                    {/* ARROW 1: ANALYZE */}
                                    <div className="hidden md:flex flex-1 items-center justify-center relative px-4 text-center">
                                        <div className="w-full h-px bg-border absolute top-1/2 -translate-y-1/2 -z-10" />
                                        <div className="bg-background/80 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground font-medium border border-border/50 rounded-full z-10 shadow-sm">
                                            Read Only
                                        </div>
                                        <motion.div
                                            className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-500/20 -translate-y-1/2 -z-10"
                                            initial={{ scaleX: 0, originX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                    </div>

                                    {/* STEP 2: AGENT (CENTER) */}
                                    <div className="flex flex-col items-center gap-5 w-72 shrink-0 relative">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground/60 tracking-widest uppercase">
                                            Step 02
                                        </div>
                                        <div className="relative">
                                            {/* Core Node */}
                                            <div className="w-20 h-20 rounded-2xl bg-card border border-orange-500/30 flex items-center justify-center shadow-[0_0_40px_-10px_rgba(249,115,22,0.2)] dark:shadow-[0_0_40px_-10px_rgba(249,115,22,0.15)] z-10 relative">
                                                <div className="absolute inset-0 bg-orange-500/5 rounded-2xl" />
                                                <Bot className="w-8 h-8 text-orange-500" />

                                                {/* Human Approval Badge */}
                                                <div className="absolute -top-3.5 -right-6 bg-background border border-border/60 shadow-md rounded-full py-1.5 px-3 flex items-center gap-2 z-20">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                    </span>
                                                    <span className="text-[10px] font-bold text-foreground tracking-tight whitespace-nowrap">WAITING APPROVAL</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center space-y-1.5 z-10">
                                            <h3 className="text-lg font-bold text-foreground">Planning Agent</h3>
                                            <p className="text-xs text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                                                Blueprints the changes. <br /> You approve before it runs.
                                            </p>
                                        </div>

                                        {/* Micro Capabilities Chips */}
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-secondary/50 border border-border/40 text-muted-foreground flex items-center gap-1.5 shadow-sm">
                                                <Terminal className="w-3 h-3" /> Code Aware
                                            </div>
                                            <div className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-secondary/50 border border-border/40 text-muted-foreground flex items-center gap-1.5 shadow-sm">
                                                <Shield className="w-3 h-3" /> Safe Execution
                                            </div>
                                        </div>
                                    </div>

                                    {/* ARROW 2: APPLY */}
                                    <div className="hidden md:flex flex-1 items-center justify-center relative px-4 text-center">
                                        <div className="w-full h-px bg-border absolute top-1/2 -translate-y-1/2 -z-10" />
                                        <div className="bg-background/80 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground font-medium border border-border/50 rounded-full z-10 shadow-sm">
                                            Apply
                                        </div>
                                        <motion.div
                                            className="absolute top-1/2 left-0 right-0 h-0.5 bg-green-500/20 -translate-y-1/2 -z-10"
                                            initial={{ scaleX: 0, originX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                        />
                                    </div>

                                    {/* STEP 3: PR */}
                                    <div className="flex flex-col items-center gap-3 w-40 shrink-0 relative group">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground/60 tracking-widest uppercase">
                                            Step 03
                                        </div>
                                        <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg group-hover:border-green-500/50 transition-colors z-10">
                                            <div className="relative">
                                                <GitBranch className="w-8 h-8 text-green-500/80" />
                                                <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border border-border/20 shadow-sm">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 fill-green-500/20" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-sm font-semibold text-foreground">Pull Request</h3>
                                            <p className="text-[10px] text-green-500 uppercase tracking-wider font-medium mt-1">Ready to Merge</p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Supporting Caption */}
                            <div className="mt-8 text-center">
                                <p className="text-sm text-muted-foreground/80 font-medium">
                                    No blind execution. Every change is planned, reviewed, and approved.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
