import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Именованный экспорт функции proxy, как на видео у преподавателя
export async function proxy(request: NextRequest) {
  // Определяем типы маршрутов
  const privateRoutes = ['/profile', '/notes'];
  const authRoutes = ['/sign-in', '/sign-up'];
  
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session-token')?.value || request.cookies.get('auth-token')?.value;

  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  // Логика перенаправлений из лекции:
  if (isPrivateRoute) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (isAuthRoute) {
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }

  return NextResponse.next();
}

// Экспорт конфигурации matcher для Next.js
export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up']
};