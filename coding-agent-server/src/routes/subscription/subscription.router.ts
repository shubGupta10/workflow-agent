import { Router } from "express";
import { getSubscription, getUsageStats } from "../../modules/subscription/subscription.controller";


const subscriptionRouter = Router();

subscriptionRouter.get("/get-subscription", getSubscription)

subscriptionRouter.get("/get-usage-stats", getUsageStats);

export default subscriptionRouter