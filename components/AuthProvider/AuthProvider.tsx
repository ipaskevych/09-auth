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
        // 1. Сначала строго проверяем валидность сессии по ТЗ
        await clientApi.checkSession();
        
        // 2. Если сессия валидна (не выбросила ошибку), отдельным запросом получаем данные пользователя
        const user = await clientApi.getMe();
        
        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch (error) {
        console.error('Session verification or fetching user failed:', error);
        clearIsAuthenticated();
      } finally {
        setIsInitializing(false);
      }
    }

    initAuth();
  }, [setUser, clearIsAuthenticated]);

  if (isInitializing) {
    return null; // Предотвращает мигание интерфейса
  }

  return <>{children}</>;
}