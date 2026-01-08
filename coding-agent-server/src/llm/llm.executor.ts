import genAI from "./llm.client";
import { LLMResult } from "./llm.types";


interface ExecuteLLMINput {
    prompt: string;
    model: string;
}

export async function executeLLM({
    prompt,
    model
}: ExecuteLLMINput): Promise<LLMResult> {
    try {
        const llmModel = genAI.getGenerativeModel({ model });

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
            model,
        };
    } catch (error) {
        console.error("LLM execution failed", error);
        throw new Error("LLM execution failed");
    }
}