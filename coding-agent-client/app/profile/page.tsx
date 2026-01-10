"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/userStore";
import { getLLMUsage } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Activity, ArrowUpCircle, ArrowDownCircle, Hash } from "lucide-react";

interface LLMUsageData {
    totalInputTokens: number;
    totalOutputTokens: number;
    totalTokens: number;
    taskCount: number;
    byPurpose: Array<{
        _id: string;
        inputTokens: number;
        outputTokens: number;
        totalTokens: number;
        count: number;
    }>;
    byModel: Array<{
        _id: string;
        inputTokens: number;
        outputTokens: number;
        totalTokens: number;
        count: number;
    }>;
}

export default function ProfilePage() {
    const { user, fetchCurrentUser, isLoading: userLoading } = useAuthStore();
    const [llmUsage, setLlmUsage] = useState<LLMUsageData | null>(null);
    const [usageLoading, setUsageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch user if not already loaded
                if (!user) {
                    await fetchCurrentUser();
                }

                // Fetch LLM usage
                setUsageLoading(true);
                const response = await getLLMUsage();
                if (response.data) {
                    setLlmUsage(response.data);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load profile data");
            } finally {
                setUsageLoading(false);
            }
        };

        loadData();
    }, []);

    const isLoading = userLoading || usageLoading;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-red-500/20">
                    <CardHeader>
                        <CardTitle className="text-red-500">Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Page Title */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Profile</h1>
                    <p className="text-muted-foreground mt-1">Manage your account and view usage statistics</p>
                </div>

                {/* User Info Section */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl">Account Information</CardTitle>
                        <CardDescription>Your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3 pb-3 border-b border-border">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-xl font-semibold text-primary">
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </span>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">{user?.name || "User"}</p>
                                <p className="text-sm text-muted-foreground">{user?.email || "No email"}</p>
                            </div>
                        </div>
                        {user?.githubId && (
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-muted-foreground">GitHub ID</span>
                                <span className="text-sm font-medium text-foreground">{user.githubId}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-muted-foreground">User ID</span>
                            <span className="text-sm font-mono text-foreground">{user?._id || "N/A"}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* AI Usage Section */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <CardTitle className="text-xl">AI Usage</CardTitle>
                        </div>
                        <CardDescription>Your LLM consumption statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Total Tokens */}
                            <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium text-muted-foreground">Total Tokens</span>
                                </div>
                                <p className="text-2xl font-bold text-foreground">
                                    {llmUsage?.totalTokens.toLocaleString() || 0}
                                </p>
                            </div>

                            {/* Task Count */}
                            <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                <div className="flex items-center gap-2 mb-2">
                                    <Hash className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium text-muted-foreground">Task Count</span>
                                </div>
                                <p className="text-2xl font-bold text-foreground">
                                    {llmUsage?.taskCount || 0}
                                </p>
                            </div>

                            {/* Input Tokens */}
                            <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                <div className="flex items-center gap-2 mb-2">
                                    <ArrowUpCircle className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-medium text-muted-foreground">Input Tokens</span>
                                </div>
                                <p className="text-2xl font-bold text-foreground">
                                    {llmUsage?.totalInputTokens.toLocaleString() || 0}
                                </p>
                            </div>

                            {/* Output Tokens */}
                            <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                <div className="flex items-center gap-2 mb-2">
                                    <ArrowDownCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-medium text-muted-foreground">Output Tokens</span>
                                </div>
                                <p className="text-2xl font-bold text-foreground">
                                    {llmUsage?.totalOutputTokens.toLocaleString() || 0}
                                </p>
                            </div>
                        </div>

                        {/* Model Info */}
                        {llmUsage?.byModel && llmUsage.byModel.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-border">
                                <h3 className="text-sm font-semibold text-foreground mb-3">Active Model</h3>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                    <span className="text-sm font-medium text-foreground">
                                        {llmUsage.byModel[0]._id}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {llmUsage.byModel[0].count} {llmUsage.byModel[0].count === 1 ? "task" : "tasks"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
