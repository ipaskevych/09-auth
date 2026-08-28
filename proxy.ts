import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { serverApi } from './lib/api/serverApi'; // Проверяем путь к твоему серверному API

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

// Вспомогательная функция для проброса обновленных кук дальше в браузер
function applySetCookie(
  response: NextResponse,
  setCookie: string | string[] | undefined
): NextResponse {
  if (!setCookie) {
    return response;
  }

  const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
  for (const cookieStr of cookieArray) {
    response.headers.append('set-cookie', cookieStr);
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isPrivateRoute && !isPublicRoute) {
    return NextResponse.next();
  }

  // Спершу перевіряємо самі куки, а не одразу ходимо на сервер.
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let isAuthenticated = Boolean(accessToken);
  let setCookieHeader: string | string[] | undefined;

  // accessToken відсутній, але є refreshToken — намагаємось оновити сесію.
  if (!isAuthenticated && refreshToken) {
    try {
      // Вызываем метод из твоего серверного API
      const sessionResponse = await serverApi.checkSession();
      // Если сессия успешно вернула данные пользователя, значит мы авторизованы
      isAuthenticated = Boolean(sessionResponse);
    } catch (error) {
      console.error('proxy: failed to refresh session:', error);
      isAuthenticated = false;
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    const response = NextResponse.redirect(new URL('/sign-in', request.url));
    return applySetCookie(response, setCookieHeader);
  }

  // Если авторизован, ТЗ просит перенаправлять на страницу профиля /profile
  if (isPublicRoute && isAuthenticated) {
    const response = NextResponse.redirect(new URL('/profile', request.url));
    return applySetCookie(response, setCookieHeader);
  }

  const response = NextResponse.next();
  return applySetCookie(response, setCookieHeader);
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};