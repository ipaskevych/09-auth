'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    // Принудительно сбрасываем кэш роутера для мгновенной проверки сессии прокси-сервером
    router.refresh();
  }, [router]);

  return <>{children}</>;
}