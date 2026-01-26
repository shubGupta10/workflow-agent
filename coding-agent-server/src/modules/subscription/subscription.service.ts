import subscriptionModel from "./subscription.model";
import { SubscriptionTier, SubscriptionStatus } from "./subscription.enum";
import { SUBSCRIPTION_LIMITS } from "./subscription.config";

const createSubscription = async (userId: string) => {
    if (!userId) {
        throw new Error("userId is required to create subscription");
    }

    const tier = SubscriptionTier.FREE;
    const subscription = await subscriptionModel.create({
        userId,
        tier,
        status: SubscriptionStatus.ACTIVE,
        taskUsedToday: 0,
        dailyTaskLimit: SUBSCRIPTION_LIMITS[tier].dailyTaskLimit,
        lastResetDate: new Date()
    })
    return subscription;
}

const getSubscription = async (userId: string) => {

    const subscription = await subscriptionModel.findOne({ userId });
    if (!subscription) {
        throw new Error("Subscription not found");
    }
    return subscription;
}

const checkAndResetIfNeeded = async (userId: string): Promise<void> => {
    const subscription = await getSubscription(userId);

    const today = new Date();
    const lastReset = new Date(subscription.lastResetDate);

    if (lastReset.toDateString() !== today.toDateString()) {
        subscription.taskUsedToday = 0;
        subscription.lastResetDate = today;
        await subscription.save();
    }
}

const incrementUsage = async (userId: string): Promise<void> => {
    const subscription = await getSubscription(userId);
    subscription.taskUsedToday += 1;
    await subscription.save();
}

const checkLimit = async (userId: string): Promise<boolean> => {
    const subscription = await getSubscription(userId);

    if (subscription.taskUsedToday >= subscription.dailyTaskLimit) {
        const planName = SUBSCRIPTION_LIMITS[subscription.tier].name;

        throw new Error(
            `Daily task limit exceeded (${subscription.taskUsedToday}/${subscription.dailyTaskLimit}). ` +
            `You are on the ${planName}. Upgrade your plan for more tasks or try again tomorrow.`
        );
    }
    return true;
}

const getUsageStats = async (userId: string) => {
    const subscription = await getSubscription(userId);
    if (!subscription) {
        throw new Error("Subscription not found")
    }

    const remaningTaskToday = subscription.dailyTaskLimit - subscription.taskUsedToday;

    const now = new Date();
    const nextReset = new Date(now);
    nextReset.setHours(24, 0, 0, 0);

    const stats = {
        tier: subscription.tier,
        status: subscription.status,
        taskUsedToday: subscription.taskUsedToday,
        remainingTaskToday: remaningTaskToday,
        dailyTaskLimit: subscription.dailyTaskLimit,
        resetTime: nextReset
    }

    return stats;
}

export const subscriptionService = {
    createSubscription,
    getSubscription,
    checkAndResetIfNeeded,
    incrementUsage,
    checkLimit,
    getUsageStats
}