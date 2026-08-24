'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/authStore';
import { logout } from '../../lib/api/clientApi';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const router = useRouter();
  
  // Берем данные, статус авторизации и функцию очистки из нашего Zustand-стора
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);

  const handleLogout = async () => {
    try {
      // Вызываем логаут на бэкенде, чтобы удалить куки сессии
      await logout();
      
      // Очищаем состояние в Zustand
      clearIsAuthenticated();
      
      // Перенаправляем пользователя на страницу логина
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {isAuthenticated && user ? (
        <>
          {/* Ссылки для авторизованного пользователя */}
          <li className={css.navigationItem}>
            <Link href="/profile" prefetch={false} className={css.navigationLink}>
              Profile
            </Link>
          </li>
          
          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user.email}</p>
            <button type="button" className={css.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          {/* Ссылки для неавторизованного пользователя */}
          <li className={css.navigationItem}>
            <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
              Login
            </Link>
          </li>
          
          <li className={css.navigationItem}>
            <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
              Sign Up
            </Link>
          </li>
        </>
      )}
    </>
  );
}