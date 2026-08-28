'use client';

import React, { useEffect, useState } from 'react';
import { clientApi } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const user = await clientApi.checkSession();
        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch (error) {
        console.error('Session check failed:', error);
        clearIsAuthenticated();
      } finally {
        setIsInitializing(false);
      }
    }

    initAuth();
  }, [setUser, clearIsAuthenticated]);

  if (isInitializing) {
    return null; // Предотвращает мигание старого интерфейса при загрузке
  }

  return <>{children}</>;
}