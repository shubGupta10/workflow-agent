"use client";

import { TimelineEntry } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/lib/store/userStore";
import { formatTimelineContent } from "@/lib/utils/timelineFormat";
import { CompletionCard } from "./SystemCard";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineChatProps {
    timeline: TimelineEntry[];
}

export function TimelineChat({ timeline }: TimelineChatProps) {
    const { user } = useAuthStore();

    const formatTimestamp = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return "";
        }
    };

    const renderTimelineEntry = (entry: TimelineEntry) => {
        const { role, createdAt, _id, type, content } = entry;

        // Filter out unwanted system messages
        if (['task_created', 'repo_summary_saved', 'action_set'].includes(type)) {
            return null;
        }

        // Check for task completion message
        if (role === "system" && (content.includes("Task executed successfully") || content.includes("PR created:"))) {
            const prUrlMatch = content.match(/https?:\/\/[^\s]+/);
            const prUrl = prUrlMatch ? prUrlMatch[0] : undefined;
            // Clean up message: remove the URL and "PR created:" label
            let messageText = content;
            if (prUrl) {
                messageText = messageText.replace(prUrl, "");
            }
            messageText = messageText.replace("PR created:", "").trim();
            if (messageText.endsWith(".")) messageText = messageText.slice(0, -1);
            if (!messageText) messageText = "Task completed successfully";

            return (
                <div key={_id} className="flex justify-center my-6 w-full max-w-2xl mx-auto px-4">
                    <CompletionCard
                        message={messageText}
                        prUrl={prUrl}
                    />
                </div>
            );
        }

        const displayContent = formatTimelineContent(entry, user);

        if (role === "system") {
            return (
                <div key={_id} className="flex justify-center my-4">
                    <div className="bg-muted/50 rounded-full px-4 py-1.5 max-w-[80%]">
                        <p className="text-xs text-muted-foreground text-center">{displayContent}</p>
                    </div>
                </div>
            );
        }

        if (role === "user") {
            return (
                <div key={_id} className="flex flex-row-reverse gap-4 mb-6">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-primary bg-primary text-primary-foreground shadow-sm">
                        <User className="w-5 h-5" />
                    </div>

                    <div className="flex flex-col items-end max-w-[75%] min-w-0">
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-5 py-2.5 shadow-sm">
                            <p className="text-sm leading-relaxed">{displayContent}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground/60 mt-1.5 px-1 uppercase tracking-tight">
                            You • {formatTimestamp(createdAt)}
                        </span>
                    </div>
                </div>
            );
        }

        if (role === "agent") {
            return (
                <div key={_id} className="flex flex-row gap-4 mb-6">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-border bg-muted text-muted-foreground shadow-sm">
                        <Bot className="w-5 h-5" />
                    </div>

                    <div className="flex flex-col items-start max-w-[75%] min-w-0">
                        <div className="bg-muted rounded-2xl rounded-tl-sm px-5 py-2.5 shadow-sm">
                            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{displayContent}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground/60 mt-1.5 px-1 uppercase tracking-tight">
                            Coding Agent • {formatTimestamp(createdAt)}
                        </span>
                    </div>
                </div>
            );
        }

        return null;
    };

    if (!timeline || timeline.length === 0) {
        return null;
    }

    return (
        <div className="space-y-1 py-4">
            {timeline.map(renderTimelineEntry)}
        </div>
    );
}
