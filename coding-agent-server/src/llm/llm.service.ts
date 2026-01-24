import { executeLLM, executeLLMStream } from "./llm.executor";
import { LLMResult } from "./llm.types";

export function understandRepo(prompt: string, modelId?: string): Promise<LLMResult> {
    return executeLLM({
        prompt,
        useCase: "REPO_UNDERSTANDING",
        modelId,
    });
}

export function generatePlanLLM(prompt: string, modelId?: string): Promise<LLMResult> {
    return executeLLM({
        prompt,
        useCase: "PLAN_GENERATION",
        modelId,
    });
}

export function generatePlanLLMStream(prompt: string, modelId?: string) {
    return executeLLMStream({
        prompt,
        useCase: "PLAN_GENERATION",
        modelId,
    });
}

export function reviewPullRequest(prompt: string, modelId?: string): Promise<LLMResult> {
    return executeLLM({
        prompt,
        useCase: "PR_REVIEW",
        modelId,
    });
}

export function generateCode(prompt: string, modelId?: string): Promise<LLMResult> {
    return executeLLM({
        prompt,
        useCase: "CODE_GENERATION",
        modelId,
    });
}