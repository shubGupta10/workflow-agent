"use client"

import { Sidebar } from "@/components/layout/Sidebar";
import { TaskView } from "@/components/task/TaskView";

export default function ChatPage() {
    return (
        <div className="flex h-[calc(100vh-4rem)] bg-background">
            <Sidebar />
            <TaskView />
        </div>
    );
}
