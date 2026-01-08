import genAI from "./llm.client";
import { LLMResult } from "./llm.types";
import { LLM_POLICY, LLMUseCase } from "./llm.policy";


interface ExecuteLLMINput {
    prompt: string;
    useCase: LLMUseCase;
}

export async function executeLLM({
    prompt,
    useCase,
}: ExecuteLLMINput): Promise<LLMResult> {
    const policy = LLM_POLICY[useCase];

    if (!policy) {
        throw new Error(`No LLM policy defined for use case: ${useCase}`);
    }
    try {
        const llmModel = genAI.getGenerativeModel({
            model: policy.model,
            generationConfig: {
                maxOutputTokens: policy.maxOutputTokens,
                temperature: policy.temperature,
            },
        });

        const result = await llmModel.generateContent(prompt);
        const response = result.response;

        return {
            text: response.text(),
            usage: response.usageMetadata ? {
                inputTokens: response.usageMetadata.promptTokenCount,
                outputTokens: response.usageMetadata.candidatesTokenCount,
                totalTokens: response.usageMetadata.totalTokenCount
            }
                : undefined,
            model: policy.model,
        };
    } catch (error) {
        console.error("LLM execution failed", error);
        throw new Error("LLM execution failed");
    }
}