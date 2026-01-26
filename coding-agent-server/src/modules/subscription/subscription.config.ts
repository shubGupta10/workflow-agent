import { SubscriptionTier } from "./subscription.enum";

export const SUBSCRIPTION_LIMITS = {
    [SubscriptionTier.FREE]: {
        dailyTaskLimit: 5,
        name: "Free Plan",
        features: ["5 tasks per day", "Basic support"]
    },
    [SubscriptionTier.PRO]: {
        dailyTaskLimit: 10,
        name: "Pro Plan",
        features: ["10 tasks per day", "Priority support", "Advanced analytics"]
    },
    [SubscriptionTier.TEAM]: {
        dailyTaskLimit: 20,
        name: "Team Plan",
        features: ["20 tasks per day", "Team collaboration", "Dedicated support", "Custom integrations"]
    }
} as const;

export type SubscriptionConfig = typeof SUBSCRIPTION_LIMITS[keyof typeof SUBSCRIPTION_LIMITS];
