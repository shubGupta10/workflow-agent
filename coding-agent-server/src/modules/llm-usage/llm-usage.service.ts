import { LLMUsage } from "./llm-usage.model";
import { LogUsageInput, UsageSummary, UsageByModel, UsageByUseCase } from "./llm-usage.types";
import { calculateCost } from "./llm-usage.utils";

const logUsage = async (input: LogUsageInput) => {
    const { userId, taskId, useCase, modelId, inputTokens, outputTokens, totalTokens } = input;

    const estimatedCost = calculateCost(modelId, inputTokens, outputTokens);

    const usage = await LLMUsage.create({
        userId,
        taskId,
        useCase,
        modelId,
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCost,
        timestamp: new Date()
    });

    return usage;
};

const getUserSummary = async (userId: string, startDate?: Date, endDate?: Date): Promise<UsageSummary> => {
    const match: any = { userId };

    if (startDate || endDate) {
        match.timestamp = {};
        if (startDate) match.timestamp.$gte = startDate;
        if (endDate) match.timestamp.$lte = endDate;
    }

    const result = await LLMUsage.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                totalTokens: { $sum: "$totalTokens" },
                totalCost: { $sum: "$estimatedCost" },
                requestCount: { $sum: 1 }
            }
        }
    ]);

    if (result.length === 0) {
        return { totalTokens: 0, totalCost: 0, requestCount: 0 };
    }

    return {
        totalTokens: result[0].totalTokens,
        totalCost: result[0].totalCost,
        requestCount: result[0].requestCount
    };
};

const getUsageByModel = async (userId: string, startDate?: Date, endDate?: Date): Promise<UsageByModel[]> => {
    const match: any = { userId };

    if (startDate || endDate) {
        match.timestamp = {};
        if (startDate) match.timestamp.$gte = startDate;
        if (endDate) match.timestamp.$lte = endDate;
    }

    const result = await LLMUsage.aggregate([
        { $match: match },
        {
            $group: {
                _id: "$modelId",
                inputTokens: { $sum: "$inputTokens" },
                outputTokens: { $sum: "$outputTokens" },
                totalTokens: { $sum: "$totalTokens" },
                totalCost: { $sum: "$estimatedCost" },
                requestCount: { $sum: 1 }
            }
        },
        { $sort: { totalTokens: -1 } }
    ]);

    return result.map(r => ({
        modelId: r._id,
        inputTokens: r.inputTokens,
        outputTokens: r.outputTokens,
        totalTokens: r.totalTokens,
        totalCost: r.totalCost,
        requestCount: r.requestCount
    }));
};

const getUsageByUseCase = async (userId: string, startDate?: Date, endDate?: Date): Promise<UsageByUseCase[]> => {
    const match: any = { userId };

    if (startDate || endDate) {
        match.timestamp = {};
        if (startDate) match.timestamp.$gte = startDate;
        if (endDate) match.timestamp.$lte = endDate;
    }

    const result = await LLMUsage.aggregate([
        { $match: match },
        {
            $group: {
                _id: "$useCase",
                inputTokens: { $sum: "$inputTokens" },
                outputTokens: { $sum: "$outputTokens" },
                totalTokens: { $sum: "$totalTokens" },
                totalCost: { $sum: "$estimatedCost" },
                requestCount: { $sum: 1 }
            }
        },
        { $sort: { totalTokens: -1 } }
    ]);

    return result.map(r => ({
        useCase: r._id,
        inputTokens: r.inputTokens,
        outputTokens: r.outputTokens,
        totalTokens: r.totalTokens,
        totalCost: r.totalCost,
        requestCount: r.requestCount
    }));
};

export const LLMUsageService = {
    logUsage,
    getUserSummary,
    getUsageByModel,
    getUsageByUseCase
};
