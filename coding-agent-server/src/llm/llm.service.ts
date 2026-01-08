import { executeLLM } from "./llm.executor";
import { LLMResult } from "./llm.types";

export function understandRepo(prompt: string): Promise<LLMResult> {
    return executeLLM({
        prompt,
        useCase: "REPO_UNDERSTANDING",
    });
}

export function generatePlanLLM(prompt: string): Promise<LLMResult> {
    return executeLLM({
        prompt,
        useCase: "PLAN_GENERATION",
    });
}

export function reviewPullRequest(prompt: string): Promise<LLMResult> {
    return executeLLM({
        prompt,
        useCase: "PR_REVIEW",
    });
}