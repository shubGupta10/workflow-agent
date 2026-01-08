import { executeLLM } from "./llm.executor";
import { LLMResult } from "./llm.types";

export function understandRepo(prompt: string): Promise<LLMResult> {
    return executeLLM({
        prompt,
        model: "gemini-2.5-flash-lite",
    });
}

export function generatePlanLLM(prompt: string): Promise<LLMResult> {
    return executeLLM({
        prompt,
        model: "gemini-2.5-flash-lite",
    });
}

export function reviewPullRequest(prompt: string): Promise<LLMResult> {
    return executeLLM({
        prompt,
        model: "gemini-2.5-flash-lite",
    });
}