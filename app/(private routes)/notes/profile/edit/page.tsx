'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { updateMe } from '@/lib/api/clientApi';
import css from './EditProfilePage.module.css';

export default function EditProfilePage() {
  const router = useRouter();
  
  // Получаем текущего пользователя и метод для обновления стейта из Zustand
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Если данные пользователя еще не загрузились в стор, показываем заглушку
  if (!user) {
    return <p className={css.loading || ''}>Loading user data...</p>;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;

    try {
      // Отправляем PATCH запрос на бэкенд для обновления username
      const updatedUser = await updateMe({ username });
      
      // Обновляем данные пользователя в глобальном Zustand-сторе
      setUser(updatedUser);
      
      // После успешного обновления возвращаем пользователя на страницу профиля
      router.push('/profile');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {/* Отображаем аватарку текущего пользователя */}
        <div className={css.avatarWrapper || ''}>
          <img 
            src={user.avatar || '/default-avatar.png'} 
            alt="User Avatar" 
            width={128} 
            height={128} 
            className={css.avatar} 
          />
        </div>

        {/* Форма редактирования данных */}
        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper || ''}>
            <label htmlFor="username">Username: </label>
            <input 
              id="username"
              name="username"
              type="text"
              defaultValue={user.username} // Подставляем текущее имя по умолчанию
              className={css.input}
              required
            />
          </div>

          {/* Email по ТЗ выводится просто как текст, его редактировать нельзя */}
          <p>Email: {user.email}</p>

          {/* Блок действий с кнопками по ТЗ */}
          <div className={css.actions}>
            <button 
              type="submit" 
              className={css.saveButton} 
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button 
              type="button" 
              className={css.cancelButton}
              onClick={() => router.push('/profile')} // Кнопка отмены возвращает назад
            >
              Cancel
            </button>
          </div>
        </form>

        {error && <p className={css.error}>{error}</p>}
      </div>
    </main>
  );
}