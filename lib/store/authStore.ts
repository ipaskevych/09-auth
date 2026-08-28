import { create } from 'zustand';
import { User } from '@/types/user';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
  updateUser: (updatedUser: User) => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: true }),
  
  clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),
  
  updateUser: (updatedUser) => set({ user: updatedUser }),
}));