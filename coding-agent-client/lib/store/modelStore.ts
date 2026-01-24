import { create } from 'zustand';
import { getAvailableModels, AvailableModel } from '@/lib/api';

interface ModelStore {
    // State
    availableModels: AvailableModel[];
    selectedModelId: string | null;
    defaultModelId: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchModels: () => Promise<void>;
    setSelectedModel: (modelId: string) => void;
    getSelectedModel: () => AvailableModel | undefined;
}

export const useModelStore = create<ModelStore>((set, get) => ({
    availableModels: [],
    selectedModelId: null,
    defaultModelId: null,
    isLoading: false,
    error: null,

    fetchModels: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getAvailableModels();
            const { models, defaultModelId } = response.data;

            set({
                availableModels: models,
                defaultModelId,
                // Set selected to default if not already set
                selectedModelId: get().selectedModelId || defaultModelId,
                isLoading: false,
            });
        } catch (error) {
            console.error('[ModelStore] Failed to fetch models:', error);
            set({
                error: error instanceof Error ? error.message : 'Failed to load models',
                isLoading: false,
            });
        }
    },

    setSelectedModel: (modelId: string) => {
        const models = get().availableModels;
        const isValid = models.some(m => m.id === modelId);
        if (isValid) {
            set({ selectedModelId: modelId });
        } else {
            console.warn(`[ModelStore] Invalid model ID: ${modelId}`);
        }
    },

    getSelectedModel: () => {
        const { availableModels, selectedModelId } = get();
        return availableModels.find(m => m.id === selectedModelId);
    },
}));
