export interface LogUsageInput {
    userId: string;
    taskId?: string;
    useCase: string;
    modelId: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
}

export interface UsageSummary {
    totalTokens: number;
    totalCost: number;
    requestCount: number;
}

export interface UsageByModel {
    modelId: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    totalCost: number;
    requestCount: number;
}

export interface UsageByUseCase {
    useCase: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    totalCost: number;
    requestCount: number;
}
