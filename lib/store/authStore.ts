import { create } from 'zustand';
import { User } from '../../types/user';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
}

// Пишем строго по ТЗ: папка store, имяuseAuthStore, двойные скобки
export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  
  setUser: (user) => set({ user, isAuthenticated: true }),
  
  clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),
}));