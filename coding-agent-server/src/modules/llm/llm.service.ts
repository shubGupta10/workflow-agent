import { AvailableModels, DEFAULT_MODEL_ID } from "../../llm/llm.config";

const getModels = () => {
    const models = AvailableModels.map(m => ({
        id: m.id,
        name: m.name,
        description: m.description
    }));

    return {
        models,
        defaultModelId: DEFAULT_MODEL_ID
    };
};

export const LLMService = {
    getModels
};
