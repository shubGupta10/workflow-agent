import { TimelineEntry } from "@/lib/types";
import { formatTextWithSpaces, getUserDisplayName } from "./textFormat";

/**
 * Formats timeline entry content to be more user-friendly
 * @param entry - Timeline entry to format
 * @param currentUser - Currently logged-in user for personalization
 * @returns Formatted, readable content string
 */
export function formatTimelineContent(
    entry: TimelineEntry,
    currentUser?: { name?: string; email?: string } | null
): string {
    const { type, content, role } = entry;

    if (role === "system") {
        switch (type) {
            case "task_created":
                return content;
            case "repo_summary_saved":
                return "Repository analyzed successfully";
            case "action_set": {
                const text = content.replace("User set action:", "Action selected:");
                return formatTextWithSpaces(text);
            }
            case "plan_generated":
                return "Plan has been generated";
            default:
                return content;
        }
    }

    if (role === "user" && type === "plan_approved") {
        const userName = getUserDisplayName(currentUser);
        return `Plan approved by ${userName}`;
    }

    return content;
}
