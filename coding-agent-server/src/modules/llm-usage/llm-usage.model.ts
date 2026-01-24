import mongoose, { Schema, Document } from "mongoose";

export interface ILLMUsage extends Document {
    userId: string;
    taskId?: string;
    useCase: string;
    modelId: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedCost: number;
    timestamp: Date;
}

const LLMUsageSchema = new Schema<ILLMUsage>({
    userId: {
        type: String,
        required: true,
        index: true
    },
    taskId: {
        type: String,
        index: true
    },
    useCase: {
        type: String,
        required: true,
        enum: ["REPO_UNDERSTANDING", "PLAN_GENERATION", "PR_REVIEW", "CODE_GENERATION"],
        index: true
    },
    modelId: {
        type: String,
        required: true,
        index: true
    },
    inputTokens: {
        type: Number,
        required: true,
        default: 0
    },
    outputTokens: {
        type: Number,
        required: true,
        default: 0
    },
    totalTokens: {
        type: Number,
        required: true,
        default: 0
    },
    estimatedCost: {
        type: Number,
        required: true,
        default: 0
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

LLMUsageSchema.index({ userId: 1, timestamp: -1 });
LLMUsageSchema.index({ modelId: 1, useCase: 1 });

export const LLMUsage = mongoose.model<ILLMUsage>("LLMUsage", LLMUsageSchema);
