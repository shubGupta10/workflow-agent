import { create } from 'zustand';

interface SidebarToggleStore {
    toggleSidebar: (() => void) | null;
    setToggleSidebar: (fn: (() => void) | null) => void;
}

export const useSidebarToggle = create<SidebarToggleStore>((set) => ({
    toggleSidebar: null,
    setToggleSidebar: (fn) => set({ toggleSidebar: fn }),
}));
