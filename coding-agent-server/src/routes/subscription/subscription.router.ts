import { Router } from "express";
import { getSubscription, getUsageStats } from "../../modules/subscription/subscription.controller";
import { requireAuth } from "../../middleware/auth.middleware";


const subscriptionRouter = Router();

subscriptionRouter.get("/get-subscription", requireAuth, getSubscription)

subscriptionRouter.get("/get-usage-stats", requireAuth, getUsageStats);

export default subscriptionRouter