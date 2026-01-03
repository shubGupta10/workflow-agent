import { getToken } from '../auth';

const appURl = process.env.NEXT_PUBLIC_BACKEND_URL;

if (process.env.NODE_ENV === 'development') {
    console.log('[API] Backend URL:', appURl || 'NOT SET');
}

/**
 * Get common headers including authorization if token exists
 */
const getHeaders = () => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    };

    const token = getToken();
    console.log('[getHeaders] Token:', token ? "EXISTS" : "MISSING");
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        console.log('[getHeaders] Authorization header added');
    }

    return headers;
};

export const createTask = async (repoUrl: string, userId: string) => {
    console.log('[API] createTask called with:', { repoUrl, userId, backendUrl: appURl });

    if (!appURl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appURl}/api/v1/tasks/create-task`;
    console.log('[API] Fetching:', url);

    const response = await fetch(url, {
        method: "POST",
        headers: getHeaders(),
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
        headers: getHeaders(),
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
        headers: getHeaders()
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
        headers: getHeaders(),
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
        headers: getHeaders()
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


export const getMe = async () => {
  const token = getToken();
  console.log("[getMe] Token:", token ? "EXISTS" : "MISSING");
  

  if (!token) {
    throw new Error("No token found");
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  console.log("[getMe] Fetching from:", `${backendUrl}/api/auth/me`);

  const res = await fetch(
    `${backendUrl}/api/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("[getMe] Response status:", res.status);

  if (!res.ok) {
    const text = await res.text();
    console.error("[getMe] Error response:", text);
    throw new Error("Not authenticated");
  }

  const data = await res.json();
  console.log("[getMe] Response data:", data);
  
  // Backend returns {success: true, user: {...}}, extract just the user
  const user = data.user || data;
  console.log("[getMe] Extracted user:", user);
  
  return user;
};
