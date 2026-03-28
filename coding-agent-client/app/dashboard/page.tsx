import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { RecentTasksCard } from "@/components/dashboard/RecentTasksCard";
import { UsageStatsCard } from "@/components/dashboard/UsageStatsCard";
import { QuotaProgressBar } from "@/components/dashboard/QuotaProgressBar";
import { TierBadge } from "@/components/dashboard/TierBadge";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <QuickActionsCard />
          <UsageStatsCard />
          <RecentTasksCard />
          <QuotaProgressBar />
          <TierBadge />
          {/* Add other dashboard components here */}
        </div>
      </div>
    </div>
  );
}