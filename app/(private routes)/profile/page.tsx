import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { serverApi } from '@/lib/api/serverApi';
import css from './ProfilePage.module.css';

export const metadata: Metadata = {
  title: 'User Profile | NoteHub',
  description: 'View your personal profile details on NoteHub.',
};

export default async function ProfilePage() {
  const user = await serverApi.getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          {/* 2. ИСПРАВЛЕНО: Заменили обычный тег <a> на компонент <Link> */}
          <Link href="/profile/edit" className={css.editProfile}>
            Edit Profile
          </Link>
        </div>
        
        <div className={css.avatarWrapper}>
          <Image 
            src={user.avatar || 'https://goit.global'} 
            alt="User Avatar" 
            width={120} 
            height={120} 
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}