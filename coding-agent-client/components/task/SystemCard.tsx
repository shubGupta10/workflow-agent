"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionType, ACTION_LABELS } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Clipboard, Wrench, ClipboardList, Check, CheckCircle, ExternalLink, X, Sparkles, Maximize2, ArrowRight, FileText, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ActionSelectionCardProps {
    onSelect: (action: ActionType) => void;
    disabled?: boolean;
}

export function ActionSelectionCard({ onSelect, disabled }: ActionSelectionCardProps) {
    const actions = [
        {
            id: "REVIEW_PR",
            icon: Clipboard,
            label: ACTION_LABELS.REVIEW_PR,
        },
        {
            id: "FIX_ISSUE",
            icon: Wrench,
            label: ACTION_LABELS.FIX_ISSUE,
        },
        {
            id: "PLAN_CHANGE",
            icon: ClipboardList,
            label: ACTION_LABELS.PLAN_CHANGE,
        }
    ];

    return (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
            {actions.map((action) => (
                <button
                    key={action.id}
                    onClick={() => onSelect(action.id as ActionType)}
                    disabled={disabled}
                    className="flex flex-col items-center justify-center p-2 sm:p-4 rounded-xl border bg-background hover:bg-accent/50 transition-all gap-2 sm:gap-3 h-24 sm:h-28 group hover:border-primary/50 shadow-sm hover:shadow-md"
                >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <action.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <span className="font-medium text-xs sm:text-sm text-center leading-none sm:leading-tight">{action.label}</span>
                </button>
            ))}
        </div>
    );
}

// Shared Markdown Components
const markdownComponents = {
    h1: ({ children }: any) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-lg font-semibold mt-3 mb-2">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-base font-semibold mt-2 mb-1">{children}</h3>,
    p: ({ children }: any) => <p className="leading-relaxed mb-3 text-sm">{children}</p>,
    ul: ({ children }: any) => <ul className="list-disc ml-5 mb-3 text-sm space-y-1">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal ml-5 mb-3 text-sm space-y-1">{children}</ol>,
    li: ({ children }: any) => <li className="pl-1">{children}</li>,
    code: ({ children, className }: any) => {
        const isInline = !className;
        return isInline ? (
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
        ) : (
            <code className="block bg-muted/50 p-3 rounded-lg text-xs font-mono my-2 overflow-x-auto">{children}</code>
        );
    },
    pre: ({ children }: any) => <pre className="my-2">{children}</pre>,
};

interface PlanDisplayCardProps {
    plan: string;
    onApprove: () => void;
    onEdit: () => void;
    disabled?: boolean;
}

export function PlanDisplayCard({ plan, onApprove, onEdit, disabled }: PlanDisplayCardProps) {
    // Truncate logic
    const MAX_LENGTH = 300;
    const shouldTruncate = plan.length > MAX_LENGTH;
    const displayedPlan = shouldTruncate ? plan.slice(0, MAX_LENGTH) + "..." : plan;

    return (
        <div className="w-full max-w-2xl space-y-4">
            <div className="relative bg-background/50 border rounded-xl p-5 overflow-hidden">
                <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {displayedPlan}
                    </ReactMarkdown>
                </div>

                {shouldTruncate && (
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent flex items-end justify-center pb-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="secondary" size="sm" className="shadow-sm">
                                    <Maximize2 className="w-3.5 h-3.5 mr-2" />
                                    Read Full Plan
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                                <DialogHeader>
                                    <DialogTitle>Implementation Plan</DialogTitle>
                                    <DialogDescription>Full details of the proposed changes.</DialogDescription>
                                </DialogHeader>
                                <div className="flex-1 overflow-y-auto pr-2 mt-4">
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                            {plan}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t mt-auto">
                                    <Button variant="outline" onClick={onEdit} disabled={disabled}>
                                        Edit Request
                                    </Button>
                                    <Button onClick={onApprove} disabled={disabled}>
                                        <Check className="w-4 h-4 mr-2" />
                                        Approve & Execute
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>

            {!shouldTruncate && (
                <div className="flex gap-3">
                    <Button onClick={onApprove} disabled={disabled} className="flex-1">
                        <Check className="w-4 h-4 mr-2" />
                        Approve Plan
                    </Button>
                    <Button variant="outline" onClick={onEdit} disabled={disabled}>
                        Edit Request
                    </Button>
                </div>
            )}
        </div>
    );
}

interface ReviewDisplayCardProps {
    review: string;
}

export function ReviewDisplayCard({ review }: ReviewDisplayCardProps) {
    const MAX_LENGTH = 300;
    const shouldTruncate = review.length > MAX_LENGTH;
    const displayedReview = shouldTruncate ? review.slice(0, MAX_LENGTH) + "..." : review;

    return (
        <div className="w-full max-w-2xl">
            <div className="relative bg-background/50 border rounded-xl p-5 overflow-hidden">
                <div className="flex items-center gap-2 mb-3 text-primary font-medium text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Review Analysis</span>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {displayedReview}
                    </ReactMarkdown>
                </div>
                {shouldTruncate && (
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent flex items-end justify-center pb-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="secondary" size="sm" className="shadow-sm">
                                    <Maximize2 className="w-3.5 h-3.5 mr-2" />
                                    Read Full Review
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                                <DialogHeader>
                                    <DialogTitle>Code Review</DialogTitle>
                                </DialogHeader>
                                <div className="flex-1 overflow-y-auto pr-2 mt-4">
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                            {review}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>
        </div>
    );
}

interface CompletionCardProps {
    message: string;
    prUrl?: string;
    onNewTask?: () => void;
}

export function CompletionCard({ message, prUrl, onNewTask }: CompletionCardProps) {
    return (
        <div className="w-full bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 transition-all hover:bg-green-500/10">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 text-green-500" />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
                <h3 className="font-semibold text-foreground">Task Completed</h3>
                <p className="text-sm text-muted-foreground">{message}</p>
                {prUrl && (
                    <a
                        href={prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-green-500 hover:text-green-400 hover:underline font-medium mt-1"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Pull Request
                    </a>
                )}
            </div>

            {onNewTask && (
                <Button onClick={onNewTask} variant="outline" className="shrink-0 border-green-500/30 hover:bg-green-500/20 hover:text-green-500">
                    Start New Task
                </Button>
            )}
        </div>
    );
}

interface ErrorCardProps {
    error: string;
    onRetry?: () => void;
}

export function ErrorCard({ error, onRetry }: ErrorCardProps) {
    return (
        <div className="w-full max-w-md bg-destructive/10 border border-destructive/20 rounded-xl p-5">
            <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center text-destructive">
                    <X className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-destructive">Error Occurred</h3>
                <p className="text-sm text-foreground/80">{error}</p>
                {onRetry && (
                    <Button variant="outline" onClick={onRetry} className="w-full mt-2 border-destructive/30 hover:bg-destructive/10">
                        Try Again
                    </Button>
                )}
            </div>
        </div>
    );
}
