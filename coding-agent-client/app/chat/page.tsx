"use client"

import { Sidebar } from "@/components/layout/Sidebar";
import { TaskView } from "@/components/task/TaskView";
import { useSidebarTasks } from "@/hooks/useSidebarTasks";

export default function ChatPage() {
    const { deleteTask } = useSidebarTasks();

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-background">
            <Sidebar onDeleteTask={deleteTask} />
            <TaskView />
        </div>
    );
}
