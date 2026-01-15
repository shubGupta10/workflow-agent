"use client"

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TaskView } from "@/components/task/TaskView";
import { useSidebarTasks } from "@/hooks/useSidebarTasks";
import { useSidebar } from "@/hooks/useSidebar";
import { LayoutProvider } from "@/lib/context/LayoutContext";
import { useSidebarToggle } from "@/lib/store/sidebarToggleStore";

export default function ChatPage() {
    const { deleteTask } = useSidebarTasks();
    const { isSidebarOpen, isMobile, toggleSidebar, closeSidebar } = useSidebar();
    const { setToggleSidebar } = useSidebarToggle();

    useEffect(() => {
        setToggleSidebar(toggleSidebar);
        return () => setToggleSidebar(null);
    }, []);

    return (
        <LayoutProvider value={{ onToggleSidebar: toggleSidebar, showHamburger: true }}>
            <div className="flex h-[calc(100vh-4rem)] bg-background">
                <Sidebar
                    onDeleteTask={deleteTask}
                    isOpen={isSidebarOpen}
                    isMobile={isMobile}
                    onClose={closeSidebar}
                />
                <TaskView onToggleSidebar={toggleSidebar} isMobile={isMobile} />
            </div>
        </LayoutProvider>
    );
}
