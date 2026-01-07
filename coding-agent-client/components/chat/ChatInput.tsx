"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

interface ChatInputProps {
    placeholder?: string;
    onSubmit: (value: string) => void;
    disabled?: boolean;
}

export function ChatInput({ placeholder = "Type a message...", onSubmit, disabled }: ChatInputProps) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, [value]);

    const handleSubmit = () => {
        if (value.trim() && !disabled) {
            onSubmit(value.trim());
            setValue("");
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        // Enter = submit, Shift+Enter = newline
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="bg-background p-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex gap-3 items-end">
                    <div className="flex-1 relative">
                        <Textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            disabled={disabled}
                            rows={1}
                            className={cn(
                                "resize-none min-h-[44px] max-h-[200px]",
                                "bg-input border-border",
                                disabled && "opacity-50 cursor-not-allowed"
                            )}
                        />
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={disabled || !value.trim()}
                        size="icon"
                        className="h-11 w-11 shrink-0"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}

