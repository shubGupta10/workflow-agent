"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getLLMUsageSummary, getLLMUsageByModel, getLLMUsageByUseCase, UsageSummary, UsageByModel, UsageByUseCase } from "@/lib/api";
import { Activity, Sparkles, Target, DollarSign } from "lucide-react";

export default function SettingsPage() {
    const [summary, setSummary] = useState<UsageSummary | null>(null);
    const [byModel, setByModel] = useState<UsageByModel[]>([]);
    const [byUseCase, setByUseCase] = useState<UsageByUseCase[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsageData = async () => {
            try {
                const [summaryRes, modelRes, useCaseRes] = await Promise.all([
                    getLLMUsageSummary(),
                    getLLMUsageByModel(),
                    getLLMUsageByUseCase()
                ]);

                setSummary(summaryRes.data);
                setByModel(modelRes.data);
                setByUseCase(useCaseRes.data);
            } catch (error) {
                console.error('Failed to fetch usage data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsageData();
    }, []);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat().format(num);
    };

    const formatCost = (cost: number) => {
        return `$${cost.toFixed(4)}`;
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground mt-2">Manage your account and view usage analytics</p>
                </div>

                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">LLM Usage Analytics</h2>

                        {loading ? (
                            <div className="grid gap-4 md:grid-cols-3 mb-6">
                                <Skeleton className="h-32" />
                                <Skeleton className="h-32" />
                                <Skeleton className="h-32" />
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-4 md:grid-cols-3 mb-6">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
                                            <Activity className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{formatNumber(summary?.totalTokens || 0)}</div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Across all requests
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{formatCost(summary?.totalCost || 0)}</div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Estimated spend
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
                                            <Target className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{formatNumber(summary?.requestCount || 0)}</div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Total LLM calls
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Sparkles className="h-5 w-5" />
                                                Usage by Model
                                            </CardTitle>
                                            <CardDescription>Breakdown of token usage per model</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {byModel.length === 0 ? (
                                                <p className="text-sm text-muted-foreground">No usage data yet</p>
                                            ) : (
                                                <div className="space-y-4">
                                                    {byModel.map((model) => (
                                                        <div key={model.modelId} className="border border-border rounded-lg p-4">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <p className="text-sm font-medium">{model.modelId}</p>
                                                                <div className="text-sm font-semibold">{formatCost(model.totalCost)}</div>
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-2 text-xs">
                                                                <div>
                                                                    <p className="text-muted-foreground">Input</p>
                                                                    <p className="font-medium">{formatNumber(model.inputTokens)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-muted-foreground">Output</p>
                                                                    <p className="font-medium">{formatNumber(model.outputTokens)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-muted-foreground">Total</p>
                                                                    <p className="font-medium">{formatNumber(model.totalTokens)}</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground mt-2">
                                                                {model.requestCount} {model.requestCount === 1 ? 'request' : 'requests'}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Target className="h-5 w-5" />
                                                Usage by Use Case
                                            </CardTitle>
                                            <CardDescription>Breakdown of token usage per task type</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {byUseCase.length === 0 ? (
                                                <p className="text-sm text-muted-foreground">No usage data yet</p>
                                            ) : (
                                                <div className="space-y-4">
                                                    {byUseCase.map((uc) => (
                                                        <div key={uc.useCase} className="border border-border rounded-lg p-4">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <p className="text-sm font-medium">{uc.useCase.replace(/_/g, ' ')}</p>
                                                                <div className="text-sm font-semibold">{formatCost(uc.totalCost)}</div>
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-2 text-xs">
                                                                <div>
                                                                    <p className="text-muted-foreground">Input</p>
                                                                    <p className="font-medium">{formatNumber(uc.inputTokens)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-muted-foreground">Output</p>
                                                                    <p className="font-medium">{formatNumber(uc.outputTokens)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-muted-foreground">Total</p>
                                                                    <p className="font-medium">{formatNumber(uc.totalTokens)}</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground mt-2">
                                                                {uc.requestCount} {uc.requestCount === 1 ? 'request' : 'requests'}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
