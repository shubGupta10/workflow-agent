export type TaskStatus =
    | "AWAITING_REPO"
    | "AWAITING_ACTION"
    | "AWAITING_INPUT"
    | "PLANNING"
    | "AWAITING_APPROVAL"
    | "EXECUTING"
    | "COMPLETED"
    | "REVIEW_COMPLETE"
    | "ERROR";

export type ActionType = "REVIEW_PR" | "FIX_ISSUE" | "PLAN_CHANGE";

export interface Task {
    id: string;
    repoUrl: string;
    status: TaskStatus;
    action?: ActionType;
    userInput?: string;
    plan?: string;
    result?: string;
    prUrl?: string;
    error?: string;
}

export type MessageType = "user" | "system" | "loading";

export interface Message {
    id: string;
    type: MessageType;
    content: string;
    timestamp: Date;
    systemType?: "action-selection" | "input-prompt" | "plan-display" | "approval" | "completion" | "review" | "error";
    metadata?: Record<string, unknown>;
}

export interface Session {
    id: string;
    taskId?: string;
    title: string;
    status: TaskStatus;
    messages: Message[];
    createdAt: Date;
    selectedAction?: ActionType; // Store the selected action
}

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
    AWAITING_REPO: "New",
    AWAITING_ACTION: "Select Action",
    AWAITING_INPUT: "Input Required",
    PLANNING: "Planning...",
    AWAITING_APPROVAL: "Review Plan",
    EXECUTING: "Executing...",
    COMPLETED: "Completed",
    REVIEW_COMPLETE: "Review Done",
    ERROR: "Error",
};

export const ACTION_LABELS: Record<ActionType, string> = {
    REVIEW_PR: "Review PR",
    FIX_ISSUE: "Fix an Issue",
    PLAN_CHANGE: "Plan a Change",
};
