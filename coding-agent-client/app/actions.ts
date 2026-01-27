'use client';

import { createTask, setTask, generatePlan, approvePlan, executeTask } from "@/lib/api";

export async function createTaskAction(repoUrl: string, userId: string, action?: string, userInput?: string) {
    try {
        if (!userId) {
            return { success: false, error: "User not authenticated" };
        }
        const result = await createTask(repoUrl, userId, action, userInput);
        return { success: true, data: result };
    } catch (error: any) {
        if (error?.status !== 429) {
            console.error("createTaskAction error:", error);
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create task",
            status: error?.status
        };
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

export async function approvePlanAction(taskId: string, userId: string) {
    try {
        if (!userId) {
            return { success: false, error: "User not authenticated" };
        }
        const result = await approvePlan(taskId, userId);
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
