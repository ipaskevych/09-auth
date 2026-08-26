import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from './lib/api/serverApi';

// Списки приватных и публичных маршрутов для проверки доступа
const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  // 1. Получаем токены явно из cookies браузера, как просил ментор
  let accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  // Переменная для хранения ответа, если нам потребуется обновить сессию
  let response = NextResponse.next();

  // 2. Если accessToken отсутствует, но есть refreshToken — пробуем обновить сессию
  if (!accessToken && refreshToken) {
    try {
      const sessionRes = await checkSession();
      
      if (sessionRes.status === 200) {
        accessToken = 'valid';

        // Сохраняем новые куки из ответа бэкенда в браузер пользователя
        const setCookieHeader = sessionRes.headers['set-cookie'];
        if (setCookieHeader) {
          setCookieHeader.forEach((cookieString) => {
            const [cookieNameValue, ...parts] = cookieString.split(';');
            const [name, value] = cookieNameValue.split('=');
            if (name && value) {
              response.cookies.set(name.trim(), value.trim());
            }
          });
        }
      }
    } catch (error) {
      accessToken = undefined;
    }
  }

  // 3. Если неавторизованный пользователь идет на защищенную страницу -> на логин
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  if (isPrivateRoute && !accessToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // 4. Если авторизованный пользователь идет на логин/регистрацию -> РЕДИРЕКТ НА ГЛАВНУЮ (/)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}