export interface ModelConfig {
    id: string;
    name: string;
    description: string;
    maxOutputTokens: number;
    temperature: number;
}

export const AvailableModels: ModelConfig[] = [
    {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        description: "Fast and intelligent - production ready",
        maxOutputTokens: 8192,
        temperature: 0.1,
    },
    {
        id: "gemini-2.5-pro",
        name: "Gemini 2.5 Pro",
        description: "Most capable - 1M token context",
        maxOutputTokens: 8192,
        temperature: 0.1,
    },
    {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
        description: "Cost efficient and fast",
        maxOutputTokens: 8192,
        temperature: 0.1,
    },
    {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        description: "High capability model",
        maxOutputTokens: 8192,
        temperature: 0.1,
    },
];

export const DEFAULT_MODEL_ID = "gemini-2.5-flash";

export type LLMUseCase = "REPO_UNDERSTANDING" | "PLAN_GENERATION" | "PR_REVIEW" | "CODE_GENERATION";

export const UseCaseConfig: Record<LLMUseCase, { maxInputTokens: number }> = {
    REPO_UNDERSTANDING: { maxInputTokens: 50000 },
    PLAN_GENERATION: { maxInputTokens: 50000 },
    PR_REVIEW: { maxInputTokens: 30000 },
    CODE_GENERATION: { maxInputTokens: 100000 },
};

export function getModelById(modelId: string): ModelConfig | undefined {
    return AvailableModels.find(m => m.id === modelId);
}

export function isValidModelId(modelId: string): boolean {
    return AvailableModels.some(m => m.id === modelId);
}

export function getDefaultModel(): ModelConfig {
    const model = getModelById(DEFAULT_MODEL_ID);
    if (!model) {
        throw new Error(`Default model ${DEFAULT_MODEL_ID} not found in AvailableModels`);
    }
    return model;
}