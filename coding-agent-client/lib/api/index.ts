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

export const generatePlan = async (taskId: string) => {
    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/v1/tasks/generate-plan/${taskId}`;
    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders()
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


