"use client";

import { TaskDetails } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Terminal, GitBranch, Code2 } from "lucide-react";
import { useState } from "react";
import { TimelineChat } from "./TimelineChat";
import { PlanDisplayCard, ReviewDisplayCard, CompletionCard } from "./SystemCard";

interface TaskHistoryProps {
    taskDetails: TaskDetails;
    onApprove?: () => void;
    onEdit?: () => void;
    isLoading?: boolean;
}

export function TaskHistory({ taskDetails, onApprove, onEdit, isLoading }: TaskHistoryProps) {
    const [showLogs, setShowLogs] = useState(false);
    const [showRepo, setShowRepo] = useState(false);

    const renderRepoSummary = () => {
        if (!taskDetails.repoSummary?.repoUrl) return null;

        return (
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRepo(!showRepo)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground p-0 h-auto font-normal"
                >
                    {showRepo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <GitBranch className="w-4 h-4" />
                    <span>Repository Info</span>
                </Button>

                {showRepo && (
                    <div className="mt-2 p-4 bg-muted/30 border rounded-lg text-sm space-y-2 animate-in fade-in slide-in-from-top-1">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-muted-foreground uppercase">URL</span>
                            <a href={taskDetails.repoSummary.repoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {taskDetails.repoSummary.repoUrl}
                            </a>
                        </div>
                        {taskDetails.repoSummary.languages?.length > 0 && (
                            <div className="flex gap-2">
                                <span className="text-muted-foreground">Languages:</span>
                                <span className="font-medium">{taskDetails.repoSummary.languages.join(", ")}</span>
                            </div>
                        )}
                        {taskDetails.repoSummary.framework && (
                            <div className="flex gap-2">
                                <span className="text-muted-foreground">Framework:</span>
                                <span className="font-medium">{taskDetails.repoSummary.framework}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderPlan = () => {
        if (!taskDetails.plan) return null;

        // If it's a PR Review task, usually the plan is just "Reviewing..." 
        // or it might be the actual review if the status skipped planning.
        // But assuming standard flow:

        return (
            <div className="mb-6">
                {/* No header needed, the card explains itself */}
                <PlanDisplayCard
                    plan={taskDetails.plan}
                    onApprove={onApprove || (() => { })}
                    onEdit={onEdit || (() => { })}
                    disabled={isLoading || taskDetails.status !== 'AWAITING_APPROVAL'}
                />
            </div>
        );
    };

    const renderExecutionLog = () => {
        if (!taskDetails.executionLog || (!taskDetails.executionLog.logs && !taskDetails.executionLog.message)) {
            return null;
        }

        const logs = taskDetails.executionLog.logs || [];
        const message = taskDetails.executionLog.message;
        const isFailed = taskDetails.executionLog.status === "FAILED";

        if (logs.length === 0 && !message) return null;

        return (
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLogs(!showLogs)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground p-0 h-auto font-normal"
                >
                    {showLogs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <Terminal className="w-4 h-4" />
                    <span>Execution Logs {isFailed && "(Failed)"}</span>
                </Button>

                {showLogs && (
                    <div className="mt-2 text-xs font-mono bg-zinc-950 text-zinc-300 p-4 rounded-lg overflow-x-auto max-h-64 animate-in fade-in slide-in-from-top-1 border border-zinc-800">
                        {logs.length > 0 ? (
                            logs.map((log, i) => (
                                <div key={i} className={`py-0.5 ${log.toLowerCase().includes("error") ? "text-red-400" : ""}`}>
                                    {log}
                                </div>
                            ))
                        ) : (
                            <div>{message}</div>
                        )}
                        {taskDetails.executionLog.error && (
                            <div className="text-red-400 mt-2 pt-2 border-t border-red-900/30">
                                <strong>Error:</strong> {taskDetails.executionLog.error}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderResult = () => {
        // Only show result if task is completed or has a result
        const hasResult = taskDetails.result && (taskDetails.result.prUrl || taskDetails.result.review);
        if (!hasResult) return null;

        return (
            <div className="mb-6">
                {taskDetails.result?.review ? (
                    <ReviewDisplayCard review={taskDetails.result.review} />
                ) : (
                    <CompletionCard
                        message={taskDetails.executionLog?.message || "Task completed successfully"}
                        prUrl={taskDetails.result?.prUrl}
                        onNewTask={() => { }} // History view doesn't handle new task creation directly usually, or we pass a no-op 
                    />
                )}
            </div>
        );
    };

    return (
        <div className="w-full max-w-3xl mx-auto pb-10">
            {/* Timeline Chat */}
            {taskDetails.timeline && taskDetails.timeline.length > 0 && (
                <div className="mb-8">
                    <TimelineChat timeline={taskDetails.timeline} />
                </div>
            )}

            {/* Structured Data Section - Rendered below timeline like a summary */}
            <div className="space-y-6">
                {renderRepoSummary()}
                {renderPlan()}
                {renderExecutionLog()}
                {renderResult()}
            </div>
        </div>
    );
}
