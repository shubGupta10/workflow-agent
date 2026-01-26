"use client";

import { UsageStatsCard } from "@/components/dashboard/UsageStatsCard";

export default function DashboardPage() {
    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Monitor your usage and manage your subscription
                </p>
            </div>

            <div className="space-y-6">
                {/* Usage Stats Card - Full width horizontal layout */}
                <UsageStatsCard />

                {/* Placeholder for future dashboard cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-12 min-h-[200px]">
                        <p className="text-muted-foreground text-sm text-center">
                            More features coming soon...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
