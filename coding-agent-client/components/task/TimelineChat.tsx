"use client";

import { TimelineEntry } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface TimelineChatProps {
    timeline: TimelineEntry[];
}

export function TimelineChat({ timeline }: TimelineChatProps) {
    const formatTimestamp = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return "";
        }
    };

    const getReadableContent = (entry: TimelineEntry) => {
        const { type, content } = entry;

        // Make system messages more readable
        if (entry.role === "system") {
            switch (type) {
                case "task_created":
                    return content;
                case "repo_summary_saved":
                    return "Repository analyzed successfully";
                case "action_set":
                    return content.replace("User set action:", "Action selected:");
                case "plan_generated":
                    return "Plan has been generated";
                case "plan_approved":
                    return "Plan approved and ready for execution";
                default:
                    return content;
            }
        }

        return content;
    };

    const renderTimelineEntry = (entry: TimelineEntry) => {
        const { role, createdAt, _id } = entry;
        const displayContent = getReadableContent(entry);

        // System messages - subtle, centered
        if (role === "system") {
            return (
                <div key={_id} className="flex justify-center my-4">
                    <div className="bg-muted/50 rounded-full px-4 py-1.5 max-w-[80%]">
                        <p className="text-xs text-muted-foreground text-center">{displayContent}</p>
                    </div>
                </div>
            );
        }

        // User messages - right aligned, clean
        if (role === "user") {
            return (
                <div key={_id} className="flex justify-end mb-4">
                    <div className="flex flex-col items-end max-w-[75%]">
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5">
                            <p className="text-sm">{displayContent}</p>
                        </div>
                        <span className="text-xs text-muted-foreground/60 mt-1">
                            {formatTimestamp(createdAt)}
                        </span>
                    </div>
                </div>
            );
        }

        // Agent messages - left aligned, clean
        if (role === "agent") {
            return (
                <div key={_id} className="flex justify-start mb-4">
                    <div className="flex flex-col items-start max-w-[75%]">
                        <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5">
                            <p className="text-sm text-foreground whitespace-pre-wrap">{displayContent}</p>
                        </div>
                        <span className="text-xs text-muted-foreground/60 mt-1">
                            {formatTimestamp(createdAt)}
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
