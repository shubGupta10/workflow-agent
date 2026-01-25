import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { errorWrapper } from "../../middleware/errorWrapper";
import { subscriptionService } from "./subscription.service";

const getSubscription = errorWrapper(
    async (req: AuthRequest, res: Response) => {
        const userId = req.user.userId;

        const subscription = await subscriptionService.getSubscription(userId);

        return res.status(200).json({
            message: "Subscription fetched successfully",
            data: subscription
        })
    }
)

const getUsageStats = errorWrapper(
    async (req: AuthRequest, res: Response) => {
        const userId = req.user.userId;

        const stats = await subscriptionService.getUsageStats(userId);

        return res.status(200).json({
            message: "Usage stats fetched successfully",
            data: stats
        })
    }
)

export {
    getSubscription,
    getUsageStats
}