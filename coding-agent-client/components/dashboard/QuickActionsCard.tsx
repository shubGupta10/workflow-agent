"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings, BookOpen, ExternalLink, Cog } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/lib/store/store";

export function QuickActionsCard() {
    const router = useRouter();
    const { createSession } = useTaskStore();

    const handleNewTask = () => {
        createSession();
        router.push('/chat');
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and settings</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
                <Button
                    onClick={handleNewTask}
                    className="w-full justify-start h-auto py-3 px-4 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="bg-primary/20 p-2 rounded-full mr-3 shrink-0">
                        <Plus className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col items-start gap-1 text-left">
                        <span className="font-medium">New Task</span>
                        <span className="text-xs font-normal text-muted-foreground/80">Start a new coding session</span>
                    </div>
                </Button>

                <Button
                    variant="outline"
                    onClick={() => router.push('/settings')}
                    className="w-full justify-start h-auto py-3 px-4 group hover:bg-accent/50"
                >
                    <div className="bg-muted p-2 rounded-full mr-3 shrink-0 group-hover:bg-background transition-colors">
                        <Settings className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col items-start gap-1 text-left">
                        <span className="font-medium">Settings</span>
                        <span className="text-xs font-normal text-muted-foreground">Manage preferences</span>
                    </div>
                </Button>

                <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3 px-4 group hover:bg-accent/50 opacity-80"
                    disabled // Placeholder for now
                >
                    <div className="bg-muted p-2 rounded-full mr-3 shrink-0">
                        <BookOpen className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col items-start gap-1 text-left">
                        <span className="font-medium">Documentation</span>
                        <span className="text-xs font-normal text-muted-foreground">Learn how to use (Coming Soon)</span>
                    </div>
                </Button>
            </CardContent>
        </Card>
    );
}
