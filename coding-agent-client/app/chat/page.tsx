"use client"

import { Sidebar } from "@/components/layout/Sidebar";
import { TaskView } from "@/components/task/TaskView";

export default function ChatPage() {
    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <TaskView />
        </div>
    );
}
