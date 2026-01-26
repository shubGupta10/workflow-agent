import { create } from "zustand";
import { getUsageStats } from "@/lib/api/subscription";
import { UsageStats } from "@/lib/types/subscription";

interface SubscriptionStore {
    usageStats: UsageStats | null;
    isLoading: boolean;
    error: string | null;
    lastFetched: number | null;
    setUsageStats: (stats: UsageStats) => void;
    clearStats: () => void;
    fetchUsageStats: () => Promise<void>;
    refreshStats: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
    usageStats: null,
    isLoading: false,
    error: null,
    lastFetched: null,

    setUsageStats: (stats) => set({
        usageStats: stats,
        error: null,
        lastFetched: Date.now()
    }),

    clearStats: () => set({
        usageStats: null,
        error: null,
        lastFetched: null
    }),

    fetchUsageStats: async () => {
        // Don't fetch if we fetched less than 10 seconds ago
        const { lastFetched } = get();
        if (lastFetched && Date.now() - lastFetched < 10000) {
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const response = await getUsageStats();
            set({
                usageStats: response.data,
                isLoading: false,
                lastFetched: Date.now()
            });
        } catch (error: any) {
            set({
                usageStats: null,
                isLoading: false,
                error: error.message || "Failed to fetch usage stats"
            });
            throw error;
        }
    },

    refreshStats: async () => {
        // Force refresh regardless of last fetch time
        set({ isLoading: true, error: null });
        try {
            const response = await getUsageStats();
            set({
                usageStats: response.data,
                isLoading: false,
                lastFetched: Date.now()
            });
        } catch (error: any) {
            set({
                usageStats: null,
                isLoading: false,
                error: error.message || "Failed to fetch usage stats"
            });
            throw error;
        }
    },
}));

export const getUsageStatsState = () => useSubscriptionStore.getState().usageStats;
