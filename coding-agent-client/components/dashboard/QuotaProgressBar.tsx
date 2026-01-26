import { cn } from "@/lib/utils";

interface QuotaProgressBarProps {
    used: number;
    limit: number;
    className?: string;
}

export function QuotaProgressBar({ used, limit, className }: QuotaProgressBarProps) {
    const percentage = Math.min((used / limit) * 100, 100);

    // Color based on usage percentage
    const getColor = () => {
        if (percentage >= 100) return "bg-destructive";
        if (percentage >= 80) return "bg-yellow-500 dark:bg-yellow-600";
        if (percentage >= 50) return "bg-primary";
        return "bg-primary";
    };

    return (
        <div className={cn("w-full", className)}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                    {used} / {limit} tasks used
                </span>
                <span className="text-sm text-muted-foreground">
                    {percentage.toFixed(0)}%
                </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full transition-all duration-500 ease-out",
                        getColor()
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
