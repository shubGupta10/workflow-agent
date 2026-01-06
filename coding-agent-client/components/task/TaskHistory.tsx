"use client";

import { TaskDetails } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

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
        if (!taskDetails.repoSummary) return null;

        return (
            <Card className="w-full mb-4">
                <CardHeader
                    className="cursor-pointer hover:bg-muted/50 pb-3"
                    onClick={() => toggleSection("repo")}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base">Repository Summary</CardTitle>
                            <CardDescription>Repository information analyzed</CardDescription>
                        </div>
                        {expandedSections.repo ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </div>
                </CardHeader>
                {expandedSections.repo && (
                    <CardContent className="space-y-3">
                        {taskDetails.repoSummary.repoUrl && (
                            <div>
                                <p className="text-sm font-medium text-foreground">Repository URL</p>
                                <a
                                    href={taskDetails.repoSummary.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline"
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
                    </CardContent>
                )}
            </Card>
        );
    };

    const renderPlan = () => {
        if (!taskDetails.plan) return null;

        return (
            <Card className="w-full mb-4">
                <CardHeader
                    className="cursor-pointer hover:bg-muted/50 pb-3"
                    onClick={() => toggleSection("plan")}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base">
                                {taskDetails.action === "REVIEW_PR" ? "Review" : "Implementation Plan"}
                            </CardTitle>
                            <CardDescription>Plan details for this task</CardDescription>
                        </div>
                        {expandedSections.plan ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </div>
                </CardHeader>
                {expandedSections.plan && (
                    <CardContent>
                        <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto prose prose-sm max-w-none">
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
                    </CardContent>
                )}
            </Card>
        );
    };

    const renderExecutionLog = () => {
        if (!taskDetails.executionLog?.message) return null;

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
                        <div className="bg-muted rounded-lg p-4">
                            <p className="text-sm text-muted-foreground">{taskDetails.executionLog.message}</p>
                        </div>
                    </CardContent>
                )}
            </Card>
        );
    };

    const renderResult = () => {
        if (!taskDetails.result) return null;

        const hasResult = Object.values(taskDetails.result).some((val) => val !== null && val !== undefined);
        if (!hasResult) return null;

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
                        {taskDetails.result.prUrl && (
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
                        {taskDetails.result.review && (
                            <div>
                                <p className="text-sm font-medium text-foreground mb-2">Review</p>
                                <div className="bg-muted rounded-lg p-3 max-h-48 overflow-y-auto">
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {taskDetails.result.review}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>
        );
    };

    return (
        <div className="w-full space-y-4 mb-6 border-t border-border pt-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground">Task History</h3>
                    <p className="text-xs text-muted-foreground">Details from task execution</p>
                </div>
            </div>
            {renderRepoSummary()}
            {renderPlan()}
            {renderExecutionLog()}
            {renderResult()}
        </div>
    );
}
