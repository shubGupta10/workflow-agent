import genAI from "./llm.client";
import { LLMResult, LLMUsage } from "./llm.types";
import { LLMUseCase, UseCaseConfig, getModelById, getDefaultModel } from "./llm.config";
import crypto from "crypto";
import redis, { CACHE_TTL_SECONDS } from "../lib/redis";


interface ExecuteLLMInput {
    prompt: string;
    useCase: LLMUseCase;
    modelId?: string;
}

export async function executeLLM({
    prompt,
    useCase,
    modelId,
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
            return JSON.parse(cachedResponse);
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

        return usage;
    } catch (error) {
        console.error("LLM execution failed", error);
        throw new Error("LLM execution failed");
    }
}