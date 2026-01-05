"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionType, ACTION_LABELS } from "@/lib/types";
import ReactMarkdown from "react-markdown";

interface ActionSelectionCardProps {
    onSelect: (action: ActionType) => void;
    disabled?: boolean;
}

export function ActionSelectionCard({ onSelect, disabled }: ActionSelectionCardProps) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">What would you like to do?</CardTitle>
                <CardDescription>Choose an action for this repository</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
                <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => onSelect("REVIEW_PR")}
                    disabled={disabled}
                >
                    <svg className="w-4 h-4 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {ACTION_LABELS.REVIEW_PR}
                </Button>
                <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => onSelect("FIX_ISSUE")}
                    disabled={disabled}
                >
                    <svg className="w-4 h-4 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    {ACTION_LABELS.FIX_ISSUE}
                </Button>
                <Button
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => onSelect("PLAN_CHANGE")}
                    disabled={disabled}
                >
                    <svg className="w-4 h-4 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    {ACTION_LABELS.PLAN_CHANGE}
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
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Implementation Plan</CardTitle>
                <CardDescription>Review the proposed changes</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-muted rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono">{plan}</pre>
                </div>
                <div className="flex gap-2">
                    <Button onClick={onApprove} disabled={disabled} className="flex-1">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">Pull Request Review</CardTitle>
                        <CardDescription className="mt-1">Here's my analysis of the changes</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
                    <ReactMarkdown
                        components={{
                            h2: ({ children }: any) => (
                                <h2 className="text-lg font-semibold text-foreground mt-6 first:mt-0 mb-4">{children}</h2>
                            ),
                            h3: ({ children }: any) => (
                                <h3 className="text-base font-semibold text-foreground mt-4 mb-3">{children}</h3>
                            ),
                            p: ({ children }: any) => (
                                <p className="text-sm text-foreground leading-relaxed mb-4">{children}</p>
                            ),
                            ul: ({ children }: any) => (
                                <ul className="space-y-2 mb-4">{children}</ul>
                            ),
                            li: ({ children }: any) => (
                                <li className="flex gap-3 text-sm leading-relaxed">
                                    <span className="text-primary mt-1.5 flex-shrink-0">•</span>
                                    <span className="text-muted-foreground flex-1">{children}</span>
                                </li>
                            ),
                            strong: ({ children }: any) => (
                                <strong className="font-semibold text-foreground">{children}</strong>
                            ),
                        }}
                    >
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
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <CardTitle className="text-base">Task Completed</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{message}</p>
                {prUrl && (
                    <a
                        href={prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Pull Request
                    </a>
                )}
                <Button onClick={onNewTask} className="w-full">
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
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <CardTitle className="text-base text-destructive">Error</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                {onRetry && (
                    <Button variant="outline" onClick={onRetry}>
                        Try Again
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

