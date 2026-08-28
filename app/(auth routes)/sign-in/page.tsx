'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clientApi } from '@/lib/api/clientApi';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignInPage.module.css';

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const user = await clientApi.login({ email, password });
      setUser(user);
      router.push('/profile');
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message || 'Authentication failed';
      setError(errMsg);
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

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
            Log in
          </button>
        </div>

        {/* НАЧАЛО НОВОГО БЛОКА: Перенаправление на регистрацию */}
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#555' }}>
          Ещё нет аккаунта?{' '}
          <Link href="/sign-up" style={{ color: '#0284c7', textDecoration: 'underline', fontWeight: '500' }}>
            Зарегистрироваться
          </Link>
        </p>
        {/* КОНЕЦ НОВОГО БЛОКА */}

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}