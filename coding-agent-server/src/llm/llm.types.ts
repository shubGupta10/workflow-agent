export interface LLMUsage {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
}

export interface LLMResult {
    text: string;
    usage?: LLMUsage;
    model: string;
}