"use client";

import { ArrowRight } from "lucide-react";
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
                            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none"
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
                            className="mx-auto max-w-xl text-md sm:text-xl text-muted-foreground"
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
                            <Link href="/login">
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
                            className="w-full max-w-5xl border p-2 rounded-3xl"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        >
                            <div className="relative w-full">
                                <div className="relative w-full rounded-3xl overflow-hidden border shadow-2xl">
                                    <img
                                        src="https://ui.shadcn.com/examples/dashboard-dark.png"
                                        alt="Dashboard Preview"
                                        className="w-full h-full object-center hidden dark:block rounded-3xl"
                                    />
                                    <img
                                        src="https://ui.shadcn.com/examples/dashboard-light.png"
                                        alt="Dashboard Preview"
                                        className="w-full h-full object-center dark:hidden block rounded-3xl"
                                    />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-background to-transparent" />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
