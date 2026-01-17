"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionType, ACTION_LABELS } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Clipboard, Wrench, ClipboardList, Check, CheckCircle, ExternalLink, X, Sparkles, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

// Shared Markdown Components (copied from TaskHistory for consistency)
const markdownComponents = {
    h1: ({ children }: any) => (
        <h1 className="text-2xl font-bold text-foreground mt-8 mb-4 pb-3 border-b border-border first:mt-0">
            {children}
        </h1>
    ),
    h2: ({ children }: any) => (
        <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">
            {children}
        </h2>
    ),
    h3: ({ children }: any) => (
        <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">
            {children}
        </h3>
    ),
    h4: ({ children }: any) => (
        <h4 className="text-base font-semibold text-foreground mt-4 mb-2">
            {children}
        </h4>
    ),
    p: ({ children }: any) => (
        <p className="text-foreground leading-relaxed mb-4">
            {children}
        </p>
    ),
    ul: ({ children }: any) => (
        <ul className="space-y-2 my-4 ml-6 list-disc">
            {children}
        </ul>
    ),
    ol: ({ children }: any) => (
        <ol className="space-y-2 my-4 ml-6 list-decimal">
            {children}
        </ol>
    ),
    li: ({ children }: any) => (
        <li className="text-foreground leading-relaxed pl-1">
            {children}
        </li>
    ),
    strong: ({ children }: any) => (
        <strong className="font-semibold text-foreground">
            {children}
        </strong>
    ),
    em: ({ children }: any) => (
        <em className="italic text-foreground">
            {children}
        </em>
    ),
    code: ({ children, className }: any) => {
        const isInline = !className;
        if (isInline) {
            return (
                <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-sm border border-border">
                    {children}
                </code>
            );
        }
        return (
            <code className="font-mono text-sm text-foreground">
                {children}
            </code>
        );
    },
    pre: ({ children }: any) => (
        <pre className="bg-muted border border-border rounded-lg p-4 my-4 overflow-x-auto">
            {children}
        </pre>
    ),
    blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-primary/30 pl-4 py-2 my-4 bg-muted/30 rounded-r italic text-muted-foreground">
            {children}
        </blockquote>
    ),
    a: ({ children, href }: any) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
        >
            {children}
        </a>
    ),
    hr: () => (
        <hr className="my-6 border-border" />
    ),
    table: ({ children }: any) => (
        <div className="my-4 overflow-x-auto">
            <table className="w-full border-collapse">
                {children}
            </table>
        </div>
    ),
    th: ({ children }: any) => (
        <th className="border border-border bg-muted p-3 text-left font-semibold">
            {children}
        </th>
    ),
    td: ({ children }: any) => (
        <td className="border border-border p-3">
            {children}
        </td>
    ),
};

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
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold">Implementation Plan</CardTitle>
                        <CardDescription className="text-sm mt-1">Review the proposed changes</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-end">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Maximize2 className="w-3.5 h-3.5" />
                                View Full Plan
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0">
                            <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
                                <DialogTitle className="text-xl font-semibold">
                                    Implementation Plan
                                </DialogTitle>
                                <DialogDescription className="text-sm mt-2">
                                    Detailed plan for this task
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto px-6 py-6">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={markdownComponents}
                                >
                                    {plan}
                                </ReactMarkdown>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto border border-border">
                    <div className="prose prose-sm dark:prose-invert max-w-none
                        prose-headings:text-foreground prose-headings:font-semibold
                        prose-h1:text-lg prose-h1:mt-4 prose-h1:mb-2
                        prose-h2:text-base prose-h2:mt-3 prose-h2:mb-2
                        prose-h3:text-sm prose-h3:mt-2 prose-h3:mb-1
                        prose-p:text-muted-foreground prose-p:text-sm prose-p:mb-2
                        prose-strong:text-foreground prose-strong:font-semibold
                        prose-ul:text-sm prose-ul:my-2
                        prose-ol:text-sm prose-ol:my-2
                        prose-li:text-muted-foreground prose-li:my-0.5
                        prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
                    ">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {plan}
                        </ReactMarkdown>
                    </div>
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
                <div className="flex items-center justify-end mb-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Maximize2 className="w-3.5 h-3.5" />
                                View Full Review
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0">
                            <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
                                <DialogTitle className="text-xl font-semibold">
                                    Pull Request Review
                                </DialogTitle>
                                <DialogDescription className="text-sm mt-2">
                                    AI-powered code analysis and recommendations
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto px-6 py-6">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={markdownComponents}
                                >
                                    {review}
                                </ReactMarkdown>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto border border-border">
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
