import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
    message: Message;
    children?: React.ReactNode;
    hideBubble?: boolean;
}

export function ChatMessage({ message, children, hideBubble }: ChatMessageProps) {
    const isUser = message.type === "user";
    const isLoading = message.type === "loading";

    return (
        <div
            className={cn(
                "flex w-full gap-4 mb-6",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar */}
            <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm",
                isUser
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-border"
            )}>
                {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Content Container */}
            <div className={cn(
                "flex flex-col max-w-[80%] min-w-0",
                isUser ? "items-end" : "items-start"
            )}>
                {/* Message Bubble */}
                {(!hideBubble && (message.content || isLoading)) && (
                    <div
                        className={cn(
                            "rounded-2xl px-5 py-3 shadow-sm mb-2",
                            isUser
                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                : "bg-muted/50 border border-border/50 text-foreground rounded-tl-sm",
                            isLoading && "animate-pulse"
                        )}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{message.content}</span>
                                <div className="flex gap-1 ml-1">
                                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        )}
                    </div>
                )}

                {/* Custom Content / Attachments (Unboxed) */}
                {children && (
                    <div className="w-full">
                        {children}
                    </div>
                )}

                {/* Sender Name */}
                <span className="text-[10px] text-muted-foreground mt-1 px-1 opacity-70">
                    {isUser ? "You" : "Coding Agent"}
                </span>
            </div>
        </div>
    );
}
