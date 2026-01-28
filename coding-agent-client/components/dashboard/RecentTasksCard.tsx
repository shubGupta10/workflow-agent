"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTaskStore } from "@/lib/store/store";
import { STATUS_LABELS } from "@/lib/types";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, MessageSquare, Terminal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export function RecentTasksCard() {
    const { sessions, setActiveSession, fetchSessions, isLoadingTasks } = useTaskStore();
    const router = useRouter();

    useEffect(() => {
        // Fetch sessions on mount if not already loaded or to refresh
        fetchSessions();
    }, [fetchSessions]);

    // Get the 3 most recent sessions (excluding empty new tasks)
    const recentSessions = sessions
        .filter(s => s.status !== "AWAITING_REPO")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);

    const handleSessionClick = (sessionId: string, taskId?: string) => {
        setActiveSession(sessionId);
        if (taskId) {
            router.push(`/chat?taskId=${taskId}`);
        } else {
            router.push('/chat');
        }
    };

    if (isLoadingTasks && sessions.length === 0) {
        return (
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Recent Tasks</CardTitle>
                    <CardDescription>Loading your tasks...</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
                </CardContent>
            </Card>
        );
    }

    if (sessions.length === 0) {
        return (
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Recent Tasks</CardTitle>
                    <CardDescription>Your latest activity will show up here</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-6 text-muted-foreground bg-muted/20 m-6 rounded-lg border border-dashed">
                    <MessageSquare className="w-10 h-10 mb-3 opacity-20" />
                    <p className="text-sm">No tasks found</p>
                    <p className="text-xs mt-1 opacity-70">Start a new task to get started</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                    <CardTitle>Recent Tasks</CardTitle>
                    <CardDescription>Resume your latest work</CardDescription>
                </div>
                <Button variant="ghost" className="text-xs h-8" onClick={() => router.push('/chat')}>
                    View All <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-0 p-0">
                <div className="divide-y divide-border">
                    {recentSessions.map((session) => (
                        <div
                            key={session.id}
                            onClick={() => handleSessionClick(session.id, session.taskId)}
                            className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors group"
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                                session.status === "COMPLETED" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                                    session.status === "ERROR" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                                        "bg-primary/10 text-primary border-primary/20"
                            )}>
                                {session.status === "COMPLETED" ? (
                                    <Terminal className="w-5 h-5" />
                                ) : (
                                    <MessageSquare className="w-5 h-5" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0 space-y-1">
                                <p className="text-sm font-medium leading-none truncate pr-4 group-hover:text-primary transition-colors">
                                    {session.title || "Untitled Task"}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className={cn(
                                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
                                        session.status === "COMPLETED" ? "border-green-500/20 bg-green-500/5 text-green-700 dark:text-green-400" :
                                            session.status === "EXECUTING" ? "border-blue-500/20 bg-blue-500/5 text-blue-700 dark:text-blue-400" :
                                                "border-border bg-muted text-muted-foreground"
                                    )}>
                                        {STATUS_LABELS[session.status]}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </CardContent>
        </Card>
    );
}
