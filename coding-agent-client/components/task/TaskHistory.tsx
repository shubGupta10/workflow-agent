"use client";

import { TaskDetails } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { TimelineChat } from "./TimelineChat";

interface TaskHistoryProps {
    taskDetails: TaskDetails;
}

export function TaskHistory({ taskDetails }: TaskHistoryProps) {
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
                            <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto prose prose-sm max-w-none border border-border">
                                <ReactMarkdown
                                    components={{
                                        h2: ({ children }: any) => (
                                            <h2 className="text-base font-semibold mt-4 mb-2">{children}</h2>
                                        ),
                                        h3: ({ children }: any) => (
                                            <h3 className="text-sm font-semibold mt-3 mb-1">{children}</h3>
                                        ),
                                        p: ({ children }: any) => (
                                            <p className="text-sm text-muted-foreground mb-2">{children}</p>
                                        ),
                                        ul: ({ children }: any) => (
                                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                                {children}
                                            </ul>
                                        ),
                                        li: ({ children }: any) => (
                                            <li className="text-sm text-muted-foreground">{children}</li>
                                        ),
                                        strong: ({ children }: any) => (
                                            <strong className="font-semibold text-foreground">{children}</strong>
                                        ),
                                    }}
                                >
                                    {taskDetails.plan}
                                </ReactMarkdown>
                            </div>
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
                                    <p className="text-sm font-medium text-foreground mb-2">Review</p>
                                    <div className="bg-muted rounded-lg p-3 max-h-48 overflow-y-auto">
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                            {taskDetails.result.review}
                                        </p>
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
            {renderRepoSummary()}
            {renderPlan()}
            {renderExecutionLog()}
            {renderResult()}
        </div>
    );
}
