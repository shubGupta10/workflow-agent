const PRICING_PER_MILLION_TOKENS = {
    "gemini-2.5-flash": { input: 0.075, output: 0.30 },
    "gemini-2.5-pro": { input: 1.25, output: 5.00 },
    "gemini-1.5-flash": { input: 0.075, output: 0.30 },
    "gemini-1.5-pro": { input: 1.25, output: 5.00 },
};

export function calculateCost(modelId: string, inputTokens: number, outputTokens: number): number {
    const pricing = PRICING_PER_MILLION_TOKENS[modelId as keyof typeof PRICING_PER_MILLION_TOKENS];

    if (!pricing) {
        return 0;
    }

    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;

    return inputCost + outputCost;
}
