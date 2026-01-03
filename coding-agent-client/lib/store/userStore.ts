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
      const user = await getMe();
      set({ user, isLoading: false });
    } catch (error: any) {
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
