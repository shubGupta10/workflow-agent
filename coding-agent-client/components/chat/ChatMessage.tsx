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
                "flex w-full mb-4",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div
                className={cn(
                    "max-w-[85%] rounded-2xl px-5 py-3.5 transition-all duration-200",
                    isUser
                        ? "bg-primary text-primary-foreground rounded-br-md shadow-md hover:shadow-lg"
                        : "bg-card text-card-foreground border border-border rounded-bl-md shadow-sm hover:shadow-md"
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

