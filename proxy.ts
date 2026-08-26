import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { checkSession } from './lib/api/serverApi';

// Списки приватных и публичных маршрутов для проверки доступа
const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  
  // 1. Получаем токены через современную асинхронную функцию cookies()
  let accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  let response = NextResponse.next();

  // 2. Если accessToken отсутствует, но есть refreshToken — пробуем обновить сессию
  if (!accessToken && refreshToken) {
    try {
      const sessionRes = await checkSession();
      
      if (sessionRes.status === 200) {
        accessToken = 'valid';

        // Извлекаем и парсим заголовок set-cookie встроенной утилитой по референсу
        const setCookieHeader = sessionRes.headers['set-cookie'];
        if (setCookieHeader) {
          const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
          for (const cookieStr of cookieArray) {
            const parsed = parseSetCookie(cookieStr);
            if (parsed.value) {
              // Обновляем куки в хранилище проекта
              cookieStore.set(parsed.name, parsed.value, parsed);
            }
          }
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

  // 4. Если авторизованный пользователь идет на логин/регистрацию -> редирект на главную
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}