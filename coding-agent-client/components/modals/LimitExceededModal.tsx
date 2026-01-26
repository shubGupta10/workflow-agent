"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, TrendingUp } from "lucide-react";
import { QuotaError } from "@/lib/types/subscription";
import { formatDistanceToNow } from "date-fns";

interface LimitExceededModalProps {
    open: boolean;
    onClose: () => void;
    quotaError?: QuotaError;
}

export function LimitExceededModal({ open, onClose, quotaError }: LimitExceededModalProps) {
    const quota = quotaError?.quota;
    const resetTime = quota?.resetTime ? new Date(quota.resetTime) : null;
    const timeUntilReset = resetTime ? formatDistanceToNow(resetTime, { addSuffix: true }) : "tomorrow";

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-destructive/10 rounded-full">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                        </div>
                        <DialogTitle>Daily Limit Reached</DialogTitle>
                    </div>
                    <DialogDescription>
                        {quotaError?.message || "You've reached your daily task limit."}
                    </DialogDescription>
                </DialogHeader>

                {quota && (
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1 p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Tasks Used</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {quota.used} / {quota.limit}
                                </p>
                            </div>
                            <div className="space-y-1 p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Resets
                                </p>
                                <p className="text-sm font-medium text-foreground">
                                    {timeUntilReset}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <div className="flex items-start gap-3">
                                <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">
                                        Need more tasks?
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Upgrade to Pro for 10 tasks per day or Team for 20 tasks per day.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter className="sm:justify-between">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="default" disabled>
                        Upgrade Plan (Coming Soon)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
