"use client";

import { TimelineEntry } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/lib/store/userStore";
import { formatTimelineContent } from "@/lib/utils/timelineFormat";

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
        const { role, createdAt, _id } = entry;
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
