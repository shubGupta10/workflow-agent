"use client";

import { TaskDetails } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Maximize2 } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TimelineChat } from "./TimelineChat";

interface TaskHistoryProps {
    taskDetails: TaskDetails;
    onApprove?: () => void;
    onEdit?: () => void;
    isLoading?: boolean;
}

export function TaskHistory({ taskDetails, onApprove, onEdit, isLoading }: TaskHistoryProps) {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        repo: true,
        plan: true,
        execution: true,
        result: true,
    });

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const renderRepoSummary = () => {
        // Don't show if no repo summary data
        if (!taskDetails.repoSummary || !taskDetails.repoSummary.repoUrl) {
            return null;
        }

        return (
            <Card className="w-full mb-3 border-border/50">
                <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors pb-4"
                    onClick={() => toggleSection("repo")}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold">Repository Summary</CardTitle>
                            <CardDescription className="text-sm mt-1">Repository information analyzed</CardDescription>
                        </div>
                        {expandedSections.repo ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                    </div>
                </CardHeader>
                {expandedSections.repo && (
                    <CardContent className="space-y-4 pt-0">
                        {!taskDetails.repoSummary ? (
                            <p className="text-sm text-muted-foreground italic">Repository summary not available</p>
                        ) : (
                            <>
                                {taskDetails.repoSummary.repoUrl && (
                                    <div className="flex flex-col gap-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Repository URL</p>
                                        <a
                                            href={taskDetails.repoSummary.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline font-medium break-all"
                                        >
                                            {taskDetails.repoSummary.repoUrl}
                                        </a>
                                    </div>
                                )}
                                {taskDetails.repoSummary.languages?.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Languages</p>
                                        <p className="text-sm text-muted-foreground">
                                            {taskDetails.repoSummary.languages.join(", ")}
                                        </p>
                                    </div>
                                )}
                                {taskDetails.repoSummary.framework && (
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Framework</p>
                                        <p className="text-sm text-muted-foreground">{taskDetails.repoSummary.framework}</p>
                                    </div>
                                )}
                                {taskDetails.repoSummary.packageManager && (
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Package Manager</p>
                                        <p className="text-sm text-muted-foreground">
                                            {taskDetails.repoSummary.packageManager}
                                        </p>
                                    </div>
                                )}
                                {taskDetails.repoSummary.configFiles?.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Config Files</p>
                                        <p className="text-sm text-muted-foreground">
                                            {taskDetails.repoSummary.configFiles.join(", ")}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                )}
            </Card>
        );
    };

    const renderPlan = () => {
        // Don't show if no plan
        if (!taskDetails.plan) {
            return null;
        }

        return (
            <Card className="w-full mb-3 border-border/50">
                <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors pb-4"
                    onClick={() => toggleSection("plan")}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold">
                                {taskDetails.action === "REVIEW_PR" ? "Review" : "Implementation Plan"}
                            </CardTitle>
                            <CardDescription className="text-sm mt-1">Plan details for this task</CardDescription>
                        </div>
                        {expandedSections.plan ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                    </div>
                </CardHeader>
                {expandedSections.plan && (
                    <CardContent className="pt-0">
                        {!taskDetails.plan ? (
                            <p className="text-sm text-muted-foreground italic">Plan not available</p>
                        ) : (
                            <>
                                <div className="flex items-center justify-end mb-3">
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
                                                    {taskDetails.action === "REVIEW_PR" ? "Review Plan" : "Implementation Plan"}
                                                </DialogTitle>
                                                <DialogDescription className="text-sm mt-2">
                                                    Detailed plan for this task
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex-1 overflow-y-auto px-6 py-6">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        h1: ({ children }) => (
                                                            <h1 className="text-2xl font-bold text-foreground mt-8 mb-4 pb-3 border-b border-border first:mt-0">
                                                                {children}
                                                            </h1>
                                                        ),
                                                        h2: ({ children }) => (
                                                            <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">
                                                                {children}
                                                            </h2>
                                                        ),
                                                        h3: ({ children }) => (
                                                            <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">
                                                                {children}
                                                            </h3>
                                                        ),
                                                        h4: ({ children }) => (
                                                            <h4 className="text-base font-semibold text-foreground mt-4 mb-2">
                                                                {children}
                                                            </h4>
                                                        ),
                                                        p: ({ children }) => (
                                                            <p className="text-foreground leading-relaxed mb-4">
                                                                {children}
                                                            </p>
                                                        ),
                                                        ul: ({ children }) => (
                                                            <ul className="space-y-2 my-4 ml-6 list-disc">
                                                                {children}
                                                            </ul>
                                                        ),
                                                        ol: ({ children }) => (
                                                            <ol className="space-y-2 my-4 ml-6 list-decimal">
                                                                {children}
                                                            </ol>
                                                        ),
                                                        li: ({ children }) => (
                                                            <li className="text-foreground leading-relaxed pl-1">
                                                                {children}
                                                            </li>
                                                        ),
                                                        strong: ({ children }) => (
                                                            <strong className="font-semibold text-foreground">
                                                                {children}
                                                            </strong>
                                                        ),
                                                        em: ({ children }) => (
                                                            <em className="italic text-foreground">
                                                                {children}
                                                            </em>
                                                        ),
                                                        code: ({ children, className }) => {
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
                                                        pre: ({ children }) => (
                                                            <pre className="bg-muted border border-border rounded-lg p-4 my-4 overflow-x-auto">
                                                                {children}
                                                            </pre>
                                                        ),
                                                        blockquote: ({ children }) => (
                                                            <blockquote className="border-l-4 border-primary/30 pl-4 py-2 my-4 bg-muted/30 rounded-r italic text-muted-foreground">
                                                                {children}
                                                            </blockquote>
                                                        ),
                                                        a: ({ children, href }) => (
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
                                                        table: ({ children }) => (
                                                            <div className="my-4 overflow-x-auto">
                                                                <table className="w-full border-collapse">
                                                                    {children}
                                                                </table>
                                                            </div>
                                                        ),
                                                        th: ({ children }) => (
                                                            <th className="border border-border bg-muted p-3 text-left font-semibold">
                                                                {children}
                                                            </th>
                                                        ),
                                                        td: ({ children }) => (
                                                            <td className="border border-border p-3">
                                                                {children}
                                                            </td>
                                                        ),
                                                    }}
                                                >
                                                    {taskDetails.plan}
                                                </ReactMarkdown>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-4 max-h-48 overflow-y-auto border border-border">
                                    <div className="prose prose-sm dark:prose-invert max-w-none
                                        prose-headings:text-foreground prose-headings:font-semibold
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
                                            {taskDetails.plan}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                {/* Action Buttons for AWAITING_APPROVAL status */}
                                {taskDetails.status === 'AWAITING_APPROVAL' && onApprove && (
                                    <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                                        <Button
                                            onClick={onApprove}
                                            disabled={isLoading}
                                            className="gap-2"
                                        >
                                            {isLoading ? 'Processing...' : 'Approve & Execute'}
                                        </Button>
                                        {/* Edit Request - TODO: Implement feedback loop feature
                                        {onEdit && (
                                            <Button
                                                variant="outline"
                                                onClick={onEdit}
                                                disabled={isLoading}
                                            >
                                                Edit Request
                                            </Button>
                                        )}
                                        */}
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                )}
            </Card>
        );
    };

    const renderExecutionLog = () => {
        // Don't show if no execution log data at all
        if (!taskDetails.executionLog || (!taskDetails.executionLog.logs && !taskDetails.executionLog.message)) {
            return null;
        }

        // Render new logs format if available
        if (taskDetails.executionLog?.logs && taskDetails.executionLog.logs.length > 0) {
            const isFailed = taskDetails.executionLog.status === "FAILED";
            return (
                <Card className={`w-full mb-4 ${isFailed ? "border-destructive/50" : "border-border/50"}`}>
                    <CardHeader
                        className="cursor-pointer hover:bg-muted/50 pb-3"
                        onClick={() => toggleSection("execution")}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Execution Logs</CardTitle>
                                <CardDescription>
                                    {taskDetails.executionLog.logs.length} log entries
                                    {isFailed && <span className="text-destructive ml-2">(Failed)</span>}
                                </CardDescription>
                            </div>
                            {expandedSections.execution ? (
                                <ChevronUp className="w-5 h-5" />
                            ) : (
                                <ChevronDown className="w-5 h-5" />
                            )}
                        </div>
                    </CardHeader>
                    {expandedSections.execution && (
                        <CardContent>
                            <div className={`rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-xs ${isFailed
                                ? "bg-destructive/5 border border-destructive/20"
                                : "bg-muted/50 border border-border"
                                }`}>
                                {taskDetails.executionLog.logs.map((log, index) => (
                                    <div
                                        key={index}
                                        className={`py-1 ${log.toLowerCase().includes("error")
                                            ? "text-destructive font-semibold"
                                            : "text-muted-foreground"
                                            }`}
                                    >
                                        {log}
                                    </div>
                                ))}
                            </div>
                            {taskDetails.executionLog.error && (
                                <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                    <p className="text-xs font-semibold text-destructive mb-1">Error:</p>
                                    <p className="text-xs text-destructive/90 font-mono">{taskDetails.executionLog.error}</p>
                                </div>
                            )}
                        </CardContent>
                    )}
                </Card>
            );
        }

        // Fallback to old message format
        return (
            <Card className="w-full mb-4">
                <CardHeader
                    className="cursor-pointer hover:bg-muted/50 pb-3"
                    onClick={() => toggleSection("execution")}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base">Execution Log</CardTitle>
                            <CardDescription>Task execution status</CardDescription>
                        </div>
                        {expandedSections.execution ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </div>
                </CardHeader>
                {expandedSections.execution && (
                    <CardContent>
                        {!taskDetails.executionLog?.message ? (
                            <p className="text-sm text-muted-foreground italic">Execution log not available</p>
                        ) : (
                            <div className="bg-muted rounded-lg p-4">
                                <p className="text-sm text-muted-foreground">{taskDetails.executionLog.message}</p>
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>
        );
    };

    const renderResult = () => {
        const hasResult = taskDetails.result && Object.values(taskDetails.result).some((val) => val !== null && val !== undefined);

        // Don't show if no result data
        if (!hasResult) {
            return null;
        }

        return (
            <Card className="w-full mb-4">
                <CardHeader
                    className="cursor-pointer hover:bg-muted/50 pb-3"
                    onClick={() => toggleSection("result")}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base">Task Result</CardTitle>
                            <CardDescription>Outcome of the task execution</CardDescription>
                        </div>
                        {expandedSections.result ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </div>
                </CardHeader>
                {expandedSections.result && (
                    <CardContent className="space-y-3">
                        <>
                            {taskDetails.result?.prUrl && (
                                <div>
                                    <p className="text-sm font-medium text-foreground">Pull Request</p>
                                    <a
                                        href={taskDetails.result.prUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {taskDetails.result.prUrl}
                                    </a>
                                </div>
                            )}
                            {taskDetails.result?.review && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium text-foreground">Review</p>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <Maximize2 className="w-3.5 h-3.5" />
                                                    View Full Review
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0">
                                                <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
                                                    <DialogTitle className="text-xl font-semibold">Pull Request Review</DialogTitle>
                                                    <DialogDescription className="text-sm mt-2">
                                                        AI-powered code analysis and recommendations
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex-1 overflow-y-auto px-6 py-6">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            h1: ({ children }) => (
                                                                <h1 className="text-2xl font-bold text-foreground mt-8 mb-4 pb-3 border-b border-border first:mt-0">
                                                                    {children}
                                                                </h1>
                                                            ),
                                                            h2: ({ children }) => (
                                                                <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">
                                                                    {children}
                                                                </h2>
                                                            ),
                                                            h3: ({ children }) => (
                                                                <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">
                                                                    {children}
                                                                </h3>
                                                            ),
                                                            h4: ({ children }) => (
                                                                <h4 className="text-base font-semibold text-foreground mt-4 mb-2">
                                                                    {children}
                                                                </h4>
                                                            ),
                                                            p: ({ children }) => (
                                                                <p className="text-foreground leading-relaxed mb-4">
                                                                    {children}
                                                                </p>
                                                            ),
                                                            ul: ({ children }) => (
                                                                <ul className="space-y-2 my-4 ml-6 list-disc">
                                                                    {children}
                                                                </ul>
                                                            ),
                                                            ol: ({ children }) => (
                                                                <ol className="space-y-2 my-4 ml-6 list-decimal">
                                                                    {children}
                                                                </ol>
                                                            ),
                                                            li: ({ children }) => (
                                                                <li className="text-foreground leading-relaxed pl-1">
                                                                    {children}
                                                                </li>
                                                            ),
                                                            strong: ({ children }) => (
                                                                <strong className="font-semibold text-foreground">
                                                                    {children}
                                                                </strong>
                                                            ),
                                                            em: ({ children }) => (
                                                                <em className="italic text-foreground">
                                                                    {children}
                                                                </em>
                                                            ),
                                                            code: ({ children, className }) => {
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
                                                            pre: ({ children }) => (
                                                                <pre className="bg-muted border border-border rounded-lg p-4 my-4 overflow-x-auto">
                                                                    {children}
                                                                </pre>
                                                            ),
                                                            blockquote: ({ children }) => (
                                                                <blockquote className="border-l-4 border-primary/30 pl-4 py-2 my-4 bg-muted/30 rounded-r italic text-muted-foreground">
                                                                    {children}
                                                                </blockquote>
                                                            ),
                                                            a: ({ children, href }) => (
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
                                                            table: ({ children }) => (
                                                                <div className="my-4 overflow-x-auto">
                                                                    <table className="w-full border-collapse">
                                                                        {children}
                                                                    </table>
                                                                </div>
                                                            ),
                                                            th: ({ children }) => (
                                                                <th className="border border-border bg-muted p-3 text-left font-semibold">
                                                                    {children}
                                                                </th>
                                                            ),
                                                            td: ({ children }) => (
                                                                <td className="border border-border p-3">
                                                                    {children}
                                                                </td>
                                                            ),
                                                        }}
                                                    >
                                                        {taskDetails.result.review}
                                                    </ReactMarkdown>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-4 max-h-48 overflow-y-auto border border-border">
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
                                                {taskDetails.result.review}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    </CardContent>
                )}
            </Card>
        );
    };

    return (
        <div className="w-full mb-6">
            {/* Timeline Chat */}
            {taskDetails.timeline && taskDetails.timeline.length > 0 && (
                <div className="mb-6">
                    <TimelineChat timeline={taskDetails.timeline} />
                </div>
            )}

            {/* Other sections as collapsible cards */}
            {renderPlan()}
            {renderExecutionLog()}
            {renderResult()}
        </div>
    );
}
