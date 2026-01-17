"use client";

import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
    message: Message;
    children?: React.ReactNode;
}

export function ChatMessage({ message, children }: ChatMessageProps) {
    const isUser = message.type === "user";
    const isLoading = message.type === "loading";

    return (
        <div
            className={cn(
                "flex w-full",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div
                className={cn(
                    "max-w-[85%] rounded-lg p-4 transition-all duration-200 border-l-4",
                    isUser
                        ? "bg-accent border-accent-foreground/20 text-accent-foreground ml-auto mr-0 shadow-sm hover:shadow-md"
                        : "bg-muted border-muted-foreground/20 text-foreground ml-0 mr-auto shadow-sm hover:shadow"
                )}
            >
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                        <span className="text-sm">{message.content}</span>
                    </div>
                ) : children ? (
                    children
                ) : (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                )}
            </div>
        </div>
    );
}

