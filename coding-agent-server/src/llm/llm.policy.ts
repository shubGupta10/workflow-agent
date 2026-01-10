export type LLMUseCase =
    | "REPO_UNDERSTANDING"
    | "PLAN_GENERATION"
    | "PR_REVIEW"
    | "CODE_GENERATION";

export const LLM_POLICY: Record<
    LLMUseCase,
    {
        model: string;
        maxOutputTokens: number;
        temperature: number;
    }
> = {
    REPO_UNDERSTANDING: {
        model: "gemini-2.5-flash",
        maxOutputTokens: 1024,
        temperature: 0.1,
    },

    PLAN_GENERATION: {
        model: "gemini-2.5-flash-lite",
        maxOutputTokens: 2048,
        temperature: 0.2,
    },

    PR_REVIEW: {
        model: "gemini-2.5-flash",
        maxOutputTokens: 4096,
        temperature: 0.1,
    },

    CODE_GENERATION: {
        model: "gemini-2.5-flash-lite",
        maxOutputTokens: 8192,
        temperature: 0.3,
    },
};
