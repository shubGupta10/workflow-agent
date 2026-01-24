"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Send, Sparkles } from "lucide-react";
import { useModelStore } from "@/lib/store/modelStore";

interface ChatInputProps {
    placeholder?: string;
    onSubmit: (value: string) => void;
    disabled?: boolean;
}

export function ChatInput({ placeholder = "Type a message...", onSubmit, disabled }: ChatInputProps) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const {
        availableModels,
        selectedModelId,
        isLoading: modelsLoading,
        fetchModels,
        setSelectedModel,
    } = useModelStore();

    useEffect(() => {
        if (availableModels.length === 0) {
            fetchModels();
        }
    }, [availableModels.length, fetchModels]);

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
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const selectedModel = availableModels.find(m => m.id === selectedModelId);

    return (
        <div className="bg-background p-4 md:p-6">
            <div className="max-w-3xl mx-auto">
                <div className="flex gap-3 items-end">
                    <div className="relative flex-1">
                        <Textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            disabled={disabled}
                            rows={1}
                            className={cn(
                                "resize-none min-h-[48px] max-h-[200px] w-full",
                                "pl-4 pr-12 py-3",
                                "bg-input border-border focus:ring-2 focus:ring-ring",
                                disabled && "opacity-50 cursor-not-allowed"
                            )}
                        />
                        <div className="absolute right-2 bottom-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full hover:bg-muted text-primary"
                                        disabled={modelsLoading || availableModels.length === 0}
                                    >
                                        <Sparkles className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[280px]">
                                    {availableModels.map((model) => (
                                        <DropdownMenuItem
                                            key={model.id}
                                            className="cursor-pointer"
                                            onClick={() => setSelectedModel(model.id)}
                                        >
                                            <div className="flex items-start gap-3 py-1">
                                                <Sparkles className={cn(
                                                    "w-4 h-4 mt-0.5 shrink-0",
                                                    selectedModelId === model.id ? "text-primary" : "text-muted-foreground"
                                                )} />
                                                <div className="flex flex-col gap-1">
                                                    <span className={cn(
                                                        "font-medium text-sm",
                                                        selectedModelId === model.id && "text-primary"
                                                    )}>{model.name}</span>
                                                    <span className="text-xs text-muted-foreground leading-tight">
                                                        {model.description}
                                                    </span>
                                                </div>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={disabled || !value.trim()}
                        size="icon"
                        className="h-12 w-12 shrink-0 shadow-md hover:shadow-lg transition-shadow"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
