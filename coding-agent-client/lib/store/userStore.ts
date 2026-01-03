import { create } from "zustand";
import { getMe } from "../server/api";

export interface User {
  _id: string;
  name: string;
  email: string;
  githubId: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, error: null }),

  clearUser: () => set({ user: null, error: null }),

  fetchCurrentUser: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('[UserStore] Fetching current user...');
      const user = await getMe();
      console.log('[UserStore] User fetched:', user);
      set({ user, isLoading: false });
      console.log('[UserStore] User stored in Zustand');
    } catch (error: any) {
      console.error('[UserStore] Failed to fetch user:', error);
      set({ 
        user: null, 
        isLoading: false, 
        error: error.message || "Failed to fetch user" 
      });
      throw error;
    }
  },
}));

export const getCurrentUser = () => useAuthStore.getState().user;
