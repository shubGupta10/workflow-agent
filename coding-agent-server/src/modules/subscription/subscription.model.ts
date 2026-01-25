import mongoose from "mongoose";
import { ISubscription } from "./subscription.interface";
import { SubscriptionTier, SubscriptionStatus } from "./subscription.enum";

const subscriptionSchema = new mongoose.Schema<ISubscription>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tier: {
        type: String,
        enum: Object.values(SubscriptionTier),
        default: SubscriptionTier.FREE
    },
    status: {
        type: String,
        enum: Object.values(SubscriptionStatus),
        default: SubscriptionStatus.ACTIVE
    },
    taskUsedToday: {
        type: Number,
        default: 0
    },
    dailyTaskLimit: {
        type: Number,
        default: 10
    },
    lastResetDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

export default mongoose.model<ISubscription>("Subscription", subscriptionSchema);