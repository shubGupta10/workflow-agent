"use client";

import { createContext, useContext, ReactNode } from "react";

interface LayoutContextType {
    onToggleSidebar?: () => void;
    showHamburger?: boolean;
}

const LayoutContext = createContext<LayoutContextType>({});

export function LayoutProvider({
    children,
    value,
}: {
    children: ReactNode;
    value: LayoutContextType;
}) {
    return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export function useLayout() {
    return useContext(LayoutContext);
}
