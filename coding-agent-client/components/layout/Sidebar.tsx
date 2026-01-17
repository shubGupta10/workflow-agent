"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/lib/store/store";
import { STATUS_LABELS, TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, X, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

interface SidebarProps {
    onDeleteTask?: (taskId: string) => void;
    isOpen?: boolean;
    isMobile?: boolean;
    onClose?: () => void;
}

export function Sidebar({ onDeleteTask, isOpen = true, isMobile = false, onClose }: SidebarProps) {
    const router = useRouter();
    const { sessions, activeSessionId, createSession, setActiveSession } = useTaskStore();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Default to expanded on desktop
    useEffect(() => {
        if (!isMobile) {
            setIsCollapsed(false);
        }
    }, [isMobile]);

    const handleNewTask = () => {
        createSession();
    };

    const handleSessionClick = (sessionId: string, taskId?: string) => {
        setActiveSession(sessionId);

        if (taskId) {
            router.push(`/chat?taskId=${taskId}`, { scroll: false });
        } else {
            router.push('/chat', { scroll: false });
        }

        if (isMobile && onClose) {
            onClose();
        }
    };

    const handleDeleteClick = (
        event: React.MouseEvent<HTMLButtonElement>,
        taskId?: string
    ) => {
        event.stopPropagation();
        if (!taskId || !onDeleteTask) return;
        onDeleteTask(taskId);
    };

    const getStatusColor = (status: TaskStatus): string => {
        switch (status) {
            case "COMPLETED":
            case "REVIEW_COMPLETE":
                return "bg-secondary/20 text-secondary-foreground";
            case "EXECUTING":
            case "PLANNING":
                return "bg-primary/20 text-primary";
            case "ERROR":
                return "bg-destructive/20 text-destructive";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    return (
        <TooltipProvider>
            <>
                {/* Mobile Overlay */}
                {isMobile && isOpen && (
                    <div
                        className="fixed inset-0 bg-foreground/50 z-40 md:hidden"
                        onClick={onClose}
                        aria-hidden="true"
                    />
                )}

                {/* Sidebar */}
                <div
                    className={cn(
                        "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
                        isMobile ? [
                            "fixed inset-y-0 left-0 z-50 h-screen w-64",
                            !isOpen && "-translate-x-full"
                        ] : [
                            "relative h-full",
                            isCollapsed ? "w-16" : "w-64"
                        ],
                        "md:translate-x-0 md:static md:h-full"
                    )}
                >
                    {/* Header with Toggle Button (Desktop) or Close Button (Mobile) */}
                    <div className="flex justify-between items-center p-2 border-b border-sidebar-border shrink-0">
                        {isMobile ? (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                aria-label="Close sidebar"
                                className="ml-auto"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                                className="ml-auto"
                            >
                                {isCollapsed ? (
                                    <ChevronRight className="w-5 h-5" />
                                ) : (
                                    <ChevronLeft className="w-5 h-5" />
                                )}
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 min-h-0 overflow-hidden">
                        <ScrollArea className="h-full p-2">
                            {sessions.length === 0 ? (
                                !isCollapsed && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No tasks yet. Start a new one!
                                    </div>
                                )
                            ) : (
                                <div className="space-y-2 pb-2">
                                    {sessions.map((session) => {
                                        const taskItem = (
                                            <div
                                                key={session.id}
                                                onClick={() => handleSessionClick(session.id, session.taskId)}
                                                className={cn(
                                                    "w-full text-left rounded-lg transition-colors cursor-pointer",
                                                    "hover:bg-sidebar-accent",
                                                    activeSessionId === session.id
                                                        ? "bg-sidebar-accent border-l-2 border-sidebar-primary"
                                                        : "bg-transparent",
                                                    isCollapsed ? "p-2 flex justify-center" : "p-3"
                                                )}
                                            >
                                                {isCollapsed ? (
                                                    <MessageSquare className="w-5 h-5 text-sidebar-foreground" />
                                                ) : (
                                                    <>
                                                        <div className="flex items-start justify-between gap-2">
                                                            <span className="text-sm font-medium text-sidebar-foreground truncate flex-1">
                                                                {session.title}
                                                            </span>
                                                            {session.taskId && onDeleteTask && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(event) => handleDeleteClick(event, session.taskId)}
                                                                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="mt-2">
                                                            <span
                                                                className={cn(
                                                                    "inline-block text-xs px-2 py-0.5 rounded-full",
                                                                    getStatusColor(session.status)
                                                                )}
                                                            >
                                                                {STATUS_LABELS[session.status]}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        );

                                        // Wrap with tooltip when collapsed
                                        if (isCollapsed && !isMobile) {
                                            return (
                                                <Tooltip key={session.id} delayDuration={300}>
                                                    <TooltipTrigger asChild>
                                                        {taskItem}
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right" className="max-w-xs">
                                                        <div className="space-y-1">
                                                            <p className="font-medium">{session.title}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {STATUS_LABELS[session.status]}
                                                            </p>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            );
                                        }

                                        return taskItem;
                                    })}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    <div className="p-4 border-t border-sidebar-border shrink-0">
                        {isCollapsed ? (
                            <Tooltip delayDuration={300}>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleNewTask}
                                        className="w-full"
                                        variant="outline"
                                        size="icon"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    New Task
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Button
                                onClick={handleNewTask}
                                className="w-full"
                                variant="outline"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Task
                            </Button>
                        )}
                    </div>
                </div>
            </>
        </TooltipProvider>
    );
}


