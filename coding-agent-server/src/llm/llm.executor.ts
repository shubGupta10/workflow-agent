import genAI from "./llm.client";
import { LLMResult, LLMUsage } from "./llm.types";
import { LLMUseCase, UseCaseConfig, getModelById, getDefaultModel } from "./llm.config";
import crypto from "crypto";
import redis, { CACHE_TTL_SECONDS } from "../lib/redis";
import { LLMUsageService } from "../modules/llm-usage/llm-usage.service";


interface ExecuteLLMInput {
    prompt: string;
    useCase: LLMUseCase;
    modelId?: string;
    userId?: string;
    taskId?: string;
}

export async function executeLLM({
    prompt,
    useCase,
    modelId,
    userId,
    taskId,
}: ExecuteLLMInput): Promise<LLMResult> {
    const useCaseConfig = UseCaseConfig[useCase];

    if (!useCaseConfig) {
        throw new Error(`No configuration defined for use case: ${useCase}`);
    }

    // Get model config - use provided modelId or default
    const modelConfig = modelId ? getModelById(modelId) : getDefaultModel();
    if (!modelConfig) {
        throw new Error(`Invalid model ID: ${modelId}`);
    }

    if (useCaseConfig.maxInputTokens) {
        const estimatedTokens = Math.ceil(prompt.length / 4);
        if (estimatedTokens > useCaseConfig.maxInputTokens) {
            throw new Error(
                `Prompt too large for ${useCase}: ~${estimatedTokens} tokens exceeds the safety limit of ${useCaseConfig.maxInputTokens}.`
            );
        }
    }

    //caching
    const promptHash = crypto.createHash("sha256").update(prompt).digest("hex");
    const cacheKey = `llm:${useCase}:${modelConfig.id}:${promptHash}`

    try {
        const cachedResponse = await redis.get(cacheKey);
        if (cachedResponse) {
            console.log(`[LLM CACHE HIT] for use case: ${useCase}, model: ${modelConfig.id}`);
            const parsed = JSON.parse(cachedResponse);
            if (!parsed.text || parsed.text.trim() === '') {
                console.warn('[LLM CACHE] Cached response has empty text, invalidating cache');
                await redis.del(cacheKey);
            } else {
                console.log(`[LLM CACHE] Returning cached response with ${parsed.text.length} characters`);
                return parsed;
            }
        }
    } catch (error) {
        console.warn("[LLM CACHE READ ERROR]", error);
    }

    try {
        const llmModel = genAI.getGenerativeModel({
            model: modelConfig.id,
            generationConfig: {
                maxOutputTokens: modelConfig.maxOutputTokens,
                temperature: modelConfig.temperature,
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
            model: modelConfig.id,
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

        if (userId && LLMResult.usage) {
            try {
                await LLMUsageService.logUsage({
                    userId,
                    taskId,
                    useCase,
                    modelId: modelConfig.id,
                    inputTokens: LLMResult.usage.inputTokens,
                    outputTokens: LLMResult.usage.outputTokens,
                    totalTokens: LLMResult.usage.totalTokens
                });
            } catch (usageLogError) {
                console.warn("[LLM USAGE LOG ERROR]", usageLogError);
            }
        }

        return LLMResult;
    } catch (error) {
        console.error("LLM execution failed", error);
        throw new Error("LLM execution failed");
    }
}

export async function* executeLLMStream({
    prompt,
    useCase,
    modelId,
    userId,
    taskId,
}: ExecuteLLMInput): AsyncGenerator<string, LLMUsage & { model: string }, unknown> {
    const useCaseConfig = UseCaseConfig[useCase];

    if (!useCaseConfig) {
        throw new Error(`No configuration defined for use case: ${useCase}`);
    }

    // Get model config - use provided modelId or default
    const modelConfig = modelId ? getModelById(modelId) : getDefaultModel();
    if (!modelConfig) {
        throw new Error(`Invalid model ID: ${modelId}`);
    }

    if (useCaseConfig.maxInputTokens) {
        const estimatedTokens = Math.ceil(prompt.length / 4);
        if (estimatedTokens > useCaseConfig.maxInputTokens) {
            throw new Error(
                `Prompt too large for ${useCase}: ~${estimatedTokens} tokens exceeds the safety limit of ${useCaseConfig.maxInputTokens}.`
            );
        }
    }

    try {
        const llmModel = genAI.getGenerativeModel({
            model: modelConfig.id,
            generationConfig: {
                maxOutputTokens: modelConfig.maxOutputTokens,
                temperature: modelConfig.temperature,
            }
        })

        console.log(`[LLM STREAM] Using model: ${modelConfig.id} for ${useCase}`);

        const result = await llmModel.generateContentStream(prompt);

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            yield chunkText;
        }

        const response = await result.response;

        const usage: LLMUsage & { model: string } = {
            inputTokens: response.usageMetadata?.promptTokenCount,
            outputTokens: response.usageMetadata?.candidatesTokenCount,
            totalTokens: response.usageMetadata?.totalTokenCount,
            model: modelConfig.id,
        };

        if (userId && usage.inputTokens && usage.outputTokens && usage.totalTokens) {
            try {
                await LLMUsageService.logUsage({
                    userId,
                    taskId,
                    useCase,
                    modelId: modelConfig.id,
                    inputTokens: usage.inputTokens,
                    outputTokens: usage.outputTokens,
                    totalTokens: usage.totalTokens
                });
            } catch (usageLogError) {
                console.warn("[LLM USAGE LOG ERROR]", usageLogError);
            }
        }

        return usage;
    } catch (error) {
        console.error("LLM execution failed", error);
        throw new Error("LLM execution failed");
    }
}