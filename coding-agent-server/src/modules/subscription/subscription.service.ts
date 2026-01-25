import subscriptionModel from "./subscription.model";
import { SubscriptionTier, SubscriptionStatus } from "./subscription.enum";

const createSubscription = async (userId: string) => {
    const subscription = await subscriptionModel.create({
        userId,
        tier: SubscriptionTier.FREE,
        status: SubscriptionStatus.ACTIVE,
        taskUsedToday: 0,
        dailyTaskLimit: 5,
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
        throw new Error("Daily task limit exceeded. Please upgrade your plan or try again tomorrow.");
    }
    return true;
}

const getUsageStats = async (userId: string) => {
    const subscription = await getSubscription(userId);
    if (!subscription) {
        throw new Error("Subscription not found")
    }

    const remaningTaskToday = subscription.dailyTaskLimit - subscription.taskUsedToday;

    const stats = {
        tier: subscription.tier,
        status: subscription.status,
        taskUsedToday: subscription.taskUsedToday,
        remainingTaskToday: remaningTaskToday,
        dailyTaskLimit: subscription.dailyTaskLimit,
        resetTime: subscription.lastResetDate
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