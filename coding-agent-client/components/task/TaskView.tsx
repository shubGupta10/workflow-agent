"use client";

import { useState, useEffect } from "react";
import { useTaskStore } from "@/lib/store/store";
import { useAuthStore } from "@/lib/store/userStore";
import { ActionType, Message } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "../chat/ChatMessage";
import { ChatInput } from "../chat/ChatInput";
import { TaskHistory } from "./TaskHistory";
import {
    ActionSelectionCard,
    PlanDisplayCard,
    ReviewDisplayCard,
    CompletionCard,
    ErrorCard,
} from "./SystemCard";
import { Sparkles } from "lucide-react";
import { getTaskDetails } from "@/lib/api";
import {
    createTaskAction,
    setTaskAction,
    generatePlanAction,
    approvePlanAction,
    executeTaskAction,
} from "@/app/actions";

interface TaskViewProps {
    onToggleSidebar?: () => void;
    isMobile?: boolean;
}

export function TaskView({ onToggleSidebar, isMobile = false }: TaskViewProps = {}) {
    const { user, fetchCurrentUser } = useAuthStore();
    const {
        sessions,
        activeSessionId,
        currentTaskId,
        createSession,
        setActiveSession,
        addMessage,
        updateSessionStatus,
        updateSession,
        getActiveSession,
        removeLastMessage,
        setCurrentTaskId,
        setTaskDetails,
        getTaskDetails: getCachedTaskDetails,
    } = useTaskStore();

    const [isLoading, setIsLoading] = useState(false);
    const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
    const [currentPlan, setCurrentPlan] = useState<string | null>(null);
    const [taskDetailsLoading, setTaskDetailsLoading] = useState(false);

    const activeSession = getActiveSession();

    // Fetch user data on mount
    useEffect(() => {
        if (!user) {
            fetchCurrentUser().catch(err => {
                console.error('[TaskView] Failed to fetch user:', err);
            });
        }
    }, []);

    useEffect(() => {
        if (sessions.length === 0) {
            createSession();
        }
    }, [sessions.length, createSession]);

    useEffect(() => {
        if (activeSession?.taskId && currentTaskId !== activeSession.taskId) {
            setCurrentTaskId(activeSession.taskId);
        }
    }, [activeSession?.taskId, currentTaskId, setCurrentTaskId]);

    // Fetch task details for any task with taskId
    useEffect(() => {
        if (!activeSession?.taskId) return;

        const cachedDetails = getCachedTaskDetails(activeSession.taskId);
        if (cachedDetails) {
            // Already cached, don't fetch again
            return;
        }

        const fetchDetails = async () => {
            setTaskDetailsLoading(true);
            try {
                const response = await getTaskDetails(activeSession.taskId!);
                const details = response.data;
                if (details) {
                    setTaskDetails(activeSession.taskId!, details);
                }
            } catch (error) {
                console.error('[TaskView] Failed to fetch task details:', error);
            } finally {
                setTaskDetailsLoading(false);
            }
        };

        fetchDetails();
    }, [activeSession?.taskId, getCachedTaskDetails, setTaskDetails]);

    // Re-show action selection or input prompt if user left at those states
    useEffect(() => {
        if (!activeSession) return;

        const lastMessage = activeSession.messages[activeSession.messages.length - 1];

        // If status is AWAITING_ACTION and last message is not action-selection, re-add it
        if (activeSession.status === "AWAITING_ACTION") {
            if (!lastMessage || lastMessage.systemType !== "action-selection") {
                addMessage(activeSession.id, {
                    type: "system",
                    content: "Repository analyzed successfully! What would you like to do?",
                    systemType: "action-selection"
                });
            }
        }

        // If status is AWAITING_INPUT and last message is not a prompt, re-add it
        if (activeSession.status === "AWAITING_INPUT" && activeSession.selectedAction) {
            if (!lastMessage || (lastMessage.type !== "system" && lastMessage.type !== "user")) {
                const promptMessage = activeSession.selectedAction === "REVIEW_PR"
                    ? "Please paste the PR URL you want me to review."
                    : "Please describe what you want me to do.";

                addMessage(activeSession.id, {
                    type: "system",
                    content: promptMessage
                });
            }
        }
    }, [activeSession?.status, activeSession?.id]);


    const getPlaceholder = (): string => {
        if (!activeSession) return "Paste GitHub repository URL…";

        switch (activeSession.status) {
            case "AWAITING_REPO":
                return "Paste GitHub repository URL…";
            case "AWAITING_INPUT":
                if (selectedAction === "REVIEW_PR" || activeSession.selectedAction === "REVIEW_PR") {
                    return "Paste the PR URL to review…";
                }
                return "Describe what you want to do…";
            case "EXECUTING":
            case "COMPLETED":
            case "REVIEW_COMPLETE":
                return "Task in progress…";
            default:
                return "Type a message…";
        }
    };

    const isInputDisabled = (): boolean => {
        if (!activeSession) return true;
        return (
            isLoading ||
            activeSession.status === "EXECUTING" ||
            activeSession.status === "COMPLETED" ||
            activeSession.status === "REVIEW_COMPLETE" ||
            activeSession.status === "AWAITING_ACTION" ||
            activeSession.status === "AWAITING_APPROVAL"
        );
    };

    const handleSubmit = async (input: string) => {
        if (!activeSession) return;

        addMessage(activeSession.id, { type: "user", content: input });

        // STEP 1: CREATE TASK (repo URL submission)
        if (activeSession.status === "AWAITING_REPO") {
            setIsLoading(true);
            addMessage(activeSession.id, { type: "loading", content: "Analyzing repository…" });

            if (!user?._id) {
                removeLastMessage(activeSession.id);
                addMessage(activeSession.id, { type: "system", content: "Please log in to continue", systemType: "error" });
                setIsLoading(false);
                return;
            }

            const result = await createTaskAction(input, user._id);
            removeLastMessage(activeSession.id);

            if (result.success && result.data) {
                const taskId = typeof result.data === 'string' ? result.data : (result.data.data || result.data.id || result.data.taskId);

                console.log('[TaskView] Task created, taskId:', taskId);

                setCurrentTaskId(taskId);

                updateSession(activeSession.id, {
                    taskId: taskId,
                    title: input.split("/").slice(-1)[0] || "Task"
                });
                updateSessionStatus(activeSession.id, "AWAITING_ACTION");
                addMessage(activeSession.id, {
                    type: "system",
                    content: "Repository analyzed successfully! What would you like to do?",
                    systemType: "action-selection"
                });
            } else {
                addMessage(activeSession.id, {
                    type: "system",
                    content: result.error || "Failed to analyze repository",
                    systemType: "error"
                });
            }
            setIsLoading(false);
        }
        // STEP 2 + 3: SET TASK ACTION + GENERATE PLAN (input submission after action selected)
        else if (activeSession.status === "AWAITING_INPUT") {
            setIsLoading(true);
            addMessage(activeSession.id, { type: "loading", content: "Processing your request…" });

            const taskId = currentTaskId || activeSession.taskId;
            const action = selectedAction || activeSession.selectedAction;

            console.log('[TaskView] AWAITING_INPUT - taskId sources:', {
                zustandTaskId: currentTaskId,
                sessionTaskId: activeSession.taskId,
                finalTaskId: taskId,
                action,
                sessionId: activeSession.id
            });

            if (!taskId || !action) {
                removeLastMessage(activeSession.id);
                addMessage(activeSession.id, {
                    type: "system",
                    content: `Error: Missing taskId (${taskId}) or action (${action}). Check console for details.`,
                    systemType: "error"
                });
                setIsLoading(false);
                return;
            }

            const setResult = await setTaskAction(taskId, action, input);

            if (!setResult.success) {
                removeLastMessage(activeSession.id);
                addMessage(activeSession.id, {
                    type: "system",
                    content: setResult.error || "Failed to set task action",
                    systemType: "error"
                });
                setIsLoading(false);
                return;
            }

            updateSessionStatus(activeSession.id, "PLANNING");
            removeLastMessage(activeSession.id);
            addMessage(activeSession.id, { type: "loading", content: "Generating plan…" });

            // STEP 3: Generate plan immediately after setTask
            const planResult = await generatePlanAction(taskId);
            removeLastMessage(activeSession.id);

            if (planResult.success && planResult.data) {
                let content: string;

                // Extract text from LLM response structure
                if (typeof planResult.data === 'string') {
                    content = planResult.data;
                } else if (planResult.data.data?.text) {
                    // Server returns { message, data: { text, usage } }
                    content = planResult.data.data.text;
                } else if (planResult.data.text) {
                    content = planResult.data.text;
                } else if (planResult.data.data) {
                    content = typeof planResult.data.data === 'string' ? planResult.data.data : JSON.stringify(planResult.data.data);
                } else if (planResult.data.plan) {
                    content = planResult.data.plan;
                } else if (planResult.data.result) {
                    content = planResult.data.result;
                } else {
                    content = JSON.stringify(planResult.data, null, 2);
                }

                setCurrentPlan(content);

                const currentAction = action || activeSession.selectedAction;

                if (currentAction === "REVIEW_PR") {
                    updateSessionStatus(activeSession.id, "REVIEW_COMPLETE");
                    addMessage(activeSession.id, {
                        type: "system",
                        content: content,
                        systemType: "review"
                    });
                } else {
                    // EXECUTION ACTIONS (FIX_ISSUE / PLAN_CHANGE): Require approval
                    updateSessionStatus(activeSession.id, "AWAITING_APPROVAL");
                    addMessage(activeSession.id, {
                        type: "system",
                        content: content,
                        systemType: "plan-display"
                    });
                }
            } else {
                addMessage(activeSession.id, {
                    type: "system",
                    content: planResult.error || "Failed to generate plan",
                    systemType: "error"
                });
            }
            setIsLoading(false);
        }
    };

    const handleActionSelect = (action: ActionType) => {
        if (!activeSession) return;

        setSelectedAction(action);

        updateSession(activeSession.id, {
            title: `${action === "REVIEW_PR" ? "PR Review" : action === "FIX_ISSUE" ? "Fix Issue" : "Plan Change"}`,
            selectedAction: action
        });

        updateSessionStatus(activeSession.id, "AWAITING_INPUT");

        const promptMessage = action === "REVIEW_PR"
            ? "Please paste the PR URL you want me to review."
            : "Please describe what you want me to do.";

        addMessage(activeSession.id, {
            type: "system",
            content: promptMessage
        });
    };

    const handleApprove = async () => {
        if (!activeSession) return;

        const taskId = currentTaskId || activeSession.taskId;
        if (!taskId) {
            addMessage(activeSession.id, {
                type: "system",
                content: "Error: No active task to approve.",
                systemType: "error"
            });
            return;
        }

        setIsLoading(true);
        addMessage(activeSession.id, { type: "loading", content: "Approving plan…" });

        if (!user?._id) {
            removeLastMessage(activeSession.id);
            addMessage(activeSession.id, { type: "system", content: "Please log in to continue", systemType: "error" });
            setIsLoading(false);
            return;
        }

        const approveResult = await approvePlanAction(taskId, user._id);

        if (!approveResult.success) {
            removeLastMessage(activeSession.id);
            addMessage(activeSession.id, {
                type: "system",
                content: approveResult.error || "Failed to approve plan",
                systemType: "error"
            });
            setIsLoading(false);
            return;
        }

        updateSessionStatus(activeSession.id, "EXECUTING");
        removeLastMessage(activeSession.id);
        addMessage(activeSession.id, { type: "loading", content: "Executing task…" });

        // STEP 5: EXECUTE TASK
        const executeResult = await executeTaskAction(taskId);
        removeLastMessage(activeSession.id);

        if (executeResult.success && executeResult.data) {
            updateSessionStatus(activeSession.id, "COMPLETED");
            const prUrl = executeResult.data.prUrl || executeResult.data.pr_url;
            addMessage(activeSession.id, {
                type: "system",
                content: executeResult.data.message || "Task completed successfully!",
                systemType: "completion",
                metadata: { prUrl }
            });
        } else {
            addMessage(activeSession.id, {
                type: "system",
                content: executeResult.error || "Failed to execute task",
                systemType: "error"
            });
        }
        setIsLoading(false);
    };

    const handleEdit = () => {
        if (!activeSession) return;
        updateSessionStatus(activeSession.id, "AWAITING_INPUT");
        addMessage(activeSession.id, {
            type: "system",
            content: "Please provide additional details or changes to your request."
        });
    };

    const handleNewTask = () => {
        setCurrentTaskId(null);
        setSelectedAction(null);
        setCurrentPlan(null);
        createSession();
    };

    const renderMessage = (message: Message) => {
        // Handle system messages with special types
        if (message.type === "system" && message.systemType) {
            switch (message.systemType) {
                case "action-selection":
                    return (
                        <ChatMessage key={message.id} message={message}>
                            <div className="space-y-3">
                                <p className="text-sm mb-3">{message.content}</p>
                                <ActionSelectionCard onSelect={handleActionSelect} disabled={isLoading} />
                            </div>
                        </ChatMessage>
                    );
                case "plan-display":
                    return (
                        <ChatMessage key={message.id} message={message}>
                            <PlanDisplayCard
                                plan={message.content}
                                onApprove={handleApprove}
                                onEdit={handleEdit}
                                disabled={isLoading || activeSession?.status === "EXECUTING" || activeSession?.status === "COMPLETED" || activeSession?.status === "REVIEW_COMPLETE"}
                            />
                        </ChatMessage>
                    );
                case "review":
                    return (
                        <ChatMessage key={message.id} message={message}>
                            <ReviewDisplayCard review={message.content} />
                        </ChatMessage>
                    );
                case "completion":
                    return (
                        <ChatMessage key={message.id} message={message}>
                            <CompletionCard
                                message={message.content}
                                prUrl={message.metadata?.prUrl as string}
                                onNewTask={handleNewTask}
                            />
                        </ChatMessage>
                    );
                case "error":
                    return (
                        <ChatMessage key={message.id} message={message}>
                            <ErrorCard error={message.content} />
                        </ChatMessage>
                    );
            }
        }

        return <ChatMessage key={message.id} message={message} />;
    };

    if (!activeSession) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-background h-full overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto">
                <ScrollArea className="h-full">
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        <div className="space-y-6">
                            {/* Show task history for any task with details */}
                            {activeSession.taskId && !taskDetailsLoading && (() => {
                                const taskDetails = getCachedTaskDetails(activeSession.taskId);
                                return taskDetails ? (
                                    <TaskHistory taskDetails={taskDetails} />
                                ) : null;
                            })()}

                            {activeSession.messages.length === 0 && !activeSession.taskId ? (
                                <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-4">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                        <Sparkles className="w-8 h-8 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-foreground mb-3">
                                        Start a New Task
                                    </h2>
                                    <p className="text-muted-foreground max-w-md leading-relaxed">
                                        Paste a GitHub repository URL below to get started. I can help you review PRs, fix issues, or plan changes.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Chat Messages */}
                                    {activeSession.messages.map(renderMessage)}
                                </>
                            )}
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="border-t border-border bg-background shrink-0">
                <ChatInput
                    placeholder={getPlaceholder()}
                    onSubmit={handleSubmit}
                    disabled={isInputDisabled()}
                />
            </div>
        </div>
    );
}
