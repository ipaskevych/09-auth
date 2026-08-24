import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Списки приватных и публичных маршрутов для проверки доступа
const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export function proxy(request: NextRequest) {
  // Получаем токен сессии из cookies браузера
  const token = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // 1. Если неавторизованный пользователь идет на защищенную страницу -> на логин
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // 2. Если авторизованный пользователь идет на логин/регистрацию -> в профиль
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

// Конфиг с маской путей (matcher), чтобы прокси срабатывал только для нужных страниц
export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};