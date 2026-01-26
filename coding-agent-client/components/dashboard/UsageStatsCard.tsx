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
        <Card className="w-full">
            {/* Horizontal Layout */}
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Left Section: Title and Badge */}
                    <div className="flex items-center justify-between md:justify-start md:gap-4 md:min-w-[200px]">
                        <div>
                            <CardTitle className="text-xl mb-1">Daily Usage</CardTitle>
                            <p className="text-sm text-muted-foreground">Track your quota</p>
                        </div>
                        <TierBadge tier={usageStats.tier} />
                    </div>

                    {/* Middle Section: Progress Bar */}
                    <div className="flex-1 min-w-0">
                        <QuotaProgressBar
                            used={usageStats.taskUsedToday}
                            limit={usageStats.dailyTaskLimit}
                        />
                    </div>

                    {/* Right Section: Stats */}
                    <div className="flex items-center gap-6 md:gap-8">
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                            <p className="text-3xl font-bold text-foreground">
                                {usageStats.remainingTaskToday}
                            </p>
                        </div>

                        <div className="text-center min-w-[100px]">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">Resets</p>
                            </div>
                            <p className="text-sm font-medium text-foreground">
                                {timeUntilReset}
                            </p>
                        </div>

                        <Button
                            onClick={refreshStats}
                            variant="outline"
                            size="sm"
                            disabled={isLoading}
                            className="hidden md:flex"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Refresh Button */}
                <Button
                    onClick={refreshStats}
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    className="w-full mt-4 md:hidden"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Refresh Stats
                </Button>
            </CardContent>
        </Card>
    );
}
