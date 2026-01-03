"use client"

import { Sidebar } from "@/components/Sidebar";
import { TaskView } from "@/components/TaskView";

export default function ChatPage() {
    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <TaskView />
        </div>
    );
}
