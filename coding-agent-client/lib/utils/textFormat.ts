/**
 * Formats text by replacing underscores with spaces and capitalizing each word
 * @param text - The text to format
 * @returns Formatted text with spaces and proper capitalization
 * @example formatTextWithSpaces("PLAN_CHANGE") => "Plan Change"
 */
export function formatTextWithSpaces(text: string): string {
    return text.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Gets a user's display name with fallback options
 * @param user - User object with optional name and email
 * @returns User's name, email, or "User" as fallback
 */
export function getUserDisplayName(user?: { name?: string; email?: string } | null): string {
    return user?.name || user?.email || "User";
}

/**
 * Formats a date string to relative time (e.g., "2 hours ago")
 * @param dateString - ISO date string
 * @returns Formatted relative time string or empty string if invalid
 */
export function formatRelativeTime(dateString: string): string {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

        return date.toLocaleDateString();
    } catch {
        return "";
    }
}
