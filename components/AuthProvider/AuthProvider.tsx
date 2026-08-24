'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '../../lib/store/authStore';
import { checkSession, getMe } from '../../lib/api/clientApi';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Проверяем, активна ли сессия (валидны ли куки)
        const session = await checkSession();
        
        if (session) {
          // Если сессия валидна, запрашиваем актуальные данные профиля
          const userData = await getMe();
          setUser(userData);
        } else {
          // Если сессии нет, очищаем глобальный стейт
          clearIsAuthenticated();
        }
      } catch (error) {
        // В случае любой ошибки (например, токен истек) сбрасываем авторизацию
        clearIsAuthenticated();
      }
    };

    initAuth();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}