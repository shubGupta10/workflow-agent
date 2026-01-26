import { useEffect } from 'react';
import { useSubscriptionStore } from '@/lib/store/subscriptionStore';

export const useSubscription = () => {
    const { usageStats, isLoading, error, fetchUsageStats, refreshStats } = useSubscriptionStore();

    useEffect(() => {
        // Fetch on mount
        fetchUsageStats();

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchUsageStats();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchUsageStats]);

    return {
        usageStats,
        isLoading,
        error,
        refreshStats,
    };
};
