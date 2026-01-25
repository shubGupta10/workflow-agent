import mongoose from "mongoose";
import { SubscriptionStatus, SubscriptionTier } from "./subscription.enum";

export interface ISubscription extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    tier: SubscriptionTier;
    status: SubscriptionStatus;
    taskUsedToday: number;
    dailyTaskLimit: number;
    lastResetDate: Date;
}