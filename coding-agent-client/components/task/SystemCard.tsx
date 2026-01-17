"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionType, ACTION_LABELS } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
    return (
        <Card className="w-full">
            <CardHeader className="pb-4 border-b border-border">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">Pull Request Review</CardTitle>
                        <CardDescription className="mt-1">AI-powered code analysis and recommendations</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="prose prose-sm dark:prose-invert max-w-none
                    prose-headings:text-foreground prose-headings:font-semibold
                    prose-h1:text-2xl prose-h1:mt-8 prose-h1:mb-4 prose-h1:pb-2 prose-h1:border-b prose-h1:border-border
                    prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
                    prose-h3:text-lg prose-h3:mt-5 prose-h3:mb-2.5
                    prose-h4:text-base prose-h4:mt-4 prose-h4:mb-2
                    prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-em:text-foreground
                    prose-ul:my-4 prose-ul:ml-4
                    prose-ol:my-4 prose-ol:ml-4
                    prose-li:text-foreground prose-li:my-1
                    prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:border prose-code:border-border prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg
                    prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-4 prose-blockquote:bg-muted/30 prose-blockquote:rounded-r prose-blockquote:text-muted-foreground
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-hr:border-border prose-hr:my-6
                    prose-table:border-collapse prose-table:w-full
                    prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-2 prose-th:text-left
                    prose-td:border prose-td:border-border prose-td:p-2
                ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
