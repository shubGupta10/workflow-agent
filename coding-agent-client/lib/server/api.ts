const appURl = process.env.BACKEND_URL;

export const createTask = async (repoUrl: string, userId: string) => {
    const response = await fetch(`${appURl}/api/v1/tasks/create-task`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            repoUrl,
            userId
        })
    })

    const data = await response.json();
    return data;
}

export const setTask = async (taskId: string, action: string, userInput: string) => {
    const response = await fetch(`${appURl}/api/v1/tasks/set-action`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            taskId,
            action,
            userInput
        })
    })
    const data = await response.json();
    return data;
}

export const generatePlan = async (taskId: string) => {
    const response = await fetch(`${appURl}/api/v1/tasks/generate-plan/${taskId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.json();
    return data;
}

export const approvePlan = async (taskId: string, approvedBy: string) => {
    const response = await fetch(`${appURl}/api/v1/tasks/approve-plan`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            taskId,
            approvedBy
        })
    })
    const data = await response.json();
    return data
}

export const executeTask = async (taskId: string) => {
    const response = await fetch(`${appURl}/api/v1/tasks/execute/${taskId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.json();
    return data;
}