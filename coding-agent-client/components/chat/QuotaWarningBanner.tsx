"use client";

import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface QuotaWarningBannerProps {
    remainingTasks: number;
    usedTasks: number;
    totalTasks: number;
    tier: string;
}

export function QuotaWarningBanner({
    remainingTasks,
    usedTasks,
    totalTasks,
    tier
}: QuotaWarningBannerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const isCritical = remainingTasks <= 1;
    const isWarning = remainingTasks === 2;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || (!isCritical && !isWarning)) {
            return;
        }

        const dismissedKey = `quota-warning-dismissed-${remainingTasks}`;
        const isDismissed = sessionStorage.getItem(dismissedKey);

        if (!isDismissed) {
            setIsOpen(true);
        }
    }, [mounted, remainingTasks, isCritical, isWarning]);

    const handleDismiss = () => {
        const dismissedKey = `quota-warning-dismissed-${remainingTasks}`;
        sessionStorage.setItem(dismissedKey, 'true');
        setIsOpen(false);
    };

    if (!mounted || (!isCritical && !isWarning)) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className={`sm:max-w-md ${isCritical
                ? "border-red-500/50"
                : "border-amber-500/50"
                }`}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className={`h-5 w-5 ${isCritical
                            ? "text-red-600 dark:text-red-400"
                            : "text-amber-600 dark:text-amber-400"
                            }`} />
                        <span>Task Limit Warning</span>
                    </DialogTitle>
                    <DialogDescription className="pt-2" asChild>
                        <div>
                            <div className={`rounded-lg border p-4 ${isCritical
                                ? "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400"
                                : "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                }`}>
                                {remainingTasks === 0 ? (
                                    <p className="text-sm font-medium">
                                        You've reached your daily limit of <strong>{totalTasks} tasks</strong>.
                                    </p>
                                ) : remainingTasks === 1 ? (
                                    <p className="text-sm font-medium">
                                        You have only <strong>1 task</strong> remaining today ({usedTasks}/{totalTasks} used).
                                    </p>
                                ) : (
                                    <p className="text-sm font-medium">
                                        You have <strong>{remainingTasks} tasks</strong> remaining today ({usedTasks}/{totalTasks} used).
                                    </p>
                                )}
                            </div>
                            <p className="mt-4 text-sm text-muted-foreground">
                                Your quota will reset at midnight. Upgrade to get more tasks per day!
                            </p>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={handleDismiss}>
                        Dismiss
                    </Button>
                    <Link href="/dashboard">
                        <Button
                            className={
                                isCritical
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "bg-amber-600 hover:bg-amber-700 text-white"
                            }
                            onClick={handleDismiss}
                        >
                            Upgrade Plan
                        </Button>
                    </Link>
                </div>
            </DialogContent>
        </Dialog>
    );
}
