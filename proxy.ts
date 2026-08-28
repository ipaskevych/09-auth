import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { serverApi } from './lib/api/serverApi'; // Проверяем относительный путь к твоему серверному API

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

  // Считываем токены сессии бэкенда
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let isAuthenticated = Boolean(accessToken);
  let setCookieHeader: string | string[] | undefined;

  // Если accessToken отсутствует, но есть refreshToken — обновляем сессию
  if (!isAuthenticated && refreshToken) {
    try {
      // 1. ИСПРАВЛЕНО: Получаем полный ответ от сервера
      const sessionResponse = await serverApi.checkSession();
      
      // Проверяем успешность (если сервер вернул статус 200)
      isAuthenticated = sessionResponse.status === 200;
      
      // 2. ИСПРАВЛЕНО: Вытягиваем новые заголовки set-cookie из ответа, о которых просил ментор
      setCookieHeader = sessionResponse.headers['set-cookie'];
    } catch (error) {
      console.error('proxy: failed to refresh session:', error);
      isAuthenticated = false;
    }
  }

  // Редирект неавторизованного пользователя на страницу входа
  if (isPrivateRoute && !isAuthenticated) {
    const response = NextResponse.redirect(new URL('/sign-in', request.url));
    return applySetCookie(response, setCookieHeader);
  }

  // 3. ИСПРАВЛЕНО: Редирект авторизованного пользователя ведет на главную страницу `/` по требованию ментора
  if (isPublicRoute && isAuthenticated) {
    const response = NextResponse.redirect(new URL('/', request.url));
    return applySetCookie(response, setCookieHeader);
  }

  const response = NextResponse.next();
  return applySetCookie(response, setCookieHeader);
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};