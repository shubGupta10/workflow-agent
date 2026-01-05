"use client";

import { useTaskStore } from "@/lib/store/store";
import { STATUS_LABELS, TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Plus } from "lucide-react";

export function Sidebar() {
    const { sessions, activeSessionId, createSession, setActiveSession } = useTaskStore();

    const handleNewTask = () => {
        createSession();
    };

    // Status badge color mapping
    const getStatusColor = (status: TaskStatus): string => {
        switch (status) {
            case "COMPLETED":
            case "REVIEW_COMPLETE":
                return "bg-green-500/20 text-green-600 dark:text-green-400";
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
        <div className="w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-sidebar-border">
                <h1 className="text-lg font-semibold text-sidebar-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sidebar-primary" />
                    Coding Agent
                </h1>
            </div>

            {/* Session List */}
            <ScrollArea className="flex-1 p-2">
                {sessions.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        No tasks yet. Start a new one!
                    </div>
                ) : (
                    <div className="space-y-1">
                        {sessions.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => setActiveSession(session.id)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg transition-colors",
                                    "hover:bg-sidebar-accent",
                                    activeSessionId === session.id
                                        ? "bg-sidebar-accent"
                                        : "bg-transparent"
                                )}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <span className="text-sm font-medium text-sidebar-foreground truncate flex-1">
                                        {session.title}
                                    </span>
                                </div>
                                <div className="mt-1">
                                    <span
                                        className={cn(
                                            "inline-block text-xs px-2 py-0.5 rounded-full",
                                            getStatusColor(session.status)
                                        )}
                                    >
                                        {STATUS_LABELS[session.status]}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* New Task Button */}
            <div className="p-4 border-t border-sidebar-border">
                <Button
                    onClick={handleNewTask}
                    className="w-full"
                    variant="outline"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Task
                </Button>
            </div>
        </div>
    );
}

