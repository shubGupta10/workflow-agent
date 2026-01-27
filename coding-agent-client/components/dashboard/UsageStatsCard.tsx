"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/hooks/useSubscription";
import { QuotaProgressBar } from "./QuotaProgressBar";
import { TierBadge } from "./TierBadge";
import { Loader2, RefreshCw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export function UsageStatsCard() {
    const { usageStats, isLoading, error, refreshStats } = useSubscription();

    if (isLoading && !usageStats) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    if (error && !usageStats) {
        return (
            <Card>
                <CardContent className="py-12">
                    <div className="text-center">
                        <p className="text-sm text-destructive mb-4">{error}</p>
                        <Button onClick={refreshStats} variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!usageStats) {
        return null;
    }

    const resetTime = new Date(usageStats.resetTime);
    const timeUntilReset = formatDistanceToNow(resetTime, { addSuffix: true });

    return (
        <Card className="w-full border-primary/10 shadow-sm overflow-hidden">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
                    {/* Left Section: Identity */}
                    <div className="p-6 flex flex-row md:flex-col items-center md:items-start justify-between gap-4 md:w-64 shrink-0 bg-muted/30">
                        <div>
                            <CardTitle className="text-lg font-semibold mb-1">Daily Usage</CardTitle>
                            <p className="text-xs text-muted-foreground">Track your subscription quota</p>
                        </div>
                        <TierBadge tier={usageStats.tier} />
                    </div>

                    {/* Middle Section: Progress */}
                    <div className="flex-1 p-6 flex flex-col justify-center gap-4">
                        <div className="flex items-end justify-between mb-2">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-foreground">Tasks Used</p>
                                <p className="text-xs text-muted-foreground">Resets {timeUntilReset}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-foreground">{usageStats.taskUsedToday}</span>
                                <span className="text-sm text-muted-foreground"> / {usageStats.dailyTaskLimit}</span>
                            </div>
                        </div>
                        <QuotaProgressBar
                            used={usageStats.taskUsedToday}
                            limit={usageStats.dailyTaskLimit}
                        />
                    </div>

                    {/* Right Section: Action */}
                    <div className="p-6 flex items-center justify-center md:w-48 shrink-0 bg-muted/30">
                        <div className="text-center space-y-3 w-full">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Remaining</p>
                                <p className="text-3xl font-bold text-primary">{usageStats.remainingTaskToday}</p>
                            </div>
                            <Button
                                onClick={refreshStats}
                                variant="outline"
                                size="sm"
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                                ) : (
                                    <RefreshCw className="h-3 w-3 mr-2" />
                                )}
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
