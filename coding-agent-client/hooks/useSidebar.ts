"use client";

import { useState, useEffect } from "react";

export function useSidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            // Close sidebar on mobile by default
            if (mobile && isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        };

        // Check on mount
        checkMobile();

        // Add resize listener
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return {
        isSidebarOpen,
        isMobile,
        toggleSidebar,
        closeSidebar,
    };
}
