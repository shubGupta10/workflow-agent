import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";
import { subscriptionService } from "../modules/subscription/subscription.service";

export const checkUsageLimit = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.userId;

        await subscriptionService.checkAndResetIfNeeded(userId);

        await subscriptionService.checkLimit(userId);

        next();
    } catch (error: any) {
        return res.status(429).json({
            message: error.message || "Daily limit exceeded",
            error: "USAGE_LIMIT_EXCEEDED"
        });
    }
}