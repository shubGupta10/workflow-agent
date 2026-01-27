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
                return "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20";
            case "EXECUTING":
            case "PLANNING":
                return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
            case "ERROR":
                return "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20";
            default:
                return "bg-muted/50 text-muted-foreground border border-border";
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
                            "fixed inset-y-0 left-0 z-50 h-screen w-60",
                            !isOpen && "-translate-x-full"
                        ] : [
                            "relative h-full",
                            isCollapsed ? "w-16" : "w-60"
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
                                <div className="space-y-1.5 pb-2">
                                    {sessions.map((session) => {
                                        const taskItem = (
                                            <div
                                                key={session.id}
                                                onClick={() => handleSessionClick(session.id, session.taskId)}
                                                className={cn(
                                                    "w-full text-left rounded-lg transition-all duration-200 cursor-pointer border-l-2",
                                                    "hover:bg-sidebar-accent/70",
                                                    activeSessionId === session.id
                                                        ? "bg-sidebar-accent border-sidebar-primary shadow-sm"
                                                        : "bg-transparent border-transparent hover:border-sidebar-border",
                                                    isCollapsed ? "p-2 flex justify-center" : "p-2.5"
                                                )}
                                            >
                                                {isCollapsed ? (
                                                    <MessageSquare className="w-5 h-5 text-sidebar-foreground" />
                                                ) : (
                                                    <>
                                                        <div className="flex items-start justify-between gap-2">
                                                            <span className={cn(
                                                                "text-sm truncate flex-1",
                                                                activeSessionId === session.id
                                                                    ? "font-semibold text-sidebar-foreground"
                                                                    : "font-medium text-sidebar-foreground/80"
                                                            )}>
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
                                                        <div className="mt-1.5">
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

                    <div className="p-4 border-t border-sidebar-border shrink-0 space-y-2">
                        {/* Dashboard Link */}
                        {!isCollapsed ? (
                            <Button
                                onClick={() => {
                                    router.push('/dashboard');
                                    if (isMobile && onClose) onClose();
                                }}
                                className="w-full"
                                variant="ghost"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Dashboard
                            </Button>
                        ) : (
                            <Tooltip delayDuration={300}>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={() => {
                                            router.push('/dashboard');
                                            if (isMobile && onClose) onClose();
                                        }}
                                        className="w-full"
                                        variant="ghost"
                                        size="icon"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Dashboard
                                </TooltipContent>
                            </Tooltip>
                        )}

                        {/* New Task Button */}
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


