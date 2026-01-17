import genAI from "./llm.client";
import { LLMResult } from "./llm.types";
import { LLM_POLICY, LLMUseCase } from "./llm.policy";
import crypto from "crypto";
import redis, { CACHE_TTL_SECONDS } from "../lib/redis";


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

    if (policy.maxInputTokens) {
        const estimatedTokens = Math.ceil(prompt.length / 4);
        if (estimatedTokens > policy.maxInputTokens) {
            throw new Error(
                `Prompt too large for ${useCase}: ~${estimatedTokens} tokens exceeds the safety limit of ${policy.maxInputTokens}.`
            );
        }
    }

    //caching
    const promptHash = crypto.createHash("sha256").update(prompt).digest("hex");
    const cacheKey = `llm:${useCase}:${promptHash}`

    try {
        const cachedResponse = await redis.get(cacheKey);
        if (cachedResponse) {
            console.log(`[LLM CACHE HIT] for use case: ${useCase}`);
            return JSON.parse(cachedResponse);
        }
    } catch (error) {
        console.warn("[LLM CACHE READ ERROR]", error);
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
        const LLMResult = {
            text: response.text(),
            usage: response.usageMetadata ? {
                inputTokens: response.usageMetadata.promptTokenCount,
                outputTokens: response.usageMetadata.candidatesTokenCount,
                totalTokens: response.usageMetadata.totalTokenCount
            }
                : undefined,
            model: policy.model,
        }

        try {
            await redis.set(
                cacheKey,
                JSON.stringify(LLMResult),
                "EX",
                CACHE_TTL_SECONDS
            )
        } catch (cacheStoreError) {
            console.warn("[LLM CACHE WRITE ERROR]", cacheStoreError);
        }

        return LLMResult;
    } catch (error) {
        console.error("LLM execution failed", error);
        throw new Error("LLM execution failed");
    }
}