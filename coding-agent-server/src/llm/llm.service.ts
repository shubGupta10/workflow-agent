import { executeLLM, executeLLMStream } from "./llm.executor";
import { LLMResult } from "./llm.types";

export function understandRepo(prompt: string, modelId?: string, userId?: string, taskId?: string): Promise<LLMResult> {
    return executeLLM({
        prompt,
        useCase: "REPO_UNDERSTANDING",
        modelId,
        userId,
        taskId,
    });
}

export function generatePlanLLM(prompt: string, modelId?: string, userId?: string, taskId?: string): Promise<LLMResult> {
    return executeLLM({
        prompt,
        useCase: "PLAN_GENERATION",
        modelId,
        userId,
        taskId,
    });
}

export function generatePlanLLMStream(prompt: string, modelId?: string, userId?: string, taskId?: string) {
    return executeLLMStream({
        prompt,
        useCase: "PLAN_GENERATION",
        modelId,
        userId,
        taskId,
    });
}

export function reviewPullRequest(prompt: string, modelId?: string, userId?: string, taskId?: string): Promise<LLMResult> {
    return executeLLM({
        prompt,
        useCase: "PR_REVIEW",
        modelId,
        userId,
        taskId,
    });
}

export function generateCode(prompt: string, modelId?: string, userId?: string, taskId?: string): Promise<LLMResult> {
    return executeLLM({
        prompt,
        useCase: "CODE_GENERATION",
        modelId,
        userId,
        taskId,
    });
}