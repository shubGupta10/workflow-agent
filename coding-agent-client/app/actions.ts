"use server";

import { createTask, setTask, generatePlan, approvePlan, executeTask } from "@/lib/server/api";

// HARDCODED: Demo user ID - replace with actual auth when implemented
const DEMO_USER_ID = "demo-user-001";

export async function createTaskAction(repoUrl: string) {
    try {
        // HARDCODED: Using demo user ID
        const result = await createTask(repoUrl, DEMO_USER_ID);
        return { success: true, data: result };
    } catch (error) {
        console.error("createTaskAction error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to create task" };
    }
}

export async function setTaskAction(taskId: string, action: string, userInput: string) {
    try {
        const result = await setTask(taskId, action, userInput);
        return { success: true, data: result };
    } catch (error) {
        console.error("setTaskAction error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to set task action" };
    }
}

export async function generatePlanAction(taskId: string) {
    try {
        const result = await generatePlan(taskId);
        return { success: true, data: result };
    } catch (error) {
        console.error("generatePlanAction error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to generate plan" };
    }
}

export async function approvePlanAction(taskId: string) {
    try {
        // HARDCODED: Using demo user ID for approval
        const result = await approvePlan(taskId, DEMO_USER_ID);
        return { success: true, data: result };
    } catch (error) {
        console.error("approvePlanAction error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to approve plan" };
    }
}

export async function executeTaskAction(taskId: string) {
    try {
        const result = await executeTask(taskId);
        return { success: true, data: result };
    } catch (error) {
        console.error("executeTaskAction error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to execute task" };
    }
}
