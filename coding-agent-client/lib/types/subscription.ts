export enum SubscriptionTier {
    FREE = "free",
    PRO = "pro",
    TEAM = "team"
}

export enum SubscriptionStatus {
    ACTIVE = "active",
    CANCELLED = "cancelled",
    EXPIRED = "expired"
}

export interface Subscription {
    _id: string;
    userId: string;
    tier: SubscriptionTier;
    status: SubscriptionStatus;
    taskUsedToday: number;
    dailyTaskLimit: number;
    lastResetDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface UsageStats {
    tier: SubscriptionTier;
    status: SubscriptionStatus;
    taskUsedToday: number;
    remainingTaskToday: number;
    dailyTaskLimit: number;
    resetTime: string;
}

export interface SubscriptionResponse {
    message: string;
    data: Subscription;
}

export interface UsageStatsResponse {
    message: string;
    data: UsageStats;
}

export interface QuotaError {
    message: string;
    error: string;
    quota?: {
        used: number;
        limit: number;
        tier: SubscriptionTier;
        resetTime: string;
    };
}
