"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
                <div className="flex items-center gap-2 mb-2">
                    <Select
                        value={selectedModelId || undefined}
                        onValueChange={setSelectedModel}
                        disabled={modelsLoading || availableModels.length === 0}
                    >
                        <SelectTrigger className="w-[200px] h-9 text-sm border-border/50 hover:border-border transition-colors">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <SelectValue>
                                    {modelsLoading ? "Loading..." : selectedModel?.name || "Select model"}
                                </SelectValue>
                            </div>
                        </SelectTrigger>
                        <SelectContent align="start" className="w-[280px]">
                            {availableModels.map((model) => (
                                <SelectItem key={model.id} value={model.id} className="cursor-pointer">
                                    <div className="flex items-start gap-3 py-1">
                                        <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-sm">{model.name}</span>
                                            <span className="text-xs text-muted-foreground leading-tight">
                                                {model.description}
                                            </span>
                                        </div>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

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
                                "resize-none min-h-[48px] max-h-[200px]",
                                "bg-input border-border focus:ring-2 focus:ring-ring",
                                disabled && "opacity-50 cursor-not-allowed"
                            )}
                        />
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
                <p className="text-xs text-muted-foreground mt-2 text-center">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}
