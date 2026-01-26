import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";
import { subscriptionService } from "../modules/subscription/subscription.service";

export const checkUsageLimit = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
    try {
        await subscriptionService.checkAndResetIfNeeded(userId);
        await subscriptionService.checkLimit(userId);

        next();
    } catch (error: any) {
        const subscription = await subscriptionService.getSubscription(userId).catch(() => null);

        return res.status(429).json({
            message: error.message || "Daily limit exceeded",
            error: "USAGE_LIMIT_EXCEEDED",
            ...(subscription && {
                quota: {
                    used: subscription.taskUsedToday,
                    limit: subscription.dailyTaskLimit,
                    tier: subscription.tier,
                    resetTime: subscription.lastResetDate
                }
            })
        });
    }
}