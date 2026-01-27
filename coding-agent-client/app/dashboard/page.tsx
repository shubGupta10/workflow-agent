"use client";

import { UsageStatsCard } from "@/components/dashboard/UsageStatsCard";
import { RecentTasksCard } from "@/components/dashboard/RecentTasksCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTaskStore } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const { createSession } = useTaskStore();
    const router = useRouter();
    const [greeting, setGreeting] = useState("Welcome back");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    const handleNewTask = () => {
        createSession();
        router.push('/chat');
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1 tracking-tight">{greeting}</h1>
                    <p className="text-muted-foreground">
                        Ready to build something new today?
                    </p>
                </div>
                <Button onClick={handleNewTask} className="shadow-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Task
                </Button>
            </div>

            <div className="grid gap-6">
                {/* Usage Stats - Prominent at the top */}
                <UsageStatsCard />

                {/* Recent Tasks - Main list */}
                <RecentTasksCard />
            </div>
        </div>
    );
}
