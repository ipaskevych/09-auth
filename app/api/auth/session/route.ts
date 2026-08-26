import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../api'; 
import { parseSetCookie } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // 1. Если есть активный accessToken, сессия валидна
    if (accessToken) {
      return NextResponse.json({ success: true });
    }

    // 2. Если accessToken истёк, но есть refreshToken, пробуем обновить сессию
    if (refreshToken) {
      const apiRes = await api.get('auth/me', {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      const setCookie = apiRes.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parseSetCookie(cookieStr);

          if (parsed.value) {
            cookieStore.set(parsed.name, parsed.value, parsed);
          }
        }
      }

      return NextResponse.json(apiRes.data, { status: apiRes.status });
    }

    // 3. Если вообще никаких токенов нет
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  } catch (error) {
    if (isAxiosError(error)) {
      // 1. Сначала просто логируем ошибку в консоль
      logErrorResponse(error);

      // 2. Достаем реальный статус (например, 401) и данные ошибки от внешнего API
      const status = error.response?.status || 500;
      const errorData = error.response?.data || { error: error.message };

      // 3. Возвращаем их клиенту
      return NextResponse.json(errorData, { status });
    }

    // Если это какая-то другая непредвиденная ошибка кода
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}