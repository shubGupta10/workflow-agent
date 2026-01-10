"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionType, ACTION_LABELS } from "@/lib/types";
import ReactMarkdown, { Components } from "react-markdown";
import { Clipboard, Wrench, ClipboardList, Check, CheckCircle, ExternalLink, X, Sparkles } from "lucide-react";

interface ActionSelectionCardProps {
    onSelect: (action: ActionType) => void;
    disabled?: boolean;
}

export function ActionSelectionCard({ onSelect, disabled }: ActionSelectionCardProps) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">What would you like to do?</CardTitle>
                <CardDescription className="text-sm">Choose an action for this repository</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
                <Button
                    variant="outline"
                    className="justify-start h-auto py-4 px-4"
                    onClick={() => onSelect("REVIEW_PR")}
                    disabled={disabled}
                >
                    <Clipboard className="w-4 h-4 mr-3 text-primary shrink-0" />
                    <span className="text-sm font-medium">{ACTION_LABELS.REVIEW_PR}</span>
                </Button>
                <Button
                    variant="outline"
                    className="justify-start h-auto py-4 px-4"
                    onClick={() => onSelect("FIX_ISSUE")}
                    disabled={disabled}
                >
                    <Wrench className="w-4 h-4 mr-3 text-primary shrink-0" />
                    <span className="text-sm font-medium">{ACTION_LABELS.FIX_ISSUE}</span>
                </Button>
                <Button
                    variant="outline"
                    className="justify-start h-auto py-4 px-4"
                    onClick={() => onSelect("PLAN_CHANGE")}
                    disabled={disabled}
                >
                    <ClipboardList className="w-4 h-4 mr-3 text-primary shrink-0" />
                    <span className="text-sm font-medium">{ACTION_LABELS.PLAN_CHANGE}</span>
                </Button>
            </CardContent>
        </Card>
    );
}

interface PlanDisplayCardProps {
    plan: string;
    onApprove: () => void;
    onEdit: () => void;
    disabled?: boolean;
}

export function PlanDisplayCard({ plan, onApprove, onEdit, disabled }: PlanDisplayCardProps) {
    return (
        <Card className="w-full">
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">Implementation Plan</CardTitle>
                <CardDescription className="text-sm">Review the proposed changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto border border-border">
                    <pre className="text-sm whitespace-pre-wrap font-mono text-foreground leading-relaxed">{plan}</pre>
                </div>
                <div className="flex gap-3">
                    <Button onClick={onApprove} disabled={disabled} className="flex-1">
                        <Check className="w-4 h-4 mr-2" />
                        Approve & Execute
                    </Button>
                    <Button variant="outline" onClick={onEdit} disabled={disabled}>
                        Edit Request
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

interface ReviewDisplayCardProps {
    review: string;
}

export function ReviewDisplayCard({ review }: ReviewDisplayCardProps) {
    const components: Components = {
        h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-foreground mt-6 first:mt-0 mb-4">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-base font-semibold text-foreground mt-4 mb-3">{children}</h3>
        ),
        p: ({ children }) => (
            <p className="text-sm text-foreground leading-relaxed mb-4">{children}</p>
        ),
        ul: ({ children }) => (
            <ul className="space-y-2 mb-4">{children}</ul>
        ),
        li: ({ children }) => (
            <li className="flex gap-3 text-sm leading-relaxed">
                <span className="text-primary mt-1.5 shrink-0">•</span>
                <span className="text-muted-foreground flex-1">{children}</span>
            </li>
        ),
        strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
        ),
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-4 border-b border-border">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">Pull Request Review</CardTitle>
                        <CardDescription className="mt-1">Here's my analysis of the changes</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
                    <ReactMarkdown components={components}>
                        {review}
                    </ReactMarkdown>
                </div>
            </CardContent>
        </Card>
    );
}

interface CompletionCardProps {
    message: string;
    prUrl?: string;
    onNewTask: () => void;
}

export function CompletionCard({ message, prUrl, onNewTask }: CompletionCardProps) {
    return (
        <Card className="w-full border-green-500/20">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-base font-semibold">Task Completed</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-foreground leading-relaxed">{message}</p>
                {prUrl && (
                    <a
                        href={prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View Pull Request
                    </a>
                )}
                <Button onClick={onNewTask} className="w-full mt-2">
                    Start New Task
                </Button>
            </CardContent>
        </Card>
    );
}

interface ErrorCardProps {
    error: string;
    onRetry?: () => void;
}

export function ErrorCard({ error, onRetry }: ErrorCardProps) {
    return (
        <Card className="w-full border-destructive/50">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                        <X className="w-5 h-5 text-destructive" />
                    </div>
                    <CardTitle className="text-base font-semibold text-destructive">Error</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-foreground leading-relaxed">{error}</p>
                {onRetry && (
                    <Button variant="outline" onClick={onRetry} className="w-full">
                        Try Again
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

