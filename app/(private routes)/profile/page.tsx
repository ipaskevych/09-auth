import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getMe } from '@/lib/api/serverApi';
import Loader from './Loader';

// 1. Добавляем метаданные для страницы (Пункт 4 из замечаний ментора)
export const metadata: Metadata = {
  title: 'Профіль користувача | NoteHub',
  description: 'Ваш особистий кабінет у додатку NoteHub',
};

export default async function ProfilePage() {
  try {
    // 2. Получаем данные пользователя на сервере (Пункт 1 из замечаний ментора)
    const user = await getMe();

    // Если данные почему-то не пришли, показываем лоадер или ошибку
    if (!user) {
      return <Loader />;
    }

    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h1>User Profile</h1>
        <p>Welcome to your personal account!</p>

        {/* Отображаем аватарку через компонент Image (Пункт 2 из замечаний ментора) */}
        {user.avatar && (
          <div style={{ position: 'relative', width: '100px', height: '100px' }}>
            <Image
              src={user.avatar}
              alt={user.username || 'User avatar'}
              fill
              style={{ borderRadius: '50%', objectFit: 'cover' }}
              priority
            />
          </div>
        )}

        {/* Отображаем данные пользователя */}
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        {/* Добавляем ссылку Link на редактирование профиля (Пункт 3 из замечаний ментора) */}
        <Link 
          href="/profile/edit" 
          style={{ display: 'inline-block', marginTop: '10px', color: '#0070f3', textDecoration: 'underline' }}
        >
          Редагувати профіль
        </Link>
      </div>
    );
  } catch (error) {
    // В случае ошибки запроса возвращаем базовую заглушку с лоадером
    return <Loader />;
  }
}