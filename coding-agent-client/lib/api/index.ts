import { getToken } from '../auth';

const appURl = process.env.NEXT_PUBLIC_BACKEND_URL;

if (process.env.NODE_ENV === 'development') {
    console.log('[API] Backend URL:', appURl || 'NOT SET');
}

const getHeaders = () => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    };

    const token = getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
};

export const createTask = async (repoUrl: string, userId: string) => {
    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/v1/tasks/create-task`;

    const response = await fetch(url, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            repoUrl,
            userId
        })
    });

    if (!response.ok) {
        // Handle 429 (quota exceeded) specially
        if (response.status === 429) {
            try {
                const errorData = await response.json();
                const error: any = new Error(errorData.message || 'Daily limit exceeded');
                error.status = 429;
                error.quotaError = errorData;
                throw error;
            } catch (parseError) {
                // If JSON parsing fails, throw generic error
                const error: any = new Error('Daily limit exceeded');
                error.status = 429;
                throw error;
            }
        }

        const errorText = await response.text();
        console.error('[API] Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
};

export const setTask = async (taskId: string, action: string, userInput: string) => {
    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/v1/tasks/set-action`;
    const response = await fetch(url, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            taskId,
            action,
            userInput
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] setTask error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('[API] setTask response:', data);
    return data;
};

export const generatePlanStream = async (taskId: string, modelId?: string) => {
    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/v1/tasks/generate-plan/${taskId}`;
    const response = await fetch(url, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ modelId })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] generatePlanStream error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response;
};

export const generatePlan = async (taskId: string, modelId?: string) => {
    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/v1/tasks/generate-plan/${taskId}`;
    const response = await fetch(url, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ modelId })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] generatePlan error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('[API] generatePlan response:', data);
    return data;
};

export const approvePlan = async (taskId: string, approvedBy: string) => {
    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/v1/tasks/approve-plan`;
    const response = await fetch(url, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            taskId,
            approvedBy
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] approvePlan error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('[API] approvePlan response:', data);
    return data;
};

export const executeTask = async (taskId: string) => {
    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/v1/tasks/execute/${taskId}`;
    const response = await fetch(url, {
        method: "POST",
        headers: getHeaders()
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] executeTask error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('[API] executeTask response:', data);
    return data;
};


export const getMe = async () => {
    const token = getToken();

    if (!token) {
        throw new Error("No token found");
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const res = await fetch(
        `${backendUrl}/api/auth/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) {
        const text = await res.text();
        throw new Error("Not authenticated");
    }

    const data = await res.json();

    const user = data.user || data;

    return user;
};

export const getSidebarTasks = async () => {
    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/v1/tasks/sidebar`;

    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] getSidebarTasks error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
};

export const deleteTask = async (taskId: string) => {
    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/v1/tasks/${taskId}`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: getHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] deleteTask error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
};

export const getTaskDetails = async (taskId: string) => {
    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/v1/tasks/details/${taskId}`;

    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] getTaskDetails error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
};

export const getLLMUsage = async () => {
    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/auth/llm-usage`;

    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] getLLMUsage error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
};

export interface AvailableModel {
    id: string;
    name: string;
    description: string;
}

export interface ModelsResponse {
    message: string;
    data: {
        models: AvailableModel[];
        defaultModelId: string;
    };
}

export const getAvailableModels = async (): Promise<ModelsResponse> => {
    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/v1/llm/models`;

    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] getAvailableModels error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
};

export interface UsageSummary {
    totalTokens: number;
    totalCost: number;
    requestCount: number;
}

export interface UsageByModel {
    modelId: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    totalCost: number;
    requestCount: number;
}

export interface UsageByUseCase {
    useCase: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    totalCost: number;
    requestCount: number;
}

export const getLLMUsageSummary = async (startDate?: string, endDate?: string) => {
    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const url = `${appURl}/api/v1/llm-usage/summary${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] getLLMUsageSummary error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
};

export const getLLMUsageByModel = async (startDate?: string, endDate?: string) => {
    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const url = `${appURl}/api/v1/llm-usage/by-model${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] getLLMUsageByModel error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
};

export const getLLMUsageByUseCase = async (startDate?: string, endDate?: string) => {
    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const url = `${appURl}/api/v1/llm-usage/by-usecase${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] getLLMUsageByUseCase error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
};
