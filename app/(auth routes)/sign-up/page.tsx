'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link'; // Добавили импорт Link
import { clientApi } from '@/lib/api/clientApi';
import css from './SignUpPage.module.css';

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = email.split('@')[0];

    try {
      const user = await clientApi.register({ email, password, username });
      setUser(user);
      router.push('/profile');
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message || 'Registration failed';
      setError(errMsg);
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} onSubmit={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" className={css.input} required />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" className={css.input} required />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {/* НАЧАЛО НОВОГО БЛОКА: Перенаправление на логин */}
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#555' }}>
          Уже есть аккаунт?{' '}
          <Link href="/sign-in" style={{ color: '#0284c7', textDecoration: 'underline', fontWeight: '500' }}>
            Войти
          </Link>
        </p>
        {/* КОНЕЦ НОВОГО БЛОКА */}

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}