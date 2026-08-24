import type { Metadata } from 'next';
import { getMe } from '../../../lib/api/serverApi';
import css from './ProfilePage.module.css';

export const metadata: Metadata = {
  title: 'User Profile - NoteHub',
  description: 'View your profile details on NoteHub',
};

export default async function ProfilePage() {
  // Получаем данные пользователя на сервере через куки
  const user = await getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        
        {/* Шапка карточки профиля */}
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
        </div>

        {/* Аватарка пользователя */}
        <div className={css.avatarWrapper}>
          <img 
            src={user.avatar || '/default-avatar.png'} 
            alt="User Avatar" 
            width={128} 
            height={128} 
            className={css.avatar} 
          />
        </div>

        {/* Блок с текстовой информацией */}
        <div className={css.profileInfo}>
          
          {/* Обертка для имени пользователя и кнопки редактирования */}
          <div className={css.usernameWrapper}>
            <p>Username: {user.username}</p>
            <a href="/profile/edit" className={css.editProfileButton}>
              Edit Profile
            </a>
          </div>
          
          <p>Email: {user.email}</p>
        </div>

      </div>
    </main>
  );
}