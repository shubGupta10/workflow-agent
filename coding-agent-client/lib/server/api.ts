const appURl = process.env.BACKEND_URL;

if (process.env.NODE_ENV === 'development') {
    console.log('[API] Backend URL:', appURl || 'NOT SET');
}

export const createTask = async (repoUrl: string, userId: string) => {
    console.log('[API] createTask called with:', { repoUrl, userId, backendUrl: appURl });

    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/v1/tasks/create-task`;
    console.log('[API] Fetching:', url);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            repoUrl,
            userId
        })
    });

    console.log('[API] Response status:', response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('[API] Response data:', data);
    return data;
}

export const setTask = async (taskId: string, action: string, userInput: string) => {
    console.log('[API] setTask called with:', { taskId, action, userInput });

    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/v1/tasks/set-action`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            taskId,
            action,
            userInput
        })
    });

    console.log('[API] setTask response status:', response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] setTask error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('[API] setTask response:', data);
    return data;
}

export const generatePlan = async (taskId: string) => {
    console.log('[API] generatePlan called with taskId:', taskId);

    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/v1/tasks/generate-plan/${taskId}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    console.log('[API] generatePlan response status:', response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] generatePlan error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('[API] generatePlan response:', data);
    return data;
}

export const approvePlan = async (taskId: string, approvedBy: string) => {
    console.log('[API] approvePlan called with:', { taskId, approvedBy });

    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/v1/tasks/approve-plan`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            taskId,
            approvedBy
        })
    });

    console.log('[API] approvePlan response status:', response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] approvePlan error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('[API] approvePlan response:', data);
    return data;
}

export const executeTask = async (taskId: string) => {
    console.log('[API] executeTask called with taskId:', taskId);

    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/v1/tasks/execute/${taskId}`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    console.log('[API] executeTask response status:', response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] executeTask error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('[API] executeTask response:', data);
    return data;
}